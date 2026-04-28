// Lumen — shared UI atoms (icons, badges, chips, mini-components)
// Depends on window.LUMEN tokens

const { c: LC, font: LF, r: LR } = window.LUMEN;

// ── Icons ──────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor', stroke = 1.6 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5"/></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8"/></>,
    book: <><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z"/><path d="M4 17h14"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></>,
    radar: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/><path d="M12 3v18M3 12h18"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    msg: <><path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevronR: <><path d="M9 6l6 6-6 6"/></>,
    chevronL: <><path d="M15 6l-6 6 6 6"/></>,
    check: <><path d="M5 12l5 5L20 7"/></>,
    play: <><path d="M6 4l14 8-14 8V4z" fill={color} stroke="none"/></>,
    bell: <><path d="M6 8a6 6 0 0112 0v4l2 4H4l2-4V8z"/><path d="M10 20a2 2 0 004 0"/></>,
    flag: <><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></>,
    award: <><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></>,
    file: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.6 1.6 0 001.8.3h0a1.6 1.6 0 001-1.5V3a2 2 0 014 0v.1a1.6 1.6 0 001 1.5h0a1.6 1.6 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8v0a1.6 1.6 0 001.5 1H21a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    heart: <><path d="M12 21s-7-4.5-9-10a5 5 0 019-3 5 5 0 019 3c-2 5.5-9 10-9 10z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    leaf: <><path d="M5 19c0-7 5-12 14-13-1 9-6 14-13 14 0 0 0-3 3-6"/></>,
    pen: <><path d="M16 3l5 5L8 21H3v-5L16 3z"/></>,
    bookmark: <><path d="M5 3h14v18l-7-4-7 4V3z"/></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
};

// ── Subject chip ──────────────────────────────────────────────
const SubjectChip = ({ subject, size = 'md' }) => {
  const map = {
    chinese: { color: LC.chinese, label: '中文', glyph: '中' },
    math:    { color: LC.math,    label: '数学', glyph: '∑' },
    english: { color: LC.english, label: 'English', glyph: 'A' },
    french:  { color: LC.french,  label: 'Français', glyph: 'F' },
    support: { color: LC.support, label: '学习支持', glyph: '✦' },
  };
  const s = map[subject];
  const px = size === 'sm' ? { p: '3px 8px', fs: 11, dot: 6 } : { p: '5px 10px', fs: 12, dot: 8 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: px.p, borderRadius: 999, fontSize: px.fs,
      fontFamily: LF.sans, fontWeight: 500, color: s.color,
      background: s.color + '14', border: `0.5px solid ${s.color}33`,
      letterSpacing: 0.2,
    }}>
      <span style={{ width: px.dot, height: px.dot, borderRadius: '50%', background: s.color }}/>
      {s.label}
    </span>
  );
};

// ── Card ──────────────────────────────────────────────────────
const Card = ({ children, style = {}, pad = 16, raised = false }) => (
  <div style={{
    background: LC.paper, borderRadius: LR.lg, padding: pad,
    border: `0.5px solid ${LC.line}`,
    boxShadow: raised ? '0 1px 2px rgba(31,26,20,0.04), 0 8px 24px rgba(31,26,20,0.06)' : 'none',
    ...style,
  }}>{children}</div>
);

// ── Section header (mini) ──────────────────────────────────────
const SectionLabel = ({ idx, title, action }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    margin: '0 0 10px',
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      {idx && <span style={{
        fontFamily: LF.serif, fontSize: 13, color: LC.gold, fontStyle: 'italic',
        letterSpacing: 0.5,
      }}>{idx} ·</span>}
      <h3 style={{
        margin: 0, fontFamily: LF.cn, fontSize: 17, fontWeight: 600,
        color: LC.ink, letterSpacing: 0.2,
      }}>{title}</h3>
    </div>
    {action && <span style={{
      fontFamily: LF.sans, fontSize: 12, color: LC.muted, fontWeight: 500,
    }}>{action}</span>}
  </div>
);

// ── Avatar (initial-based) ────────────────────────────────────
const Avatar = ({ name, size = 36, color = LC.gold }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color + '22', color: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: LF.serif, fontSize: size * 0.42, fontWeight: 600,
    border: `0.5px solid ${color}33`,
  }}>{name.slice(0, 1)}</div>
);

// ── Tab bar (bottom) ──────────────────────────────────────────
const TabBar = ({ active, onChange, tabs }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingBottom: 28, paddingTop: 8,
    background: 'linear-gradient(to top, rgba(245,239,230,0.97), rgba(245,239,230,0.85))',
    backdropFilter: 'blur(20px)',
    borderTop: `0.5px solid ${LC.line}`,
    display: 'flex', justifyContent: 'space-around',
    zIndex: 5,
  }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '6px 14px',
        color: active === t.key ? LC.gold : LC.muted,
      }}>
        <Icon name={t.icon} size={22} stroke={active === t.key ? 2 : 1.6} />
        <span style={{
          fontSize: 10, fontFamily: LF.sans, fontWeight: active === t.key ? 600 : 500,
          letterSpacing: 0.3,
        }}>{t.label}</span>
      </button>
    ))}
  </div>
);

// ── Radar chart (Ability Map) ──────────────────────────────────
const RadarChart = ({ data, size = 240, color = LC.gold, axes }) => {
  // data: array of values 0..100 in same order as axes
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.38;
  const n = data.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (v, i) => {
    const r = (v / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };
  const polyPts = data.map((v, i) => point(v, i).join(',')).join(' ');
  const rings = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* rings */}
      {rings.map(p => (
        <polygon key={p} points={
          Array.from({length: n}, (_, i) => {
            const r = (p / 100) * radius;
            return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))].join(',');
          }).join(' ')
        } fill="none" stroke={LC.line} strokeWidth="0.6" />
      ))}
      {/* spokes */}
      {data.map((_, i) => {
        const [x, y] = point(100, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={LC.line} strokeWidth="0.6" />;
      })}
      {/* data polygon */}
      <polygon points={polyPts} fill={color + '33'} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      {/* dots */}
      {data.map((v, i) => {
        const [x, y] = point(v, i);
        return <circle key={i} cx={x} cy={y} r="3" fill={LC.paper} stroke={color} strokeWidth="1.4"/>;
      })}
      {/* labels */}
      {axes && axes.map((label, i) => {
        const [x, y] = point(118, i);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: LF.cn, fontSize: 11, fill: LC.inkSoft, fontWeight: 500 }}
        >{label}</text>;
      })}
    </svg>
  );
};

Object.assign(window, { Icon, SubjectChip, Card, SectionLabel, Avatar, TabBar, RadarChart, LC, LF, LR });
