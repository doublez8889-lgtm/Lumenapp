// Lumen Staff — 数据录入界面（学生 / 老师）
// 录到 localStorage，刷新不丢。一键排课会优先用这里的数据。

const T = window.T; // shared design tokens from lumen-staff.jsx
const { useState: uIntakeState, useEffect: uIntakeEffect } = React;

// ── 级别选项 ──────────────────────────────────────────────────
const LEVEL_OPTIONS = {
  chinese: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
  math:    ['Pre', '小袋鼠', 'Benjamin', 'Cadet', 'Junior', 'Student'],
  english: ['Starters', 'Movers', 'Flyers', 'KET', 'PET', 'FCE'],
  french:  ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
};

const SUBJECT_LIST = [
  { id: 'chinese', zh: '中文', en: 'CHINESE' },
  { id: 'math',    zh: '数学', en: 'MATH' },
  { id: 'english', zh: '英语', en: 'ENGLISH' },
  { id: 'french',  zh: '法语', en: 'FRENCH' },
];

// ── localStorage 持久化 ───────────────────────────────────────
const LS_KEY = 'lumen_staff_intake';
function loadIntake() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function saveIntake(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

// 默认初始数据（首次进入显示）
function defaultIntake() {
  return {
    teachers: [
      { id: 'tA', name: '老师 A', can: { chinese: true, math: true, english: false, french: true }, available: true },
      { id: 'tB', name: '老师 B', can: { chinese: true, math: true, english: true,  french: true }, available: true },
      { id: 'tC', name: '老师 C', can: { chinese: false, math: true, english: false, french: false }, available: true },
      { id: 'tD', name: '老师 D', can: { chinese: false, math: false, english: true, french: true }, available: true },
    ],
    students: [
      { id: 'p1', name: '林小曜', levels: { chinese:'HSK3', math:'Cadet',    english:'KET',     french:'A2' } },
      { id: 'p2', name: '王安然', levels: { chinese:'HSK4', math:'Junior',   english:'PET',     french:'B1' } },
      { id: 'p3', name: '陈乐乐', levels: { chinese:'HSK2', math:'Benjamin', english:'Movers',  french:'A1' } },
      { id: 'p4', name: '李子安', levels: { chinese:'HSK3', math:'Cadet',    english:'KET',     french:'A2' } },
      { id: 'p5', name: '张恬恬', levels: { chinese:'HSK1', math:'小袋鼠',   english:'Starters',french:'A1' } },
      { id: 'p6', name: '赵佑宁', levels: { chinese:'HSK2', math:'Benjamin', english:'Movers',  french:'A2' } },
    ],
  };
}

// 全局 window 上暴露当前数据，让 StaffApp 一键排课能读到
window.LumenIntake = {
  get() {
    return loadIntake() || defaultIntake();
  },
  set(data) {
    saveIntake(data);
  },
};

// ── 主组件 ────────────────────────────────────────────────────
function IntakeTab() {
  const [data, setData] = uIntakeState(() => loadIntake() || defaultIntake());
  const [section, setSection] = uIntakeState('students'); // students | teachers

  // 持久化
  uIntakeEffect(() => {
    saveIntake(data);
  }, [data]);

  // ── 学生操作 ──────────────────────────────────────
  const addStudent = () => {
    const id = 'p' + Date.now();
    setData(d => ({
      ...d,
      students: [...d.students, {
        id, name: '新学生',
        levels: { chinese: 'HSK1', math: '小袋鼠', english: 'Starters', french: 'A1' },
      }],
    }));
  };
  const updateStudent = (id, patch) => {
    setData(d => ({
      ...d,
      students: d.students.map(s => s.id === id ? { ...s, ...patch } : s),
    }));
  };
  const updateStudentLevel = (id, sub, level) => {
    setData(d => ({
      ...d,
      students: d.students.map(s => s.id === id
        ? { ...s, levels: { ...s.levels, [sub]: level } }
        : s),
    }));
  };
  const delStudent = (id) => {
    setData(d => ({ ...d, students: d.students.filter(s => s.id !== id) }));
  };

  // ── 老师操作 ──────────────────────────────────────
  const addTeacher = () => {
    const id = 't' + Date.now();
    setData(d => ({
      ...d,
      teachers: [...d.teachers, {
        id, name: '新老师',
        can: { chinese: false, math: false, english: false, french: false },
        available: true,
      }],
    }));
  };
  const updateTeacher = (id, patch) => {
    setData(d => ({
      ...d,
      teachers: d.teachers.map(t => t.id === id ? { ...t, ...patch } : t),
    }));
  };
  const toggleTeacherCan = (id, sub) => {
    setData(d => ({
      ...d,
      teachers: d.teachers.map(t => t.id === id
        ? { ...t, can: { ...t.can, [sub]: !t.can[sub] } }
        : t),
    }));
  };
  const delTeacher = (id) => {
    setData(d => ({ ...d, teachers: d.teachers.filter(t => t.id !== id) }));
  };

  const reset = () => {
    if (!confirm('确认重置为默认数据？')) return;
    setData(defaultIntake());
  };

  return (
    <div style={{ minWidth: 1100 }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.c.line}`,
        background: T.c.paper,
        padding: '20px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2, color: T.c.muted, textTransform: 'uppercase' }}>
              02 · 学生与老师录入
            </div>
            <h1 style={{
              margin: '4px 0 0', fontFamily: T.font.display, fontSize: 26, letterSpacing: -0.6, color: T.c.ink,
            }}>本周数据 · 输入即生效</h1>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontFamily: T.font.mono, fontSize: 11, color: T.c.muted }}>
              {data.students.length} 学生 · {data.teachers.filter(t => t.available).length} 出勤老师
            </span>
            <button onClick={reset} style={{
              border: `1px solid ${T.c.line}`, background: T.c.paper, color: T.c.inkSoft,
              padding: '8px 14px', fontFamily: T.font.cn, fontSize: 12, cursor: 'pointer', borderRadius: 4,
            }}>重置</button>
          </div>
        </div>

        {/* Section toggle */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.c.line}`, marginTop: 8 }}>
          {[
            { id: 'students', label: '学生', n: data.students.length },
            { id: 'teachers', label: '老师', n: data.teachers.length },
          ].map(s => {
            const on = s.id === section;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                border: 'none', background: 'transparent',
                padding: '12px 20px', cursor: 'pointer',
                fontFamily: T.font.cn, fontSize: 14, fontWeight: 600,
                color: on ? T.c.ink : T.c.muted,
                borderBottom: `2px solid ${on ? T.c.ink : 'transparent'}`,
                marginBottom: -1,
              }}>
                {s.label} <span style={{ fontFamily: T.font.mono, fontSize: 11, marginLeft: 6, color: T.c.muted }}>({s.n})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 32px' }}>
        {section === 'students'
          ? <StudentList students={data.students} onUpdate={updateStudent} onUpdateLevel={updateStudentLevel} onDel={delStudent} onAdd={addStudent}/>
          : <TeacherList teachers={data.teachers} onUpdate={updateTeacher} onToggleCan={toggleTeacherCan} onDel={delTeacher} onAdd={addTeacher}/>}
      </div>
    </div>
  );
}

// ── 学生列表 ──────────────────────────────────────────────────
function StudentList({ students, onUpdate, onUpdateLevel, onDel, onAdd }) {
  return (
    <div>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: T.font.cn, fontSize: 13,
        background: T.c.paper, border: `1px solid ${T.c.line}`,
      }}>
        <thead>
          <tr style={{ background: T.c.lineSoft, borderBottom: `1px solid ${T.c.line}` }}>
            <Th>姓名</Th>
            {SUBJECT_LIST.map(s => <Th key={s.id}>{s.zh}</Th>)}
            <Th style={{ width: 60 }}></Th>
          </tr>
        </thead>
        <tbody>
          {students.map(stu => (
            <tr key={stu.id} style={{ borderBottom: `1px solid ${T.c.line}` }}>
              <Td>
                <input
                  value={stu.name}
                  onChange={(e) => onUpdate(stu.id, { name: e.target.value })}
                  style={cellInput}
                />
              </Td>
              {SUBJECT_LIST.map(s => (
                <Td key={s.id}>
                  <select
                    value={stu.levels?.[s.id] || ''}
                    onChange={(e) => onUpdateLevel(stu.id, s.id, e.target.value)}
                    style={cellSelect}
                  >
                    <option value="">—</option>
                    {LEVEL_OPTIONS[s.id].map(lv => (
                      <option key={lv} value={lv}>{lv}</option>
                    ))}
                  </select>
                </Td>
              ))}
              <Td>
                <button onClick={() => onDel(stu.id)} style={delBtn} title="删除">×</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAdd} style={addBtn}>+ 新增学生</button>
    </div>
  );
}

// ── 老师列表 ──────────────────────────────────────────────────
function TeacherList({ teachers, onUpdate, onToggleCan, onDel, onAdd }) {
  return (
    <div>
      <div style={{ fontFamily: T.font.cn, fontSize: 12, color: T.c.muted, marginBottom: 12 }}>
        勾选每位老师能教的科目；右侧"出勤"= 本周是否参与排课
      </div>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: T.font.cn, fontSize: 13,
        background: T.c.paper, border: `1px solid ${T.c.line}`,
      }}>
        <thead>
          <tr style={{ background: T.c.lineSoft, borderBottom: `1px solid ${T.c.line}` }}>
            <Th>姓名</Th>
            {SUBJECT_LIST.map(s => <Th key={s.id} style={{ textAlign: 'center', width: 80 }}>{s.zh}</Th>)}
            <Th style={{ textAlign: 'center', width: 80 }}>出勤</Th>
            <Th style={{ width: 60 }}></Th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id} style={{ borderBottom: `1px solid ${T.c.line}` }}>
              <Td>
                <input
                  value={t.name}
                  onChange={(e) => onUpdate(t.id, { name: e.target.value })}
                  style={cellInput}
                />
              </Td>
              {SUBJECT_LIST.map(s => (
                <Td key={s.id} style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!t.can?.[s.id]}
                    onChange={() => onToggleCan(t.id, s.id)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </Td>
              ))}
              <Td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={!!t.available}
                  onChange={(e) => onUpdate(t.id, { available: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </Td>
              <Td>
                <button onClick={() => onDel(t.id)} style={delBtn} title="删除">×</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAdd} style={addBtn}>+ 新增老师</button>
    </div>
  );
}

// ── 基本样式 ──────────────────────────────────────────────────
function Th({ children, style }) {
  return (
    <th style={{
      padding: '10px 14px',
      fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1.2,
      color: T.c.muted, textTransform: 'uppercase',
      textAlign: 'left', fontWeight: 600,
      ...style,
    }}>{children}</th>
  );
}
function Td({ children, style }) {
  return (
    <td style={{ padding: '8px 14px', verticalAlign: 'middle', ...style }}>{children}</td>
  );
}

const cellInput = {
  border: `1px solid ${T.c.line}`,
  background: T.c.paper,
  padding: '6px 10px',
  fontFamily: 'inherit',
  fontSize: 13,
  color: T.c.ink,
  borderRadius: 3,
  width: '100%',
  maxWidth: 180,
};

const cellSelect = {
  border: `1px solid ${T.c.line}`,
  background: T.c.paper,
  padding: '6px 8px',
  fontFamily: 'inherit',
  fontSize: 12,
  color: T.c.ink,
  borderRadius: 3,
  cursor: 'pointer',
};

const delBtn = {
  border: `1px solid ${T.c.line}`,
  background: T.c.paper,
  color: T.c.muted,
  width: 28, height: 28,
  fontSize: 16, lineHeight: 1,
  cursor: 'pointer',
  borderRadius: 3,
};

const addBtn = {
  marginTop: 16,
  border: `1.5px dashed ${T.c.line}`,
  background: 'transparent',
  color: T.c.inkSoft,
  padding: '12px 20px',
  fontFamily: T.font.cn,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: 4,
  width: '100%',
};

window.IntakeTab = IntakeTab;
window.dispatchEvent(new CustomEvent('lumen-staff-module-ready'));
