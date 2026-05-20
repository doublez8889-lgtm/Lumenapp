// Lumen v2 — 鲜艳编辑风 (Magazine / Editorial)
// 纯白 + 大块色面 + 衡线体 display + 强对比

const { useState: useStateV2 } = React;

// ────────────────────────────────────────────────────────────
// V2 Tokens (覆盖默认)
// ────────────────────────────────────────────────────────────
const V2 = {
  c: {
    // base
    paper: '#FFFFFF',
    ink: '#0A0A0A',
    inkSoft: '#3A3A3A',
    muted: '#8E8E8E',
    line: '#EAEAEA',
    lineSoft: '#F4F4F4',
    cream: '#F7F5F1',

    // big editorial blocks
    cobalt: '#1F4D3F',     // 主色 · 深墨绿（原钉蔭）
    cobaltLight: '#E5EDE7',
    butter: '#F4D060',     // 黄
    butterLight: '#FBF1C9',
    coral: '#FF5C3D',      // 橙红
    coralLight: '#FFE5DC',
    moss: '#1F5A3D',       // 深森林绿
    mossLight: '#D5E5DA',
    plum: '#3A1F4F',       // 深莓
    plumLight: '#E8DFEF',

    // subject mapping
    chinese: '#FF5C3D',
    math:    '#1F4D3F',
    english: '#1F5A3D',
    french:  '#F4D060',
    support: '#3A1F4F',
  },
  font: {
    // Heavy black display — for big headlines & poster numbers (replaces serif italic)
    display: '"Archivo Black", "Inter", "Noto Sans SC", -apple-system, sans-serif',
    // Same heavy weight, alias for poster numbers
    poster: '"Archivo Black", "Inter", "Noto Sans SC", sans-serif',
    // Strong but readable for sub-headlines
    narrow: '"Inter", "Noto Sans SC", sans-serif',
    // Modern grotesque — for body & UI (use weight 600+ for impact)
    sans: '"Inter", "Noto Sans SC", -apple-system, sans-serif',
    // Chinese — heavy black sans (黑体感)
    cn: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    // Chinese — same family, used where extra weight is wanted
    cnSans: '"Noto Sans SC", "PingFang SC", sans-serif',
    // Technical mono labels — for codes, dates, IDs
    mono: '"JetBrains Mono", "Space Grotesk", ui-monospace, monospace',
    // Geometric grotesque — for "annotation" / quote feel (replaces handwriting)
    hand: '"Space Grotesk", "Inter", sans-serif',
  },
};

// ────────────────────────────────────────────────────────────
// V2 Subject tag — flat with bold underline
// ────────────────────────────────────────────────────────────
const V2Tag = ({ subject, size = 'md' }) => {
  const map = {
    chinese: { color: V2.c.chinese, label: '中文' },
    math:    { color: V2.c.math,    label: 'MATHS' },
    english: { color: V2.c.english, label: 'ENGLISH' },
    french:  { color: V2.c.french,  label: 'FRANÇAIS' },
    support: { color: V2.c.support, label: '学习支持' },
  };
  const s = map[subject];
  const fs = size === 'sm' ? 9 : 10;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px',
      background: s.color, color: '#FFF',
      fontFamily: V2.font.narrow, fontSize: fs + 1, fontWeight: 700,
      letterSpacing: 2, textTransform: 'uppercase',
    }}>{s.label}</span>
  );
};

// ────────────────────────────────────────────────────────────
// V2 ScreenHome — 杂志封面式
// ────────────────────────────────────────────────────────────
function V2ScreenHome({ onOpen }) {
  return (
    <div style={{ background: V2.c.paper, minHeight: '100%', paddingBottom: 100, color: V2.c.ink }}>
      <div style={{ height: 54 }}/>

      {/* Magazine masthead — calm, breathing */}
      <div style={{
        padding: '14px 22px 12px',
        borderBottom: `1px solid ${V2.c.ink}`,
      }}>
        {/* Tiny edition line — like a magazine date stamp */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: V2.font.mono, fontSize: 9, fontWeight: 500,
          letterSpacing: 1.5, textTransform: 'uppercase', color: V2.c.muted,
          marginBottom: 8,
        }}>
          <span>№24 · MAR 2026</span>
          <span>VOL. 02</span>
        </div>
        {/* Brand line + avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: V2.font.display, fontSize: 14, fontWeight: 800,
            letterSpacing: -0.1, lineHeight: 1, whiteSpace: 'nowrap',
          }}>Lumen<span style={{ color: V2.c.cobalt }}>.</span> <span style={{ fontWeight: 500, color: V2.c.inkSoft, fontSize: 13 }}>Advanced Education</span>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: V2.c.ink, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 700,
          }}>林</div>
        </div>
      </div>

      {/* HERO — Magazine cover style */}
      <div style={{ padding: '20px 22px 8px' }}>
        <div style={{
          fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.cobalt,
          marginBottom: 12,
        }}>COVER STORY · 本期主角</div>

        <h1 style={{
          margin: 0, fontFamily: V2.font.display, fontSize: 34, lineHeight: 0.95,
          fontWeight: 800, letterSpacing: -0.4, color: V2.c.ink,
        }}>
          The <span style={{ color: V2.c.cobalt }}>quiet</span><br/>
          climber.
        </h1>

        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${V2.c.ink}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700 }}>林小曜 · CM2</div>
            <div style={{ fontFamily: V2.font.sans, fontSize: 10, color: V2.c.muted, marginTop: 2 }}>10 yrs · Joined Sept 2024</div>
          </div>
          <button onClick={() => onOpen('progress')} style={{
            background: V2.c.ink, color: '#FFF', border: 'none', cursor: 'pointer',
            padding: '8px 14px', fontFamily: V2.font.sans, fontSize: 10,
            fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Read File →
          </button>
        </div>
      </div>

      {/* BIG NUMBER — quarter highlight */}
      <div style={{ padding: '20px 22px 8px' }}>
        <div style={{
          background: V2.c.butter, padding: '20px 22px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>THIS QUARTER · 本季度跨越</div>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 2,
          }}>
            <div style={{
              fontFamily: V2.font.display, fontSize: 72, lineHeight: 0.85,
              fontWeight: 800, letterSpacing: -3,
            }}>+24</div>
            <div style={{ paddingBottom: 14 }}>
              <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700 }}>阅读理解 跨越</div>
              <div style={{ fontFamily: V2.font.sans, fontSize: 10, marginTop: 2 }}>52 → 76 · Lv.4 → Lv.6</div>
            </div>
          </div>
          <p style={{
            margin: '10px 0 0', fontFamily: V2.font.cn, fontSize: 12, lineHeight: 1.55,
            color: V2.c.ink, maxWidth: 280,
          }}>
            从依赖注音到独立读完《草房子》一章，<br/>这是小曜本季度最重要的跨越。
          </p>
        </div>
      </div>

      {/* INDEX — table of contents 风格 */}
      <div style={{ padding: '20px 22px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          paddingBottom: 8, borderBottom: `1px solid ${V2.c.ink}`,
        }}>
          <h2 style={{
            margin: 0, fontFamily: V2.font.display, fontSize: 22, fontWeight: 800,
            letterSpacing: -0.5,
          }}>Today.</h2>
          <span style={{
            fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', color: V2.c.muted,
          }}>28 · APR · LUN</span>
        </div>

        <div style={{ marginTop: 4 }}>
          {[
            { num: '01', time: '17:30', title: 'HSK 阅读专项', en: 'Reading practice', subject: 'chinese', teacher: '老师A', soon: true },
            { num: '02', time: '19:30', title: '袋鼠数学 · 复习', en: 'Math review', subject: 'math', teacher: 'Self-study' },
          ].map((cls, i) => (
            <div key={i} style={{
              padding: '14px 0', borderBottom: `1px solid ${V2.c.line}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                fontFamily: V2.font.display, fontSize: 20, fontWeight: 800, color: V2.c.muted, lineHeight: 1, minWidth: 32,
              }}>{cls.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <V2Tag subject={cls.subject} size="sm"/>
                  {cls.soon && (
                    <span style={{
                      fontFamily: V2.font.mono, fontSize: 10, color: V2.c.coral,
                      fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                    }}>● IN 1H 32M</span>
                  )}
                </div>
                <div style={{ fontFamily: V2.font.cn, fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
                  {cls.title}
                </div>
                <div style={{
                  fontFamily: V2.font.display, fontSize: 12, color: V2.c.muted, marginTop: 2,
                }}>{cls.en}</div>
                <div style={{
                  fontFamily: V2.font.sans, fontSize: 10, color: V2.c.muted, marginTop: 6,
                  letterSpacing: 0.3,
                }}>{cls.time} · {cls.teacher}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED — class slice */}
      <div style={{ padding: '32px 0 8px' }}>
        <div style={{
          background: V2.c.cobalt, color: '#FFF', padding: '32px 22px',
        }}>
          <div style={{
            fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase', color: V2.c.butter,
          }}>FEATURED · 本周课堂切片</div>

          <div style={{
            fontFamily: V2.font.display, fontSize: 13, opacity: 0.7, marginTop: 14, letterSpacing: 0.3,
          }}>04.24 · with 老师A</div>

          <h3 style={{
            margin: '6px 0 0', fontFamily: V2.font.display, fontSize: 26,
            fontWeight: 800, lineHeight: 1, letterSpacing: -0.6,
          }}>
            «示儿» <span style={{ }}>read aloud,<br/>read close.</span>
          </h3>

          <p style={{
            margin: '20px 0 0', fontFamily: V2.font.cn, fontSize: 14,
            lineHeight: 1.7, opacity: 0.92,
          }}>
            "小曜今天对'<b>家祭无忘告乃翁</b>'的情感把握非常细腻，
            主动联系自己的家人体验。"
          </p>

          <div style={{
            marginTop: 24, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {['朗读流畅', '理解到位', '需积累'].map(t => (
              <span key={t} style={{
                fontFamily: V2.font.sans, fontSize: 10, fontWeight: 600,
                letterSpacing: 0.5,
              }}>· {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* In this issue — section index */}
      <div style={{ padding: '32px 22px 8px' }}>
        <h2 style={{
          margin: 0, fontFamily: V2.font.display, fontSize: 22, fontWeight: 800,
          letterSpacing: -0.5, paddingBottom: 8,
          borderBottom: `1px solid ${V2.c.ink}`,
        }}>In this issue.</h2>

        {[
          { p: 'P.04', t: 'Ability Map', s: '能力雷达 · 五维', c: V2.c.cobalt },
          { p: 'P.12', t: 'Class Slices', s: '课堂切片 · 12 条', c: V2.c.coral },
          { p: 'P.20', t: 'Milestones', s: '里程碑 · 4 项达成', c: V2.c.moss },
          { p: 'P.28', t: 'Plan 25-26', s: '年度学习计划', c: V2.c.plum },
        ].map((it, i) => (
          <div key={i} onClick={() => onOpen('progress')} style={{
            padding: '18px 0', borderBottom: `1px solid ${V2.c.line}`,
            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          }}>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted,
              minWidth: 36, fontWeight: 600,
            }}>{it.p}</div>
            <div style={{ width: 4, height: 28, background: it.c }}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: V2.font.display, fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: -0.3,
              }}>{it.t}</div>
              <div style={{ fontFamily: V2.font.cn, fontSize: 12, color: V2.c.muted, marginTop: 4 }}>{it.s}</div>
            </div>
            <span style={{
              fontFamily: V2.font.display, fontSize: 22, color: V2.c.muted,
            }}>→</span>
          </div>
        ))}
      </div>

      {/* footer quote */}
      <div style={{ padding: '40px 22px 20px' }}>
        <div style={{
          fontFamily: V2.font.display, fontSize: 18, color: V2.c.ink, lineHeight: 1.4, textAlign: 'center',
          letterSpacing: -0.2,
        }}>
          "让成长被看见，<br/>让学习有温度。"
        </div>
        <div style={{
          marginTop: 12, fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.muted, textAlign: 'center',
        }}>— LUMEN ADVANCED EDUCATION</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// V2 ScreenProgress — 杂志专题报道式
// ────────────────────────────────────────────────────────────
function V2ScreenProgress({ onBack }) {
  const [tab, setTab] = useStateV2('ability');

  return (
    <div style={{ background: V2.c.paper, minHeight: '100%', paddingBottom: 100, color: V2.c.ink }}>
      <div style={{ height: 54 }}/>

      {/* nav */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${V2.c.ink}`,
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: V2.font.sans, fontSize: 11, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase', color: V2.c.ink,
          padding: 0,
        }}>← BACK</button>
        <div style={{
          fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.muted,
        }}>P.04 · ABILITY</div>
      </div>

      {/* magazine title block */}
      <div style={{ padding: '32px 22px 0' }}>
        <div style={{
          fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.cobalt,
        }}>FEATURE · 学习档案</div>

        <h1 style={{
          margin: '10px 0 0', fontFamily: V2.font.display, fontSize: 32, lineHeight: 0.95,
          fontWeight: 800, letterSpacing: -0.4,
        }}>
          Progress, <span style={{ color: V2.c.cobalt }}>plotted.</span>
        </h1>

        <p style={{
          margin: '14px 0 0', fontFamily: V2.font.cn, fontSize: 13, lineHeight: 1.6,
          color: V2.c.inkSoft, maxWidth: 320,
        }}>
          不是成绩单。是一份立体档案 — 记录每一次<br/>课堂切片、能力跨越与里程碑。
        </p>

        <div style={{
          marginTop: 20, paddingTop: 14, borderTop: `1px solid ${V2.c.ink}`,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: V2.c.muted }}>STUDENT</div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, marginTop: 2 }}>林小曜</div>
          </div>
          <div>
            <div style={{ fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: V2.c.muted }}>QUARTER</div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, marginTop: 2 }}>2026 Q2</div>
          </div>
          <div>
            <div style={{ fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: V2.c.muted }}>SCORE</div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, marginTop: 2 }}>76 / 100</div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{
        marginTop: 32, padding: '0 22px',
        display: 'flex', gap: 0, borderBottom: `1px solid ${V2.c.line}`,
      }}>
        {[
          { k: 'ability', l: 'Ability', cn: '能力雷达' },
          { k: 'slices', l: 'Slices', cn: '课堂切片' },
          { k: 'milestones', l: 'Milestones', cn: '里程碑' },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
            background: 'transparent',
            borderBottom: tab === t.k ? `2px solid ${V2.c.ink}` : '2px solid transparent',
            marginBottom: -1,
          }}>
            <div style={{
              fontFamily: V2.font.display, fontSize: 18, fontWeight: 800, color: tab === t.k ? V2.c.ink : V2.c.muted,
              letterSpacing: -0.2,
            }}>{t.l}</div>
            <div style={{
              fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase',
              color: tab === t.k ? V2.c.ink : V2.c.muted, marginTop: 2,
            }}>{t.cn}</div>
          </button>
        ))}
      </div>

      {tab === 'ability' && <V2Ability/>}
      {tab === 'slices' && <V2Slices/>}
      {tab === 'milestones' && <V2Milestones/>}
    </div>
  );
}

function V2Ability() {
  const axes = ['听力', '阅读', '表达', '书写', '思维'];
  const now = [82, 76, 68, 71, 79];
  const prev = [72, 64, 58, 60, 70];

  // radar
  const size = 320;
  const cx = size/2, cy = size/2 + 10, R = size * 0.32;
  const n = 5;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pts = (arr) => arr.map((v, i) => {
    const r = (v / 100) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))].join(',');
  }).join(' ');

  return (
    <div>
      {/* Big colored radar block */}
      <div style={{
        background: V2.c.cobaltLight, padding: '32px 0 24px',
        borderBottom: `1px solid ${V2.c.ink}`,
      }}>
        <div style={{ padding: '0 22px', marginBottom: 8 }}>
          <div style={{
            fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase', color: V2.c.cobalt,
          }}>FIG. 01 · ABILITY MAP</div>
          <div style={{
            fontFamily: V2.font.display, fontSize: 20, fontWeight: 800,
            letterSpacing: -0.5, marginTop: 2,
          }}>中文 · 五维能力</div>
        </div>

        <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto', maxWidth: size }}>
          {/* grid */}
          {[25, 50, 75, 100].map(p => (
            <polygon key={p} points={
              Array.from({length: n}, (_, i) => {
                const r = (p / 100) * R;
                return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))].join(',');
              }).join(' ')
            } fill="none" stroke={V2.c.cobalt} strokeWidth="0.6" strokeOpacity="0.25"/>
          ))}
          {/* spokes */}
          {axes.map((_, i) => {
            const r = R;
            return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))} stroke={V2.c.cobalt} strokeWidth="0.6" strokeOpacity="0.25"/>;
          })}
          {/* prev */}
          <polygon points={pts(prev)} fill="none" stroke={V2.c.ink} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5"/>
          {/* now */}
          <polygon points={pts(now)} fill={V2.c.cobalt} fillOpacity="0.85" stroke={V2.c.ink} strokeWidth="2" strokeLinejoin="round"/>
          {/* dots */}
          {now.map((v, i) => {
            const r = (v / 100) * R;
            const x = cx + r * Math.cos(angle(i));
            const y = cy + r * Math.sin(angle(i));
            return <circle key={i} cx={x} cy={y} r="5" fill={V2.c.butter} stroke={V2.c.ink} strokeWidth="1.5"/>;
          })}
          {/* labels */}
          {axes.map((label, i) => {
            const r = R + 26;
            const x = cx + r * Math.cos(angle(i));
            const y = cy + r * Math.sin(angle(i));
            return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: V2.font.cn, fontSize: 13, fill: V2.c.ink, fontWeight: 700 }}
            >{label}</text>;
          })}
          {/* values */}
          {now.map((v, i) => {
            const r = (v / 100) * R;
            const x = cx + r * Math.cos(angle(i));
            const y = cy + r * Math.sin(angle(i));
            const r2 = R + 8;
            const x2 = cx + r2 * Math.cos(angle(i));
            const y2 = cy + r2 * Math.sin(angle(i));
            return <text key={i} x={x2} y={y2} textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: V2.font.mono, fontSize: 11, fill: V2.c.ink, fontWeight: 700 }}
            >{v}</text>;
          })}
        </svg>

        <div style={{
          padding: '0 22px', display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 14, background: V2.c.cobalt }}/>
            <span style={{ fontFamily: V2.font.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>2026 Q2 · NOW</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 0, borderTop: `1.5px dashed ${V2.c.ink}`, opacity: 0.5 }}/>
            <span style={{ fontFamily: V2.font.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: V2.c.muted }}>2026 Q1 · PREV</span>
          </div>
        </div>
      </div>

      {/* Per-axis breakdown — table style */}
      <div style={{ padding: '24px 22px' }}>
        <div style={{
          fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.muted,
          paddingBottom: 8, borderBottom: `1px solid ${V2.c.ink}`,
        }}>FIG. 02 · BREAKDOWN</div>

        {axes.map((a, i) => {
          const delta = now[i] - prev[i];
          return (
            <div key={a} style={{
              padding: '20px 0', borderBottom: `1px solid ${V2.c.line}`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted, minWidth: 30, fontWeight: 600,
              }}>0{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: V2.font.cn, fontSize: 15, fontWeight: 700 }}>{a}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: V2.font.display, fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{now[i]}</span>
                    <span style={{ fontFamily: V2.font.mono, fontSize: 11, color: V2.c.cobalt, fontWeight: 700 }}>+{delta}</span>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 6, background: V2.c.line, marginTop: 8 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${prev[i]}%`, background: V2.c.muted, opacity: 0.4 }}/>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${now[i]}%`, background: V2.c.cobalt }}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pull quote — teacher note */}
      <div style={{
        background: V2.c.coral, color: '#FFF', padding: '40px 22px',
      }}>
        <div style={{
          fontFamily: V2.font.sans, fontSize: 9, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase', color: V2.c.butter,
        }}>PULL QUOTE · 阶段评语</div>
        <div style={{
          fontFamily: V2.font.display, fontSize: 26, fontWeight: 800,
          lineHeight: 1.05, letterSpacing: -0.6, marginTop: 14,
        }}>
          "本季度跨越<br/>明显，从依赖<br/>注音到独立<br/>读完一本书。"
        </div>
        <div style={{
          marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.4)',
          fontFamily: V2.font.cn, fontSize: 12, fontWeight: 700,
        }}>老师A · CHEN  ·  04.20.2026</div>
      </div>
    </div>
  );
}

function V2Slices() {
  const slices = [
    { date: '04.24', subject: 'chinese', title: '《示儿》古诗精读', teacher: '老师A', tags: ['朗读流畅', '理解到位'], note: '小曜对"家祭无忘告乃翁"的情感把握非常细腻，主动联系自己的家人体验。', color: V2.c.coral },
    { date: '04.22', subject: 'math', title: '数学 Wallaby · 几何拆解', teacher: '老师C', tags: ['思路清晰', '解法独特'], note: '面对七巧板组合题展现非常好的空间想象力，独立给出课本之外的拼法。', color: V2.c.cobalt },
    { date: '04.19', subject: 'french', title: '法语 B1 · 口语模拟', teacher: '老师D', tags: ['语速自然', '需练词汇'], note: 'La fluidité approche celle des élèves locaux. Vocabulaire à enrichir.', color: V2.c.butter },
  ];
  return (
    <div>
      {slices.map((s, i) => (
        <article key={i} style={{
          padding: '32px 22px',
          borderBottom: `1px solid ${V2.c.ink}`,
          background: i === 0 ? V2.c.paper : V2.c.paper,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <V2Tag subject={s.subject}/>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted, fontWeight: 600,
            }}>№ 0{slices.length - i} · {s.date}</div>
          </div>
          <h3 style={{
            margin: 0, fontFamily: V2.font.display, fontSize: 24, fontWeight: 800,
            lineHeight: 1, letterSpacing: -0.4,
          }}>{s.title}</h3>
          <div style={{
            fontFamily: V2.font.sans, fontSize: 11, color: V2.c.muted, marginTop: 6,
            letterSpacing: 0.5,
          }}>WITH {s.teacher.toUpperCase()}</div>
          <div style={{
            marginTop: 16, padding: '14px 16px',
            background: s.color, color: s.subject === 'french' ? V2.c.ink : '#FFF',
            fontFamily: V2.font.cn, fontSize: 13, lineHeight: 1.6,
          }}>"{s.note}"</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {s.tags.map(t => (
              <span key={t} style={{
                fontFamily: V2.font.sans, fontSize: 10, fontWeight: 700,
                letterSpacing: 1, textTransform: 'uppercase',
                paddingBottom: 2, borderBottom: `2px solid ${s.color}`,
              }}>+ {t}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function V2Milestones() {
  const ms = [
    { date: '2026.04', title: 'HSK 三级模拟', score: '278 / 300', note: '阅读单项满分', color: V2.c.butter, big: true },
    { date: '2026.02', title: '袋鼠数学预选', score: '前 15%', note: 'Niveau Écolier', color: V2.c.cobalt },
    { date: '2025.11', title: '中文阅读突破', score: 'Lv.4 → Lv.6', note: '可独立读《草房子》', color: V2.c.coral },
    { date: '2025.09', title: '入学初评', score: '建立档案', note: '诊断起点', color: V2.c.muted },
  ];
  return (
    <div style={{ padding: '24px 0' }}>
      {ms.map((m, i) => (
        <div key={i} style={{
          padding: '24px 22px',
          background: m.big ? m.color : V2.c.paper,
          borderBottom: `1px solid ${V2.c.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1,
              color: m.big ? V2.c.ink : V2.c.muted,
            }}>★ {m.date}</div>
            <div style={{
              fontFamily: V2.font.display, fontSize: 19, fontWeight: 800, letterSpacing: -0.5,
              color: m.big ? V2.c.ink : m.color,
            }}>{m.score}</div>
          </div>
          <h3 style={{
            margin: 0, fontFamily: V2.font.display, fontSize: m.big ? 38 : 26,
            fontWeight: 800, lineHeight: 1, letterSpacing: -0.4,
            color: m.big ? V2.c.ink : V2.c.ink,
          }}>{m.title}</h3>
          <p style={{
            margin: '8px 0 0', fontFamily: V2.font.cn, fontSize: 13,
            color: m.big ? V2.c.ink : V2.c.muted,
            opacity: m.big ? 0.8 : 1,
          }}>{m.note}</p>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { V2, V2Tag, V2ScreenHome, V2ScreenProgress });
