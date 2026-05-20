// Lumen Staff Backend — 教务后台
// Single-page desktop tool · 本周排课全景

const { useState, useMemo, useEffect } = React;

// ── Tokens ────────────────────────────────────────────────────
const T = {
  c: {
    paper: '#FFFFFF',
    bg: '#FAFAF7',
    ink: '#0A0A0A',
    inkSoft: '#3A3A3A',
    muted: '#8E8E8E',
    line: '#E6E4DD',
    lineSoft: '#F0EEE8',
    cream: '#F7F5F1',
    chinese: '#FF5C3D', chineseLight: '#FFE5DC',
    math:    '#1F4D3F', mathLight:    '#E5EDE7',
    english: '#3B6EA8', englishLight: '#E2EBF4',
    french:  '#C9A227', frenchLight:  '#FBF1C9',
  },
  font: {
    display: '"Archivo Black", "Inter", "Noto Sans SC", sans-serif',
    sans:    '"Inter", "Noto Sans SC", sans-serif',
    cn:      '"Noto Sans SC", "PingFang SC", sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  }
};

// ── Schedule data ─────────────────────────────────────────────
const ROOMS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TIME_SLOTS = ['09:30', '10:15', '11:00', '11:45', '13:30', '14:15', '15:00', '15:45'];

// 老师能力矩阵 — 真实约束的来源
// 老师 A: 中文 / 数学 / 法语
// 老师 B: 中文 / 数学 / 英语 / 法语
// 老师 C: 数学（only）
// 老师 D: 英语 / 法语
// → 中文最稀缺(A·B 最多 2 班)，英语次稀缺(B·D 最多 2 班)，数学最足(A·B·C 最多 3 班)，法语足(A·B·D 最多 3 班)

// 周六/周日满员排课 — 真实可推导版本
// 上午：A B C D 各守一间教室，每节换一个级别（同科多级）
// 午休后：换科目，让每个孩子一天能走完 4 科
const SCHEDULE_WEEKEND = {
  // ── 上午：每位老师上自己最强的科 ──
  '09:30': {
    A: { subject: 'chinese', level: 'HSK 1', teacher: '老师A', n: 8 },
    B: { subject: 'chinese', level: 'HSK 2', teacher: '老师B', n: 7 },
    C: { subject: 'math',    level: 'Koala', teacher: '老师C', n: 9 },
    D: { subject: 'french',  level: 'A1',    teacher: '老师D', n: 6 },
    E: null, F: null,
  },
  '10:15': {
    A: { subject: 'chinese', level: 'HSK 3', teacher: '老师A', n: 5 },
    B: { subject: 'chinese', level: 'HSK 4', teacher: '老师B', n: 4 },
    C: { subject: 'math',    level: 'Wallaby', teacher: '老师C', n: 8 },
    D: { subject: 'french',  level: 'A2',    teacher: '老师D', n: 7 },
    E: null, F: null,
  },
  '11:00': {
    // 此时 A B 切换：A 教数学（释放中文压力），B 教英语
    A: { subject: 'math',    level: 'Kangaroo', teacher: '老师A', n: 6 },
    B: { subject: 'english', level: 'Starters', teacher: '老师B', n: 9 },
    C: { subject: 'math',    level: 'Cadet',  teacher: '老师C', n: 5 },
    D: { subject: 'french',  level: 'B1',     teacher: '老师D', n: 5 },
    E: null, F: null,
  },
  '11:45': { lunch: true },
  // ── 下午：换科目，让孩子能走完没上的科 ──
  '13:30': {
    A: { subject: 'french',  level: 'B1', teacher: '老师A', n: 5 },
    B: { subject: 'french',  level: 'B2', teacher: '老师B', n: 4 },
    C: { subject: 'math',    level: 'Wallaby', teacher: '老师C', n: 7 },
    D: { subject: 'english', level: 'KET',  teacher: '老师D', n: 6 },
    E: null, F: null,
  },
  '14:15': {
    A: { subject: 'chinese', level: 'HSK 1', teacher: '老师A', n: 8 },
    B: { subject: 'chinese', level: 'HSK 2', teacher: '老师B', n: 7 },
    C: { subject: 'math',    level: 'Kangaroo', teacher: '老师C', n: 6 },
    D: { subject: 'english', level: 'PET',  teacher: '老师D', n: 5 },
    E: null, F: null,
  },
  '15:00': { selfStudy: true },
  '15:45': {
    A: null, B: null, C: null, D: null, E: null, F: null,
  },
};

// 8人模式 — 1 位老师 + 1 间教室即可覆盖
const SCHEDULE_SMALL = {
  '09:30': { A: { subject: 'chinese', level: 'HSK 1', teacher: '老师B', n: 5 }, B:null, C:null, D:null, E:null, F:null },
  '10:15': { A: { subject: 'math',    level: 'Koala', teacher: '老师B', n: 5 }, B:null, C:null, D:null, E:null, F:null },
  '11:00': { A: { subject: 'english', level: 'Starters', teacher: '老师D', n: 5 }, B:null, C:null, D:null, E:null, F:null },
  '11:45': { lunch: true },
  '13:30': { A: { subject: 'french',  level: 'A1', teacher: '老师D', n: 5 }, B:null, C:null, D:null, E:null, F:null },
  '14:15': { A: { subject: 'chinese', level: 'HSK 2', teacher: '老师B', n: 3 }, B:null, C:null, D:null, E:null, F:null },
  '15:00': { selfStudy: true },
  '15:45': { A: null, B: null, C: null, D: null, E: null, F: null },
};

// 20人模式 — 2-3 间教室够用
const SCHEDULE_MID = {
  '09:30': {
    A: { subject: 'chinese', level: 'HSK 1', teacher: '老师A', n: 7 },
    B: { subject: 'math',    level: 'Koala', teacher: '老师C', n: 6 },
    C: { subject: 'french',  level: 'A1',    teacher: '老师D', n: 5 },
    D: null, E: null, F: null,
  },
  '10:15': {
    A: { subject: 'chinese', level: 'HSK 2', teacher: '老师A', n: 5 },
    B: { subject: 'math',    level: 'Wallaby', teacher: '老师C', n: 6 },
    C: { subject: 'french',  level: 'A2',    teacher: '老师D', n: 5 },
    D: null, E: null, F: null,
  },
  '11:00': {
    A: { subject: 'english', level: 'Starters', teacher: '老师B', n: 7 },
    B: { subject: 'math',    level: 'Kangaroo', teacher: '老师C', n: 5 },
    C: null, D: null, E: null, F: null,
  },
  '11:45': { lunch: true },
  '13:30': {
    A: { subject: 'french',  level: 'B1', teacher: '老师A', n: 5 },
    B: { subject: 'english', level: 'KET', teacher: '老师D', n: 5 },
    C: null, D: null, E: null, F: null,
  },
  '14:15': {
    A: { subject: 'chinese', level: 'HSK 3', teacher: '老师B', n: 4 },
    B: null, C: null, D: null, E: null, F: null,
  },
  '15:00': { selfStudy: true },
  '15:45': { A: null, B: null, C: null, D: null, E: null, F: null },
};

// 周三 — 全天（学生平日不上课，可能是补课/小班/成人班）—— 仅 A·B 两间教室可用
const SCHEDULE_WED = {
  '09:30': {
    A: { subject: 'chinese', level: 'HSK 2', teacher: '老师A', n: 4 },
    B: { subject: 'french',  level: 'A2',    teacher: '老师D', n: 5 },
    C: null, D: null, E: null, F: null,
  },
  '10:15': {
    A: { subject: 'chinese', level: 'HSK 3', teacher: '老师A', n: 4 },
    B: { subject: 'math',    level: 'Wallaby', teacher: '老师C', n: 5 },
    C: null, D: null, E: null, F: null,
  },
  '11:00': {
    A: { subject: 'english', level: 'KET',  teacher: '老师D', n: 4 },
    B: { subject: 'math',    level: 'Kangaroo', teacher: '老师C', n: 5 },
    C: null, D: null, E: null, F: null,
  },
  '11:45': { lunch: true },
  '13:30': {
    A: { subject: 'chinese', level: 'HSK 4', teacher: '老师B', n: 3 },
    B: { subject: 'french',  level: 'B1',    teacher: '老师D', n: 4 },
    C: null, D: null, E: null, F: null,
  },
  '14:15': {
    A: { subject: 'chinese', level: 'HSK 5 · 成人', teacher: '老师A', n: 4 },
    B: { subject: 'french',  level: 'B2 · 成人',    teacher: '老师B', n: 3 },
    C: null, D: null, E: null, F: null,
  },
  '15:00': { selfStudy: true },
  '15:45': {
    A: { subject: 'chinese', level: 'HSK 5 · 成人', teacher: '老师A', n: 4 },
    B: null, C: null, D: null, E: null, F: null,
  },
};

const SUBJECT_LABEL = {
  chinese: { zh: '中文', en: 'CHINESE', color: T.c.chinese, bg: T.c.chineseLight },
  math:    { zh: '数学', en: 'MATHS',   color: T.c.math,    bg: T.c.mathLight },
  english: { zh: '英语', en: 'ENGLISH', color: T.c.english, bg: T.c.englishLight },
  french:  { zh: '法语', en: 'FRANÇAIS',color: T.c.french,  bg: T.c.frenchLight },
};

// ── Stats helpers ─────────────────────────────────────────────
function calcStats(schedule) {
  let classes = 0, students = 0, teachers = new Set(), subjectRooms = {chinese:new Set(), math:new Set(), english:new Set(), french:new Set()};
  Object.values(schedule).forEach(slot => {
    if (!slot || slot.lunch || slot.selfStudy) return;
    Object.entries(slot).forEach(([room, c]) => {
      if (c) {
        classes++;
        students += c.n;
        teachers.add(c.teacher);
        subjectRooms[c.subject]?.add(room);
      }
    });
  });
  return {
    classes, students, teachers: teachers.size,
    avg: classes > 0 ? Math.round(students / classes * 10) / 10 : 0,
    subjectRooms,
  };
}

// ── Sidebar nav ───────────────────────────────────────────────
function Sidebar({ active, onNav, onSignOut }) {
  // 实时读未审批数量
  if (window.LumenStore) window.LumenStore.useLumenStore();
  const pendingCount = window.LumenStore
    ? window.LumenStore.getRequests().filter(r => r.status === 'pending').length
    : 0;
  const items = [
    { id: 'schedule',  label: '排课全景', en: 'SCHEDULE' },
    { id: 'students',  label: '学生 / 老师', en: 'INTAKE' },
    { id: 'approvals', label: '审批',     en: 'APPROVALS', badge: pendingCount },
    { id: 'teachers',  label: '老师工时', en: 'PAYROLL' },
    { id: 'archive',   label: '档案管理', en: 'ARCHIVES' },
  ];
  return (
    <aside style={{
      width: 220, minHeight: '100vh',
      borderRight: `1px solid ${T.c.line}`,
      background: T.c.paper,
      padding: '28px 0',
      position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{
          fontFamily: T.font.display, fontSize: 18, letterSpacing: -0.4,
          color: T.c.ink,
        }}>Lumen<span style={{ color: T.c.math }}>.</span></div>
        <div style={{
          fontFamily: T.font.mono, fontSize: 9, letterSpacing: 1.5,
          color: T.c.muted, marginTop: 4, textTransform: 'uppercase',
        }}>Staff Backoffice · v0.1</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map(it => {
          const on = it.id === active;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              border: 'none', textAlign: 'left',
              padding: '12px 24px',
              background: on ? T.c.lineSoft : 'transparent',
              borderLeft: `3px solid ${on ? T.c.ink : 'transparent'}`,
              color: on ? T.c.ink : T.c.inkSoft,
              fontFamily: T.font.cn, fontSize: 14, fontWeight: on ? 600 : 500,
              display: 'flex', alignItems: 'baseline', gap: 8,
            }}>
              <span>{it.label}</span>
              <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.c.muted, letterSpacing: 1 }}>{it.en}</span>
              {it.badge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  minWidth: 18, height: 18, padding: '0 5px',
                  borderRadius: 9,
                  background: '#B83232', color: '#fff',
                  fontFamily: T.font.mono, fontSize: 10, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  alignSelf: 'center',
                }}>{it.badge > 99 ? '99+' : it.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
        <div style={{
          padding: 12, background: T.c.lineSoft, borderRadius: 6,
          fontFamily: T.font.cn, fontSize: 11, color: T.c.muted, lineHeight: 1.6,
        }}>
          <div style={{ fontFamily: T.font.mono, fontSize: 9, letterSpacing: 1.5, color: T.c.ink, marginBottom: 4 }}>ADMIN</div>
          周末班 · 课表已锁定<br/>
          下周需排：1 次调课
        </div>
        {onSignOut && (
          <button onClick={onSignOut} style={{
            marginTop: 10, width: '100%',
            border: `1px solid ${T.c.line}`,
            background: T.c.paper, color: T.c.muted,
            padding: '8px 10px',
            fontFamily: T.font.cn, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', borderRadius: 4,
            letterSpacing: 0.5,
          }}>退出登录</button>
        )}
      </div>
    </aside>
  );
}

// ── Top toolbar (day toggle + scenarios) ─────────────────────
function Toolbar({ day, setDay, scenario, setScenario, stats, onAutoSchedule }) {
  return (
    <div style={{
      borderBottom: `1px solid ${T.c.line}`,
      background: T.c.paper,
      padding: '20px 32px',
      minWidth: 1100,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2, color: T.c.muted, textTransform: 'uppercase' }}>
            01 · 排课全景
          </div>
          <h1 style={{
            margin: '4px 0 0', fontFamily: T.font.display, fontSize: 26, letterSpacing: -0.6, color: T.c.ink,
            whiteSpace: 'nowrap',
          }}>本周排课模拟 · 一天视图</h1>
        </div>
        <div style={{ fontFamily: T.font.mono, fontSize: 11, color: T.c.muted, letterSpacing: 1 }}>
          MAJ 2026.05.03 · 11:42
        </div>
      </div>

      {/* Day + scenario toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <ToggleGroup label="日视图" options={[
          { id: 'weekend', label: '周六 / 周日' },
          { id: 'wed',     label: '周三 · 仅 A/B' },
        ]} value={day} onChange={setDay}/>

        {day === 'weekend' && (
          <ToggleGroup label="规模" options={[
            { id: 'small', label: '8 名学生入学' },
            { id: 'mid',   label: '20 名学生入学' },
            { id: 'full',  label: '满员（40+）' },
            { id: 'auto',  label: '⚡ 自动排课' },
          ]} value={scenario} onChange={setScenario}/>
        )}

        {day === 'weekend' && (
          <button onClick={onAutoSchedule} style={{
            border: `1.5px solid ${T.c.ink}`,
            background: T.c.ink,
            color: T.c.paper,
            padding: '9px 16px',
            fontFamily: T.font.cn,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            cursor: 'pointer',
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}>⚡ 一键排课</button>
        )}

        <div style={{ flex: 1 }}/>

        <Stat n={stats.classes} unit="班次/天" tone="ink"/>
        <Stat n={stats.students} unit="人次/天" tone="ink"/>
        <Stat n={stats.avg} unit="人均班额" tone="muted"/>
        <Stat n={stats.teachers} unit="位老师出勤" tone="muted"/>
      </div>

      {/* Subject legend with rooms */}
      {day === 'weekend' && (
        <div style={{ marginTop: 18, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {Object.entries(SUBJECT_LABEL).map(([k, v]) => {
            const rooms = [...(stats.subjectRooms[k] || [])].sort();
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, background: v.bg, border: `1.5px solid ${v.color}`, display: 'inline-block' }}/>
                <span style={{ fontFamily: T.font.cn, fontSize: 13, color: T.c.ink, fontWeight: 600 }}>{v.zh}</span>
                {rooms.length > 0 && (
                  <span style={{ fontFamily: T.font.mono, fontSize: 11, color: T.c.muted }}>
                    ({rooms.join('·')})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <span style={{
        fontFamily: T.font.mono, fontSize: 9, letterSpacing: 1.5,
        color: T.c.muted, textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>{label}</span>
      <div style={{
        display: 'flex', border: `1px solid ${T.c.line}`, borderRadius: 4, overflow: 'hidden',
      }}>
        {options.map(opt => {
          const on = opt.id === value;
          return (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{
              border: 'none',
              padding: '8px 14px',
              background: on ? T.c.ink : T.c.paper,
              color: on ? T.c.paper : T.c.inkSoft,
              fontFamily: T.font.cn, fontSize: 12, fontWeight: 600,
              borderRight: opt === options[options.length-1] ? 'none' : `1px solid ${T.c.line}`,
              whiteSpace: 'nowrap',
            }}>{opt.label}</button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ n, unit, tone }) {
  return (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{
        fontFamily: T.font.display, fontSize: 26, lineHeight: 1, color: T.c.ink, letterSpacing: -0.5,
      }}>{n}</div>
      <div style={{
        fontFamily: T.font.cn, fontSize: 10, color: T.c.muted, marginTop: 4, letterSpacing: 1,
        whiteSpace: 'nowrap',
      }}>{unit}</div>
    </div>
  );
}

// ── Schedule grid (rooms × time) ──────────────────────────────
function ScheduleGrid({ schedule, day }) {
  const slots = day === 'wed' ? Object.keys(SCHEDULE_WED) : TIME_SLOTS;
  const rooms = day === 'wed' ? ['A', 'B'] : ROOMS;

  return (
    <div style={{ padding: 32, minWidth: 1100 }}>
      <div style={{
        background: T.c.paper, border: `1px solid ${T.c.line}`, borderRadius: 4, overflow: 'hidden',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `90px repeat(${rooms.length}, 1fr)`,
          borderBottom: `1px solid ${T.c.line}`,
          background: T.c.lineSoft,
        }}>
          <div style={{
            padding: '14px 16px',
            fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1.5, color: T.c.muted,
            textTransform: 'uppercase',
          }}>时间</div>
          {rooms.map(r => (
            <div key={r} style={{
              padding: '14px 16px',
              borderLeft: `1px solid ${T.c.line}`,
              fontFamily: T.font.cn, fontSize: 13, fontWeight: 700, color: T.c.ink,
            }}>教室 {r}</div>
          ))}
        </div>

        {/* Time slot rows */}
        {slots.map((time, ti) => {
          const slot = schedule[time];
          const isLunch = slot?.lunch;
          const isSelfStudy = slot?.selfStudy;

          if (isLunch || isSelfStudy) {
            return (
              <div key={time} style={{
                display: 'grid',
                gridTemplateColumns: `90px 1fr`,
                borderBottom: ti === slots.length-1 ? 'none' : `1px solid ${T.c.line}`,
                background: T.c.cream,
              }}>
                <div style={{
                  padding: '18px 16px',
                  fontFamily: T.font.mono, fontSize: 12, color: T.c.muted, fontWeight: 500,
                }}>{isLunch ? '午休' : time}</div>
                <div style={{
                  padding: '18px 16px', borderLeft: `1px solid ${T.c.line}`,
                  fontFamily: T.font.cn, fontSize: 13, color: T.c.inkSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {isLunch ? (
                    <><strong>午休</strong> · 12:30–13:30</>
                  ) : (
                    <><strong>自习 · 老师巡堂</strong> <span style={{ color: T.c.muted }}>· Lumen 特色</span></>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={time} style={{
              display: 'grid',
              gridTemplateColumns: `90px repeat(${rooms.length}, 1fr)`,
              borderBottom: ti === slots.length-1 ? 'none' : `1px solid ${T.c.line}`,
            }}>
              <div style={{
                padding: '18px 16px',
                fontFamily: T.font.mono, fontSize: 12, color: T.c.inkSoft, fontWeight: 600,
              }}>{time}</div>
              {rooms.map(r => {
                const c = slot?.[r];
                return (
                  <div key={r} style={{
                    padding: 8,
                    borderLeft: `1px solid ${T.c.line}`,
                    minHeight: 88,
                  }}>
                    {c ? <ClassCard c={c}/> : <EmptyRoom/>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 20, padding: '14px 18px', background: T.c.cream,
        borderLeft: `3px solid ${T.c.ink}`,
        fontFamily: T.font.cn, fontSize: 12, color: T.c.inkSoft, lineHeight: 1.7,
      }}>
        <span style={{ fontWeight: 700, color: T.c.ink }}>排课说明 · </span>
        点击课程格子可以查看详情 · 灰色为空教室可灵活调配 · 中文使用 A·B 教室、数学使用 A·B·C、英语使用 B·D、法语使用 A·D · 满员日老师 4 位轮班
      </div>
    </div>
  );
}

function ClassCard({ c }) {
  const sub = SUBJECT_LABEL[c.subject];
  return (
    <div style={{
      background: sub.bg,
      borderLeft: `3px solid ${sub.color}`,
      padding: '8px 10px',
      height: '100%',
      display: 'flex', flexDirection: 'column', gap: 4,
      cursor: 'pointer',
    }}>
      <div style={{
        fontFamily: T.font.cn, fontSize: 12, fontWeight: 700, color: sub.color, letterSpacing: 0,
      }}>{sub.zh}</div>
      <div style={{
        fontFamily: T.font.sans, fontSize: 13, fontWeight: 700, color: T.c.ink, letterSpacing: 0,
      }}>{c.level}</div>
      <div style={{
        fontFamily: T.font.cn, fontSize: 10.5, color: T.c.muted, marginTop: 'auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.teacher}</span>
        <span style={{ fontFamily: T.font.mono, fontWeight: 500, flexShrink: 0 }}>{c.n} 人</span>
      </div>
    </div>
  );
}

function EmptyRoom() {
  return (
    <div style={{
      height: '100%',
      border: `1px dashed ${T.c.line}`,
      background: T.c.lineSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font.cn, fontSize: 11, color: T.c.muted,
    }}>
      空教室
    </div>
  );
}

// ── Other tabs (placeholders) ─────────────────────────────────
function PlaceholderTab({ title, en, desc }) {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2, color: T.c.muted, textTransform: 'uppercase' }}>
        {en}
      </div>
      <h1 style={{ margin: '4px 0 0', fontFamily: T.font.display, fontSize: 26, letterSpacing: -0.6, color: T.c.ink }}>
        {title}
      </h1>
      <div style={{
        marginTop: 32, padding: 40, background: T.c.paper, border: `1px dashed ${T.c.line}`, borderRadius: 4,
        fontFamily: T.font.cn, fontSize: 14, color: T.c.muted, textAlign: 'center', lineHeight: 1.8,
      }}>
        {desc}<br/>
        <span style={{ fontFamily: T.font.mono, fontSize: 11, color: T.c.muted }}>SCREEN UNDER DESIGN</span>
      </div>
    </div>
  );
}

// ── Solver report (shown when scenario === 'auto') ────────────
function SolverReport({ result }) {
  const { stats, unscheduled, ok } = result;
  return (
    <div style={{
      borderBottom: `1px solid ${T.c.line}`,
      background: ok ? '#F4F8F3' : '#FCF5EF',
      padding: '18px 32px',
      minWidth: 1100,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2,
          color: ok ? '#3F6B45' : '#A66537', textTransform: 'uppercase',
        }}>
          {ok ? '✓ SOLVER · 求解成功' : '⚠ SOLVER · 部分未排上'}
        </div>
        <span style={{ fontFamily: T.font.cn, fontSize: 13, color: T.c.ink }}>
          {stats.studentCount} 学生 · {stats.teacherCount} 老师 · 排出 {stats.totalClasses} 节课 · 平均 {stats.avgPerClass} 人/班
        </span>
        {unscheduled.length > 0 && (
          <span style={{ fontFamily: T.font.cn, fontSize: 12, color: '#A66537' }}>
            {unscheduled.length} 项未排上
          </span>
        )}
      </div>

      {unscheduled.length > 0 && (
        <div style={{ marginTop: 12, fontFamily: T.font.cn, fontSize: 12, color: T.c.inkSoft, lineHeight: 1.7 }}>
          <strong style={{ color: T.c.ink }}>未排课目：</strong>
          {unscheduled.slice(0, 8).map((u, i) => (
            <span key={i} style={{ marginRight: 14 }}>
              {u.studentName}·{({chinese:'中',math:'数',english:'英',french:'法'})[u.subject]}({u.level})
            </span>
          ))}
          {unscheduled.length > 8 && <span style={{ color: T.c.muted }}>…还有 {unscheduled.length - 8} 项</span>}
        </div>
      )}
    </div>
  );
}

// ── Login gate (password-protected) ──────────────────────────
const STAFF_PWD = 'lumen2026';
const STAFF_GATE_KEY = 'lumen_staff_unlocked';

function StaffGate() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem(STAFF_GATE_KEY) === '1'; } catch { return false; }
  });

  if (unlocked) {
    return <StaffApp onSignOut={() => {
      try { localStorage.removeItem(STAFF_GATE_KEY); } catch {}
      setUnlocked(false);
    }}/>;
  }
  return <StaffLogin onUnlock={() => {
    try { localStorage.setItem(STAFF_GATE_KEY, '1'); } catch {}
    setUnlocked(true);
  }}/>;
}

function StaffLogin({ onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e?.preventDefault?.();
    if (pwd.trim() === STAFF_PWD) {
      onUnlock();
    } else {
      setErr('密码错误');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: T.c.bg,
      fontFamily: T.font.cn,
    }}>
      <form onSubmit={submit} style={{
        background: T.c.paper,
        border: `1px solid ${T.c.line}`,
        padding: '48px 56px',
        width: 420,
        maxWidth: '90vw',
        borderRadius: 6,
      }}>
        <div style={{
          fontFamily: T.font.display, fontSize: 28, letterSpacing: -0.6, color: T.c.ink,
        }}>Lumen<span style={{ color: T.c.math }}>.</span></div>
        <div style={{
          fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1.5,
          color: T.c.muted, marginTop: 6, textTransform: 'uppercase',
        }}>STAFF BACKOFFICE · LOGIN</div>

        <h1 style={{
          margin: '32px 0 8px', fontSize: 22, color: T.c.ink, fontWeight: 700,
          letterSpacing: -0.3,
        }}>教务登录</h1>
        <p style={{
          margin: 0, fontSize: 13, color: T.c.muted, lineHeight: 1.6,
        }}>请输入教务密码以继续。如有疑问请联系校长。</p>

        <label style={{
          display: 'block', marginTop: 28,
          fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1.5,
          color: T.c.muted, textTransform: 'uppercase',
        }}>PASSWORD</label>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setErr(''); }}
          placeholder="••••••••"
          style={{
            display: 'block',
            width: '100%',
            border: `1px solid ${err ? '#C04A2B' : T.c.line}`,
            background: T.c.paper,
            padding: '14px 16px',
            marginTop: 8,
            fontFamily: T.font.mono,
            fontSize: 15,
            color: T.c.ink,
            borderRadius: 4,
            outline: 'none',
            letterSpacing: 1,
          }}
        />
        {err && (
          <div style={{
            marginTop: 8, fontSize: 12, color: '#C04A2B',
          }}>{err}</div>
        )}

        <button type="submit" style={{
          marginTop: 24,
          width: '100%',
          border: 'none',
          background: T.c.ink,
          color: T.c.paper,
          padding: '14px 16px',
          fontFamily: T.font.cn,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.5,
          borderRadius: 4,
          cursor: 'pointer',
        }}>进入后台</button>

        <div style={{
          marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.c.line}`,
          fontSize: 12, color: T.c.muted, lineHeight: 1.6,
        }}>
          <strong style={{ color: T.c.inkSoft }}>提示：</strong>
          密码登录后浏览器会记住，下次直接进入。共用电脑请用完<strong style={{ color: T.c.inkSoft }}>右上角"退出"</strong>清除。
        </div>
      </form>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
function StaffApp({ onSignOut }) {
  // Re-render when late-loaded JSX modules register themselves
  const [, forceRender] = useState(0);
  useEffect(() => {
    const onReady = () => forceRender(n => n + 1);
    window.addEventListener('lumen-staff-module-ready', onReady);
    return () => window.removeEventListener('lumen-staff-module-ready', onReady);
  }, []);

  const [tab, setTab] = useState('schedule');
  const [day, setDay] = useState('weekend');     // weekend | wed
  const [scenario, setScenario] = useState('full');  // small | mid | full | auto
  const [solverResult, setSolverResult] = useState(null);

  // Map solver slot times to staff.html time grid
  const SLOT_TIME_MAP = {
    s1: '09:30', s2: '10:15', s3: '11:00',
    s4: '13:30', s5: '14:15', s6: '15:00', s7: '15:45',
  };

  function runAutoSchedule() {
    if (!window.LumenSolver) return alert('排课求解器未加载');

    // 优先读录入数据，没有就用 demo
    const intake = window.LumenIntake?.get();
    let teachers, students;
    if (intake) {
      teachers = intake.teachers
        .filter(t => t.available)
        .map(t => ({
          id: t.id, name: t.name,
          can: Object.keys(t.can || {}).filter(k => t.can[k]),
        }));
      students = intake.students;
    } else {
      teachers = window.LumenSolver.DEMO.teachers;
      students = window.LumenSolver.DEMO.students;
    }
    const rooms = window.LumenSolver.DEMO.rooms;
    const r = window.LumenSolver.solve({ teachers, rooms, students, maxStudentsPerRoom: 6 });
    setSolverResult(r);

    // Convert solver output to staff schedule shape
    const conv = {};
    for (const slotId of Object.keys(r.schedule)) {
      const time = SLOT_TIME_MAP[slotId];
      if (!time) continue;
      conv[time] = {};
      for (const room of rooms) {
        const c = r.schedule[slotId][room];
        if (c) {
          conv[time][room] = {
            subject: c.subject === 'self' ? 'chinese' : c.subject, // self uses chinese color for now
            level: c.level,
            teacher: c.teacher,
            n: c.students.length,
            isSelfStudy: c.subject === 'self',
            studentNames: c.studentNames,
          };
        } else {
          conv[time][room] = null;
        }
      }
    }
    // Add lunch slot between AM and PM
    conv['11:45'] = { lunch: true };
    setSolverResult({ ...r, scheduleConverted: conv });
    setScenario('auto');
  }

  const schedule = useMemo(() => {
    if (day === 'wed') return SCHEDULE_WED;
    if (scenario === 'auto') return solverResult?.scheduleConverted || SCHEDULE_WEEKEND;
    return scenario === 'small' ? SCHEDULE_SMALL : scenario === 'mid' ? SCHEDULE_MID : SCHEDULE_WEEKEND;
  }, [day, scenario, solverResult]);

  const stats = useMemo(() => calcStats(schedule), [schedule]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active={tab} onNav={setTab} onSignOut={onSignOut}/>
      <main style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
        {tab === 'schedule' ? (
          <>
            <Toolbar day={day} setDay={setDay} scenario={scenario} setScenario={setScenario} stats={stats} onAutoSchedule={runAutoSchedule}/>
            {scenario === 'auto' && solverResult && (
              <SolverReport result={solverResult}/>
            )}
            <ScheduleGrid schedule={schedule} day={day}/>
          </>
        ) : tab === 'students' ? (
          (() => {
            const IntakeTab = window.IntakeTab;
            return IntakeTab ? <IntakeTab/> : <PlaceholderTab title="学生 / 老师" en="INTAKE" desc="加载中…"/>;
          })()
        ) : tab === 'archive' ? (
          (() => {
            const A = window.ArchiveTab;
            return A ? <A/> : <PlaceholderTab title="档案管理" en="ARCHIVES" desc="加载中…"/>;
          })()
        ) : tab === 'approvals' ? (
          (() => {
            const A = window.ApprovalsTab;
            return A ? <A/> : <PlaceholderTab title="审批" en="APPROVALS" desc="加载中…"/>;
          })()
        ) : (
          <PlaceholderTab title="老师工时" en="TEACHERS" desc="本月每位老师的课时数 / 班次 / 学生总数 / 工资测算"/>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StaffGate/>);

// expose for late-loaded modules
window.T = T;

// Babel standalone only auto-runs ONE text/babel script.
// Manually fetch + transform + execute additional JSX modules.
(async () => {
  const modules = ['lumen-staff-intake.jsx', 'lumen-staff-approvals.jsx', 'lumen-staff-archive.jsx'];
  for (const path of modules) {
    try {
      const src = await fetch(path).then(r => r.text());
      const out = window.Babel.transform(src, { presets: ['react'] });
      (new Function(out.code))();
    } catch (e) {
      console.error('[lumen-staff] failed to load module', path, e);
    }
  }
})();
