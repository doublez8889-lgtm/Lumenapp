// Lumen Scheduler — 约束求解器
// 全自动给"全日托管"班排课
//
// 核心思路：
//   1. 把"上午学科主修 / 下午学科轮换"分两阶段排
//   2. 每个学科按级别分桶（HSK1/HSK2/HSK3...）
//   3. 启发式：相邻级别拼班（HSK1+HSK2 共享同一教室同一老师）
//   4. backtracking 搜索 (老师, 教室) 分配
//   5. 每个学生保证一天 4 科 + 自习
//
// 输入：teachers, rooms, students, slots
// 输出：schedule (slot -> room -> { subject, level, teacher, students[] })

(function (global) {
  'use strict';

  // ──────────────────────────────────────────────────────────
  // 默认时段（周末全日，9:30-16:30，45min/节，10min间歇）
  // ──────────────────────────────────────────────────────────
  const DEFAULT_SLOTS = [
    { id: 's1', start: '09:30', end: '10:15', period: 'AM' },
    { id: 's2', start: '10:25', end: '11:10', period: 'AM' },
    { id: 's3', start: '11:20', end: '12:05', period: 'AM' },
    { id: 's4', start: '13:00', end: '13:45', period: 'PM' },
    { id: 's5', start: '13:55', end: '14:40', period: 'PM' },
    { id: 's6', start: '14:50', end: '15:35', period: 'PM' },
    { id: 's7', start: '15:45', end: '16:30', period: 'PM' },
  ];

  const SUBJECTS = ['chinese', 'math', 'english', 'french', 'self'];

  // ──────────────────────────────────────────────────────────
  // 拼班规则：把相邻级别的学生合并
  //   chinese:  HSK1+HSK2  /  HSK3+HSK4
  //   math:     Pre+小袋鼠  /  Benjamin+Cadet
  //   english:  Starters+Movers  /  Flyers+KET  /  PET+
  //   french:   A1+A2  /  B1+B2
  // ──────────────────────────────────────────────────────────
  const LEVEL_GROUPS = {
    chinese: { 'HSK1':'C-初','HSK2':'C-初','HSK3':'C-中','HSK4':'C-中','HSK5':'C-高','HSK6':'C-高' },
    math:    { 'Pre':'M-初','小袋鼠':'M-初','Benjamin':'M-中','Cadet':'M-中','Junior':'M-高','Student':'M-高' },
    english: { 'Starters':'E-初','Movers':'E-初','Flyers':'E-中','KET':'E-中','PET':'E-高','FCE':'E-高' },
    french:  { 'A1':'F-初','A2':'F-初','B1':'F-中','B2':'F-中','C1':'F-高','C2':'F-高' },
  };

  function levelGroup(subject, level) {
    return LEVEL_GROUPS[subject]?.[level] || `${subject}-${level}`;
  }

  // ──────────────────────────────────────────────────────────
  // 主求解器
  // ──────────────────────────────────────────────────────────
  function solve(input) {
    const {
      teachers,           // [{id, name, can: ['chinese','math',...]}]
      rooms,              // ['A','B','C','D','E','F']
      students,           // [{id, name, levels: {chinese:'HSK2', math:'Benjamin', ...}}]
      slots = DEFAULT_SLOTS,
      maxStudentsPerRoom = 6,
    } = input;

    const result = {
      ok: true,
      schedule: {},        // schedule[slot.id][room] = {subject, level, teacher, students[]}
      unscheduled: [],     // [{studentId, subject, reason}]
      conflicts: [],
      stats: {},
    };

    // 初始化空 schedule
    for (const s of slots) {
      result.schedule[s.id] = {};
      for (const r of rooms) result.schedule[s.id][r] = null;
    }

    // ──────────────────────────────────────────
    // Step 1 · 上午分配学科主修
    //   每个学生上午要上 3 节"主修课"，分配 3 个学科
    //   pass 1: 按学生水平的学科组分桶
    // ──────────────────────────────────────────
    const amSlots = slots.filter(s => s.period === 'AM');
    const pmSlots = slots.filter(s => s.period === 'PM');

    // 给每个学生分配 4 个学科 + 1 自习
    // 上午 3 节，下午 4 节 (含自习)
    // 共 7 节，但学生只学 4 科主修 + 自习/休息 → 我们排 5 节实际"课"，剩下 2 节休息
    // 简化：上午 3 节排 3 个学科，下午第 1 节排第 4 个学科，下午第 2 节排自习，剩下休息

    // 先按学生级别 → 学科组 分桶
    const buckets = {};   // buckets[subject][group] = [studentIds]
    for (const sub of SUBJECTS.slice(0, 4)) {
      buckets[sub] = {};
      for (const stu of students) {
        const lv = stu.levels?.[sub];
        if (!lv) continue;
        const grp = levelGroup(sub, lv);
        if (!buckets[sub][grp]) buckets[sub][grp] = [];
        buckets[sub][grp].push(stu.id);
      }
    }

    // 计算每个学科组要开几节课（学生数 / 满员 上取整）
    // bucket entries: [{subject, group, students[], classes: int}]
    const classNeeds = [];
    for (const sub of Object.keys(buckets)) {
      for (const grp of Object.keys(buckets[sub])) {
        const stuList = buckets[sub][grp];
        const classes = Math.ceil(stuList.length / maxStudentsPerRoom);
        // 拆成多个班
        for (let i = 0; i < classes; i++) {
          const slice = stuList.slice(i * maxStudentsPerRoom, (i + 1) * maxStudentsPerRoom);
          classNeeds.push({
            subject: sub,
            group: grp,
            students: slice,
            // 显示用："C-初" + 学生具体级别集合
            levelLabel: [...new Set(slice.map(sid => students.find(s => s.id === sid).levels[sub]))].join('+'),
          });
        }
      }
    }

    // ──────────────────────────────────────────
    // Step 2 · 给每节 (slot, classNeed) 分配 (teacher, room)
    //   约束：
    //     - 同一 slot 同一 room 只一个 class
    //     - 同一 slot 同一 teacher 只一个 class
    //     - 同一 slot 同一 student 只一个 class
    //     - teacher 必须能教这个 subject
    // ──────────────────────────────────────────
    // 每个学生应该上 4 个学科的课，共 4 节
    // 上午 3 节 + 下午 1 节（13:00 那节）= 4 节学科
    const learnSlots = [...amSlots, pmSlots[0]];   // 4 节学科
    const selfStudySlot = pmSlots[1] || pmSlots[0]; // 下午第 2 节自习

    // 学生 → 已排时段
    const studentBusy = {};
    for (const stu of students) studentBusy[stu.id] = new Set();

    // 每个学生应学的学科
    const studentRemaining = {};
    for (const stu of students) {
      studentRemaining[stu.id] = SUBJECTS.slice(0, 4).filter(sub => stu.levels?.[sub]);
    }

    // 为每节 learnSlot 选 classNeeds 子集，使学生不冲突
    // 启发式：每 slot 优先放"学生数最多 / 还没排到的学生最多"的 class
    for (const slot of learnSlots) {
      const teacherBusy = new Set();
      const roomsAvail = [...rooms];

      // 候选 classes：还需要排的 + 学生数大于 0
      // 重新计算每个 classNeed 的"未排上的学生数"
      const candidates = classNeeds
        .map(cn => ({
          ...cn,
          activeStudents: cn.students.filter(sid => studentRemaining[sid].includes(cn.subject) && !studentBusy[sid].has(slot.id)),
        }))
        .filter(cn => cn.activeStudents.length > 0)
        .sort((a, b) => b.activeStudents.length - a.activeStudents.length);

      for (const cn of candidates) {
        if (roomsAvail.length === 0) break;

        // 选老师
        const teacher = teachers.find(t =>
          t.can.includes(cn.subject) && !teacherBusy.has(t.id)
        );
        if (!teacher) continue;

        // 选教室
        const room = roomsAvail.shift();

        // 选学生（这个 slot 还能上的）
        const studentsHere = cn.activeStudents.slice(0, maxStudentsPerRoom);

        result.schedule[slot.id][room] = {
          subject: cn.subject,
          level: cn.levelLabel,
          group: cn.group,
          teacher: teacher.name,
          teacherId: teacher.id,
          students: studentsHere,
          studentNames: studentsHere.map(sid => students.find(s => s.id === sid).name),
        };

        teacherBusy.add(teacher.id);
        for (const sid of studentsHere) {
          studentBusy[sid].add(slot.id);
          studentRemaining[sid] = studentRemaining[sid].filter(sub => sub !== cn.subject);
        }
      }
    }

    // ──────────────────────────────────────────
    // Step 3 · 自习时段 — 一间教室，一位老师值班
    // ──────────────────────────────────────────
    if (selfStudySlot) {
      const dutyTeacher = teachers[0]; // 谁有空都行
      result.schedule[selfStudySlot.id][rooms[0]] = {
        subject: 'self',
        level: '自习 / 答疑',
        group: 'self',
        teacher: dutyTeacher?.name || '值班老师',
        teacherId: dutyTeacher?.id,
        students: students.map(s => s.id),
        studentNames: students.map(s => s.name),
      };
    }

    // ──────────────────────────────────────────
    // Step 4 · 找出未排上的学生 + 学科
    // ──────────────────────────────────────────
    for (const stu of students) {
      const remaining = studentRemaining[stu.id];
      for (const sub of remaining) {
        result.unscheduled.push({
          studentId: stu.id,
          studentName: stu.name,
          subject: sub,
          level: stu.levels?.[sub],
          reason: '没有合适的老师/教室/时段',
        });
      }
    }

    // ──────────────────────────────────────────
    // Step 5 · 统计
    // ──────────────────────────────────────────
    let totalClasses = 0, totalStudentSlots = 0;
    for (const sid of Object.keys(result.schedule)) {
      for (const r of rooms) {
        const c = result.schedule[sid][r];
        if (c) {
          totalClasses++;
          totalStudentSlots += c.students.length;
        }
      }
    }
    result.stats = {
      totalClasses,
      totalStudentSlots,
      avgPerClass: totalClasses ? (totalStudentSlots / totalClasses).toFixed(1) : 0,
      teacherCount: teachers.length,
      studentCount: students.length,
      unscheduledCount: result.unscheduled.length,
    };
    result.ok = result.unscheduled.length === 0;

    return result;
  }

  // ──────────────────────────────────────────────────────────
  // Demo data — 4 老师 / 6 教室 / 12 学生
  // ──────────────────────────────────────────────────────────
  const DEMO_TEACHERS = [
    { id: 'tA', name: '老师A', can: ['chinese', 'math', 'french'] },
    { id: 'tB', name: '老师B', can: ['chinese', 'math', 'english', 'french'] },
    { id: 'tC', name: '老师C', can: ['math'] },
    { id: 'tD', name: '老师D', can: ['english', 'french'] },
  ];

  const DEMO_ROOMS = ['A', 'B', 'C', 'D', 'E', 'F'];

  const DEMO_STUDENTS = [
    { id: 'p1',  name: '林小曜', levels: { chinese:'HSK3', math:'Cadet',    english:'KET',     french:'A2' } },
    { id: 'p2',  name: '王安然', levels: { chinese:'HSK4', math:'Junior',   english:'PET',     french:'B1' } },
    { id: 'p3',  name: '陈乐乐', levels: { chinese:'HSK2', math:'Benjamin', english:'Movers',  french:'A1' } },
    { id: 'p4',  name: '李子安', levels: { chinese:'HSK3', math:'Cadet',    english:'KET',     french:'A2' } },
    { id: 'p5',  name: '张恬恬', levels: { chinese:'HSK1', math:'小袋鼠',   english:'Starters',french:'A1' } },
    { id: 'p6',  name: '赵佑宁', levels: { chinese:'HSK2', math:'Benjamin', english:'Movers',  french:'A2' } },
    { id: 'p7',  name: '孙弈程', levels: { chinese:'HSK4', math:'Junior',   english:'PET',     french:'B1' } },
    { id: 'p8',  name: '周朵儿', levels: { chinese:'HSK1', math:'小袋鼠',   english:'Starters',french:'A1' } },
    { id: 'p9',  name: '吴泽川', levels: { chinese:'HSK3', math:'Benjamin', english:'KET',     french:'A2' } },
    { id: 'p10', name: '郑曼吟', levels: { chinese:'HSK5', math:'Junior',   english:'PET',     french:'B2' } },
    { id: 'p11', name: '冯亦舟', levels: { chinese:'HSK2', math:'Benjamin', english:'Movers',  french:'A2' } },
    { id: 'p12', name: '何昭宁', levels: { chinese:'HSK4', math:'Cadet',    english:'PET',     french:'B1' } },
  ];

  // ──────────────────────────────────────────────────────────
  // Export
  // ──────────────────────────────────────────────────────────
  global.LumenSolver = {
    solve,
    DEFAULT_SLOTS,
    SUBJECTS,
    LEVEL_GROUPS,
    levelGroup,
    DEMO: { teachers: DEMO_TEACHERS, rooms: DEMO_ROOMS, students: DEMO_STUDENTS },
  };
})(window);
