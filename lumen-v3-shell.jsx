// Lumen v3 — Interactive single-phone app
// 4 tabs · account switcher · two-level navigation
// Reuses V2 tokens, V2Tag, and V2ScreenProgress for the archive page

const { useState: u3State, useEffect: u3Effect } = React;

// ── Mock data ─────────────────────────────────────────────────
const ACCOUNTS = [
  { id: 'guest',    name: '访客',   role: 'guest',  sub: '未登录',      initial: '?',  courseLabel: '欢迎了解 Lumen' },
  { id: 'me',       name: '我',     role: 'authed', sub: '已登录',      initial: '我', courseLabel: '我的家庭', live: true },
  { id: 'parent',   name: '王女士',  role: 'parent', sub: '我（演示）',  initial: '王', courseLabel: '中文 HSK 5' },
  { id: 'lin',      name: '林小曜',  role: 'child',  sub: '孩子 · CM2',  initial: '林', courseLabel: '中文 HSK 3 · 数学 Wallaby · 法语 B1' },
  { id: 'wang',     name: '王小明',  role: 'child',  sub: '孩子 · CE1',  initial: '明', courseLabel: '中文 HSK 1 · 数学 Koala' },
];

const WEEK_SCHEDULE = {
  parent: [
    { day: 'WED', date: '04.30', dayCN: '周三', time: '20:00', dur: '90', title: '中文 HSK 5', subject: 'chinese', teacher: '老师A', mode: '线上 ZOOM' },
  ],
  // 林小曜 — 周六全天托管（5 节正课 + 自习）
  lin: [
    { day: 'WED', date: '04.30', dayCN: '周三', time: '17:30', dur: '45', title: '中文 HSK 3', subject: 'chinese', teacher: '老师A', mode: '线下 · 教室 A' },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '09:30', dur: '45', title: '中文 HSK 3', subject: 'chinese', teacher: '老师A', mode: '线下 · 教室 A', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '10:15', dur: '45', title: '数学 Wallaby', subject: 'math', teacher: '老师C', mode: '线下 · 教室 C', adjusted: true, dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '11:00', dur: '45', title: '法语 B1', subject: 'french', teacher: '老师D', mode: '线下 · 教室 D', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '13:30', dur: '45', title: '英语 KET', subject: 'english', teacher: '老师D', mode: '线下 · 教室 D', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '15:00', dur: '45', title: '自习 · 巡堂', subject: 'support', teacher: '老师B', mode: '线下 · 自习区', dayPlan: true },
  ],
  wang: [
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '09:30', dur: '45', title: '中文 HSK 1', subject: 'chinese', teacher: '老师A', mode: '线下 · 教室 A', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '10:15', dur: '45', title: '数学 Koala', subject: 'math', teacher: '老师C', mode: '线下 · 教室 C', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '11:00', dur: '45', title: '法语 A1', subject: 'french', teacher: '老师D', mode: '线下 · 教室 D', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '13:30', dur: '45', title: '英语 Starters', subject: 'english', teacher: '老师D', mode: '线下 · 教室 D', dayPlan: true },
    { day: 'SAT', date: '05.03', dayCN: '周六', time: '15:00', dur: '45', title: '自习 · 巡堂', subject: 'support', teacher: '老师B', mode: '线下 · 自习区', dayPlan: true },
  ],
};

const RECENT_FEEDBACK = {
  parent: { date: '04.20', subject: 'chinese', teacher: '老师A', text: '本周课文阅读把握很快，"莫愁前路无知己"的引申意义讨论得很主动。', tags: ['理解到位', '主动表达'] },
  lin:    { date: '04.24', subject: 'chinese', teacher: '老师A', text: '小曜对《示儿》"家祭无忘告乃翁"的情感把握非常细腻，主动联系自己的家人体验。', tags: ['朗读流畅', '理解到位', '需积累'] },
  wang:   null, // 没有最近反馈，刚开始上课
};

const QUARTER_HIGHLIGHT = {
  parent: { gain: 142, label: '生词量', detail: 'Lv.4 → Lv.5 阅读', daysToReview: 18 },
  lin:    { gain: 24,  label: '阅读理解', detail: '52 → 76 · Lv.4 → Lv.6', daysToReview: 12 },
  wang:   { gain: null, label: '入门期', detail: '建立学习档案中', daysToReview: 60 },
};

// ── Utility — display name ──────────────────────────────────
const subjectLabel = (s) => ({
  chinese: '中文', math: 'MATHS', english: 'ENGLISH', french: 'FRANÇAIS', support: '学习支持',
})[s];

// ────────────────────────────────────────────────────────────
// Account Switcher (top bar) — opens a dropdown
// ────────────────────────────────────────────────────────────
function AccountSwitcher({ activeId, onChange }) {
  const [open, setOpen] = u3State(false);
  const active = ACCOUNTS.find(a => a.id === activeId);

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: active.role === 'guest' ? 'transparent' : (active.role === 'parent' ? V2.c.cobalt : V2.c.ink),
          border: active.role === 'guest' ? `1.5px dashed ${V2.c.muted}` : 'none',
          color: active.role === 'guest' ? V2.c.muted : '#FFF',
          fontFamily: V2.font.cn, fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{active.initial}</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{active.name}</div>
          <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, marginTop: 2, letterSpacing: 0.5 }}>{active.sub.toUpperCase()}</div>
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginLeft: 2, transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke={V2.c.ink} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 50,
          }}/>
          <div style={{
            position: 'absolute', top: 36, left: -8, zIndex: 51,
            background: V2.c.paper, border: `1px solid ${V2.c.ink}`, minWidth: 220,
            boxShadow: '4px 4px 0 ' + V2.c.ink,
          }}>
            <div style={{
              padding: '8px 12px', borderBottom: `1px solid ${V2.c.line}`,
              fontFamily: V2.font.mono, fontSize: 9, fontWeight: 500,
              letterSpacing: 1.5, textTransform: 'uppercase', color: V2.c.muted,
            }}>SWITCH PROFILE · 切换</div>
            {ACCOUNTS.map(a => (
              <button key={a.id} onClick={() => { onChange(a.id); setOpen(false); }} style={{
                width: '100%', padding: '10px 12px', background: a.id === activeId ? V2.c.cobaltLight : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: `1px solid ${V2.c.lineSoft}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: a.role === 'guest' ? 'transparent' : (a.role === 'parent' ? V2.c.cobalt : V2.c.ink),
                  border: a.role === 'guest' ? `1.5px dashed ${V2.c.muted}` : 'none',
                  color: a.role === 'guest' ? V2.c.muted : '#FFF',
                  fontFamily: V2.font.cn, fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{a.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700 }}>{a.name} <span style={{ fontWeight: 400, color: V2.c.muted, fontSize: 11 }}>· {a.sub}</span></div>
                  <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, marginTop: 2, letterSpacing: 0.3 }}>{a.courseLabel}</div>
                </div>
                {a.id === activeId && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: V2.c.cobalt }}/>
                )}
              </button>
            ))}
            <button style={{
              width: '100%', padding: '10px 12px', background: 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: V2.font.cn, fontSize: 12, color: V2.c.muted,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `1px dashed ${V2.c.muted}`, color: V2.c.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>+</div>
              添加家庭成员
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Top masthead — fixed, includes account switcher
// ────────────────────────────────────────────────────────────
function V3TopBar({ activeId, onChangeAccount, onOpenNotifications, unreadCount = 0 }) {
  return (
    <div style={{ paddingTop: 54 }}>
      <div style={{
        padding: '12px 22px 12px',
        borderBottom: `1px solid ${V2.c.ink}`,
        background: V2.c.paper,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <AccountSwitcher activeId={activeId} onChange={onChangeAccount}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onOpenNotifications && (
            <button onClick={onOpenNotifications} aria-label="通知" style={{
              position: 'relative', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={V2.c.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  minWidth: 14, height: 14, padding: '0 3px',
                  background: V2.c.cobalt, color: '#fff',
                  fontFamily: V2.font.mono, fontSize: 9, fontWeight: 700,
                  borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${V2.c.paper}`,
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
          )}
          <div style={{
            fontFamily: V2.font.display, fontSize: 12, fontWeight: 800,
            letterSpacing: -0.1, lineHeight: 1, whiteSpace: 'nowrap',
          }}>Lumen<span style={{ color: V2.c.cobalt }}>.</span></div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Bottom Tab Bar
// ────────────────────────────────────────────────────────────
function V3TabBar({ active, onChange }) {
  const tabs = [
    { key: 'home', label: '首页', label2: 'HOME', icon: (s) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={s ? V2.c.ink : 'none'} stroke={V2.c.ink} strokeWidth="1.8">
        <path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z" strokeLinejoin="round"/>
      </svg>
    )},
    { key: 'archive', label: '档案', label2: 'FILE', icon: (s) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={V2.c.ink} strokeWidth={s ? 2.4 : 1.8}>
        <polygon points="12,3 21,9 18,20 6,20 3,9" strokeLinejoin="round" fill={s ? V2.c.ink : 'none'}/>
      </svg>
    )},
    { key: 'schedule', label: '课表', label2: 'CLASS', icon: (s) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={V2.c.ink} strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" fill={s ? V2.c.ink : 'none'} stroke={V2.c.ink}/>
        <path d="M3 10h18M8 3v4M16 3v4" stroke={s ? '#FFF' : V2.c.ink} strokeLinecap="round"/>
      </svg>
    )},
    { key: 'me', label: '我的', label2: 'ME', icon: (s) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={s ? V2.c.ink : 'none'} stroke={V2.c.ink} strokeWidth="1.8">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0,
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)',
      paddingTop: 14,
      background: 'linear-gradient(to bottom, rgba(247,243,234,0) 0%, rgba(247,243,234,0.85) 18%, rgba(247,243,234,0.97) 50%, ' + V2.c.paper + ' 100%)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 50,
      pointerEvents: 'auto',
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '4px 14px',
          opacity: active === t.key ? 1 : 0.45,
        }}>
          {t.icon(active === t.key)}
          <span style={{
            fontFamily: V2.font.mono, fontSize: 9, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase',
            color: V2.c.ink,
          }}>{t.label2}</span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { V3TopBar, V3TabBar, AccountSwitcher, ACCOUNTS, WEEK_SCHEDULE, RECENT_FEEDBACK, QUARTER_HIGHLIGHT, subjectLabel });
