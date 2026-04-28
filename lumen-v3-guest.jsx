// Lumen v3 — Guest (logged-out) screens
// Goal: turn a curious visitor into a booked assessment.
// Tone: editorial intro, not marketing pop. Same magazine grammar as the rest of v3.

const { useState: u3gState } = React;

// ────────────────────────────────────────────────────────────
// GUEST · HOME — what is Lumen, who is it for, how it works
// ────────────────────────────────────────────────────────────
function V3GuestHome({ onBookAssessment, onOpenLogin, onOpenSchedule }) {
  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Quiet date strip — same rhythm as logged-in home */}
      <div style={{
        padding: '14px 22px 12px',
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5, textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ISSUE 24 · 2026</span>
        <span>UNTITLED READER</span>
      </div>

      {/* HERO — a manifesto, not a tagline */}
      <div style={{ padding: '6px 22px 22px' }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.cobalt,
          letterSpacing: 2, fontWeight: 700, marginBottom: 8,
        }}>· LUMEN · PARIS</div>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.25,
        }}>
          因人而异的学习节奏，<br/>
          <span style={{ color: V2.c.cobalt }}>可被记录的成长进程。</span>
        </div>
        <div style={{
          marginTop: 12, fontFamily: V2.font.cn, fontSize: 12.5,
          lineHeight: 1.65, color: V2.c.inkSoft, maxWidth: 320,
        }}>
          学科课程、语言考试、兴趣探索——每一节课，沉淀成一份可以翻阅的档案。
        </div>

        {/* Primary CTA */}
        <button onClick={onBookAssessment} style={{
          marginTop: 16, width: '100%', padding: '12px 14px',
          background: V2.c.ink, color: V2.c.paper,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
              预约一次免费评估
            </div>
            <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.butter, marginTop: 2, letterSpacing: 1 }}>
              30 MIN · ONLINE OR ON-SITE
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 7h8M7 3l4 4-4 4" stroke={V2.c.paper} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={onOpenLogin} style={{
          marginTop: 6, width: '100%', padding: '10px 14px',
          background: V2.c.paper, color: V2.c.ink,
          border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 12.5, fontWeight: 600,
        }}>已有账号 · 登录查看档案</button>
      </div>

      {/* ── SECTION 01 · 学科 ────────────────────────────── */}
      <V3GuestSection no="01" en="WHAT WE TEACH" title="我们教什么">
        <div style={{ padding: '8px 22px 22px' }}>
          {[
            { tag: 'chinese', name: '中文',     en: 'CHINESE',  desc: 'HSK 一至六级 · 经典阅读 · 写作' },
            { tag: 'english', name: '英语',     en: 'ENGLISH',  desc: 'KET / PET · 母语向阅读与写作' },
            { tag: 'math',    name: '数学',     en: 'MATHS',    desc: '法国课纲衔接 · 袋鼠数学 · 概念可视化' },
            { tag: 'french',  name: '法语',     en: 'FRANÇAIS', desc: 'DELF A1–B2 · 母语向写作辅导' },
            { tag: 'support', name: '兴趣探索', en: 'INTERESTS',desc: '阅读项目 · 创意写作 · 学习方法' },
          ].map((s, i) => (
            <div key={s.tag} style={{
              padding: '14px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${V2.c.lineSoft}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 6,
              }}>
                <V2Tag subject={s.tag} size="sm"/>
                <div style={{
                  fontFamily: V2.font.cn, fontSize: 15, fontWeight: 700,
                  letterSpacing: -0.2,
                }}>{s.name}</div>
              </div>
              <div style={{
                fontFamily: V2.font.cn, fontSize: 12, color: V2.c.inkSoft,
                lineHeight: 1.55,
              }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </V3GuestSection>

      {/* ── SECTION 02 · How it works ────────────────────── */}
      <V3GuestSection no="02" en="METHOD" title="五步成长闭环">
        <div style={{ padding: '8px 22px 22px' }}>
          {[
            { n: '01', step: '评估', en: 'ASSESS',  desc: '一次 30 分钟谈话 + 学科测评，给出起点画像。' },
            { n: '02', step: '规划', en: 'PLAN',    desc: '顾问 + 老师共同设计学期路径，每月一次复盘。' },
            { n: '03', step: '上课', en: 'TEACH',   desc: '小班 4–6 人或一对一，线下 + 线上灵活组合。' },
            { n: '04', step: '记录', en: 'RECORD',  desc: '每节课沉淀课堂切片，形成可翻阅的成长档案。' },
            { n: '05', step: '复盘', en: 'REVIEW',  desc: '月度报告 + 季度家访，把学习节奏交还给家庭。' },
          ].map((s, i) => (
            <div key={s.n} style={{
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${V2.c.lineSoft}`,
              display: 'flex', gap: 14,
            }}>
              <div style={{
                fontFamily: V2.font.poster, fontSize: 26, fontWeight: 800,
                lineHeight: 1, letterSpacing: -1,
                color: V2.c.cobalt, width: 44, flexShrink: 0,
              }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: V2.font.cn, fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>{s.step}</div>
                  <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1.5 }}>{s.en}</div>
                </div>
                <div style={{
                  marginTop: 4, fontFamily: V2.font.cn, fontSize: 12.5, color: V2.c.inkSoft, lineHeight: 1.6,
                }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </V3GuestSection>

      {/* ── SECTION 03 · A peek at a real archive ────────── */}
      <V3GuestSection no="03" en="A PEEK" title="一个真实的档案，长这样">
        <div style={{ padding: '4px 22px 8px' }}>
          <div style={{
            fontFamily: V2.font.cn, fontSize: 12, color: V2.c.inkSoft,
            lineHeight: 1.6, marginBottom: 14,
          }}>
            学生档案 · 林小曜 · CM2 · 已学习 18 个月
          </div>

          {/* The peek card — same DNA as feedback detail's pull quote */}
          <div style={{
            padding: '20px 18px', background: V2.c.ink, color: V2.c.paper,
            position: 'relative',
          }}>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9, color: V2.c.butter,
              letterSpacing: 1.5, fontWeight: 700, marginBottom: 8,
            }}>04.24 · 课堂瞬间 #47</div>
            <div style={{
              fontFamily: V2.font.poster, fontSize: 44, fontWeight: 900,
              lineHeight: 0.6, color: V2.c.butter, opacity: 0.6, marginBottom: 2,
            }}>"</div>
            <div style={{
              fontFamily: V2.font.cn, fontSize: 14.5, fontWeight: 500,
              lineHeight: 1.55, letterSpacing: -0.2,
            }}>
              小曜对《示儿》"家祭无忘告乃翁"的情感把握非常细腻，
              主动联系自己的家人体验。
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: `1px solid rgba(255,255,255,0.15)`,
              display: 'flex', gap: 10, fontFamily: V2.font.mono, fontSize: 9,
              color: 'rgba(255,255,255,0.6)', letterSpacing: 1,
            }}>
              <span>· 朗读流畅</span>
              <span>· 理解到位</span>
              <span>· 需积累</span>
            </div>
          </div>

          {/* Stat row — the archive's bigger numbers */}
          <div style={{
            marginTop: 14,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            border: `1px solid ${V2.c.ink}`,
          }}>
            {[
              { n: '142', l: '生词量', en: 'WORDS' },
              { n: '47',  l: '课堂切片', en: 'SLICES' },
              { n: '+24', l: '阅读理解', en: 'READING' },
            ].map((x, i) => (
              <div key={i} style={{
                padding: '14px 10px',
                borderRight: i < 2 ? `1px solid ${V2.c.ink}` : 'none',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: V2.font.poster, fontSize: 28, fontWeight: 800,
                  lineHeight: 1, letterSpacing: -1,
                }}>{x.n}</div>
                <div style={{
                  marginTop: 6, fontFamily: V2.font.cn, fontSize: 11, fontWeight: 600,
                }}>{x.l}</div>
                <div style={{
                  marginTop: 2, fontFamily: V2.font.mono, fontSize: 8,
                  color: V2.c.muted, letterSpacing: 1,
                }}>{x.en}</div>
              </div>
            ))}
          </div>

          <button onClick={onOpenLogin} style={{
            marginTop: 14, width: '100%', padding: '11px',
            background: 'transparent', color: V2.c.ink,
            border: `1px dashed ${V2.c.ink}`, cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>登录后查看孩子的完整档案 →</button>
        </div>
      </V3GuestSection>

      {/* ── SECTION 04 · Voices ──────────────────────────── */}
      <V3GuestSection no="04" en="VOICES" title="家长这样说">
        <div style={{ padding: '8px 22px 22px' }}>
          {[
            { who: '王女士 · 林小曜的妈妈', city: 'PARIS 13E', text: '我以前总担心他在两种文化里不知道自己是谁。Lumen 让中文不再是一项功课，而是他和外公外婆之间的一座桥。' },
            { who: '陈先生 · 双胞胎父亲',   city: 'BOULOGNE',  text: '每个月看到那份月报，比成绩单更有用——我能看见他在哪一节课开始"开窍"。' },
          ].map((v, i) => (
            <div key={i} style={{
              padding: '16px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${V2.c.lineSoft}`,
            }}>
              <div style={{
                fontFamily: V2.font.cn, fontSize: 14, lineHeight: 1.65,
                color: V2.c.ink, fontWeight: 500, letterSpacing: -0.1,
              }}>"{v.text}"</div>
              <div style={{
                marginTop: 10, display: 'flex', justifyContent: 'space-between',
                fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1,
              }}>
                <span>— {v.who}</span>
                <span>{v.city}</span>
              </div>
            </div>
          ))}
        </div>
      </V3GuestSection>

      {/* Closing CTA strip */}
      <div style={{
        margin: '0 22px', padding: '24px 20px',
        background: V2.c.butter, border: `1px solid ${V2.c.ink}`,
      }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.ink,
          letterSpacing: 2, fontWeight: 700,
        }}>· FIRST STEP</div>
        <div style={{
          marginTop: 8, fontFamily: V2.font.cn, fontSize: 22, fontWeight: 800,
          letterSpacing: -0.4, lineHeight: 1.25,
        }}>
          一次评估，<br/>
          一份属于孩子的起点画像。
        </div>
        <button onClick={onBookAssessment} style={{
          marginTop: 16, width: '100%', padding: '13px',
          background: V2.c.ink, color: V2.c.paper,
          border: 'none', cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 13.5, fontWeight: 700, letterSpacing: -0.1,
        }}>预约评估 · 30 分钟 · 免费</button>
      </div>

      {/* Footer — magazine colophon */}
      <div style={{
        marginTop: 28, padding: '16px 22px 0',
        borderTop: `1px solid ${V2.c.line}`,
        fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
        letterSpacing: 1, lineHeight: 1.7,
      }}>
        <div>LUMEN · ADVANCED EDUCATION</div>
        <div>22 RUE DE LA PAIX · 75002 PARIS</div>
        <div>+33 1 42 00 00 00 · HELLO@LUMEN.EDU</div>
      </div>
    </div>
  );
}

// Section header used across guest screens
function V3GuestSection({ no, en, title, children }) {
  return (
    <div>
      <div style={{
        padding: '14px 22px 10px', borderTop: `1px solid ${V2.c.ink}`,
        display: 'flex', alignItems: 'baseline', gap: 10,
      }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        }}>{no}</div>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1.5,
        }}>· {en}</div>
        <div style={{ flex: 1 }}/>
      </div>
      <div style={{ padding: '0 22px 0' }}>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 19, fontWeight: 800,
          letterSpacing: -0.4, lineHeight: 1.25,
          paddingBottom: 4,
        }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GUEST · ARCHIVE — locked preview, drives login
// ────────────────────────────────────────────────────────────
function V3GuestArchive({ onBookAssessment, onOpenLogin }) {
  return (
    <div style={{ padding: '14px 22px 40px' }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5, marginBottom: 14,
      }}>· LOCKED · 档案需登录后查看</div>

      <div style={{
        fontFamily: V2.font.cn, fontSize: 24, fontWeight: 800,
        letterSpacing: -0.5, lineHeight: 1.2,
      }}>
        每一份档案，<br/>都属于一个具体的孩子。
      </div>

      <div style={{
        marginTop: 14, fontFamily: V2.font.cn, fontSize: 13,
        color: V2.c.inkSoft, lineHeight: 1.65,
      }}>
        登录后你将看到孩子完整的成长档案——课堂切片、月度报告、生词量、阅读等级、教师手记。每一帧都由真实的课堂沉淀而来。
      </div>

      {/* Mock locked archive — blurred */}
      <div style={{
        marginTop: 22, position: 'relative',
        border: `1px solid ${V2.c.ink}`,
      }}>
        <div style={{
          padding: 16, filter: 'blur(3.5px)', opacity: 0.55,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          <div style={{ fontFamily: V2.font.poster, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>林小曜</div>
          <div style={{ fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted, marginTop: 4, letterSpacing: 1 }}>CM2 · 已学习 18 个月</div>
          <div style={{
            marginTop: 14, height: 80, background: V2.c.cream,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: V2.font.cn, fontSize: 13, color: V2.c.inkSoft,
          }}>课堂切片 · 47 帧 · 生词量 142</div>
          <div style={{ marginTop: 10, fontFamily: V2.font.cn, fontSize: 12, color: V2.c.inkSoft, lineHeight: 1.6 }}>
            "小曜对《示儿》'家祭无忘告乃翁'的情感把握非常细腻……"
          </div>
        </div>
        {/* Lock overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          background: 'rgba(247,243,234,0.55)',
        }}>
          <div style={{
            width: 38, height: 38, border: `1.5px solid ${V2.c.ink}`,
            background: V2.c.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={V2.c.ink} strokeWidth="2">
              <rect x="5" y="11" width="14" height="10"/>
              <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <button onClick={onOpenLogin} style={{
        marginTop: 18, width: '100%', padding: '13px',
        background: V2.c.ink, color: V2.c.paper, border: 'none', cursor: 'pointer',
        fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700, letterSpacing: -0.1,
      }}>登录查看档案 →</button>
      <button onClick={onBookAssessment} style={{
        marginTop: 8, width: '100%', padding: '12px',
        background: V2.c.paper, color: V2.c.ink,
        border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
        fontFamily: V2.font.cn, fontSize: 12.5, fontWeight: 600,
      }}>还没有孩子在 Lumen · 预约评估</button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GUEST · SCHEDULE — show open assessment slots
// ────────────────────────────────────────────────────────────
function V3GuestSchedule({ onBookAssessment }) {
  const [audience, setAudience] = u3gState('kids'); // 'kids' | 'adult'

  const SLOTS = {
    kids: [
      { day: 'WED', dayCN: '周三', date: '04.30', time: '14:00 / 16:00 / 17:30', mode: '巴黎 13 区 · 线下' },
      { day: 'SAT', dayCN: '周六', date: '05.03', time: '09:00 / 11:00 / 14:00 / 16:00', mode: '巴黎 13 区 · 线下' },
      { day: 'SUN', dayCN: '周日', date: '05.04', time: '10:00 / 14:00 / 16:00', mode: '巴黎 13 区 · 线下' },
    ],
    adult: [
      { day: 'MON', dayCN: '周一', date: '05.05', time: '19:00 / 20:00',                  mode: '巴黎 13 区 · 线下' },
      { day: 'TUE', dayCN: '周二', date: '05.06', time: '19:00 / 20:00',                  mode: '巴黎 13 区 · 线下' },
      { day: 'WED', dayCN: '周三', date: '05.07', time: '19:00 / 20:00',                  mode: '巴黎 13 区 · 线下' },
      { day: 'THU', dayCN: '周四', date: '05.08', time: '19:00 / 20:00',                  mode: '巴黎 13 区 · 线下' },
      { day: 'FRI', dayCN: '周五', date: '05.09', time: '19:00 / 20:00',                  mode: '巴黎 13 区 · 线下' },
      { day: 'SAT', dayCN: '周六', date: '05.10', time: '10:00 / 14:00 / 16:00',          mode: '巴黎 13 区 · 线下 · 全天' },
      { day: 'SUN', dayCN: '周日', date: '05.11', time: '10:00 / 14:00 / 16:00',          mode: '巴黎 13 区 · 线下 · 全天' },
    ],
  };
  const slots = SLOTS[audience];

  return (
    <div style={{ padding: '14px 22px 40px' }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5, marginBottom: 14,
      }}>· OPEN SLOTS · 本周可预约评估</div>

      <div style={{
        fontFamily: V2.font.cn, fontSize: 24, fontWeight: 800,
        letterSpacing: -0.5, lineHeight: 1.2,
      }}>选一个时间，<br/>来认识一下我们。</div>
      <div style={{
        marginTop: 12, fontFamily: V2.font.cn, fontSize: 12.5,
        color: V2.c.inkSoft, lineHeight: 1.65,
      }}>30 分钟 · 评估完成后 48 小时内出具起点画像。</div>

      {/* Audience toggle */}
      <div style={{ marginTop: 22, display: 'flex', border: `1px solid ${V2.c.ink}` }}>
        {[
          { v: 'kids',  l: '儿童 · 青少年', en: 'KIDS' },
          { v: 'adult', l: '成人 · 法语',   en: 'ADULT' },
        ].map((o, i) => (
          <button key={o.v} onClick={() => setAudience(o.v)} style={{
            flex: 1, padding: '12px 6px',
            background: audience === o.v ? V2.c.ink : V2.c.paper,
            color: audience === o.v ? V2.c.paper : V2.c.ink,
            border: 'none',
            borderLeft: i > 0 ? `1px solid ${V2.c.ink}` : 'none',
            cursor: 'pointer', textAlign: 'center',
          }}>
            <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700 }}>{o.l}</div>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9, marginTop: 2,
              opacity: 0.6, letterSpacing: 1,
            }}>{o.en}</div>
          </button>
        ))}
      </div>

      {/* Schedule rule note */}
      <div style={{
        marginTop: 14, padding: '10px 12px',
        background: V2.c.cream, borderLeft: `2px solid ${V2.c.cobalt}`,
        fontFamily: V2.font.cn, fontSize: 11.5, color: V2.c.inkSoft,
        lineHeight: 1.6,
      }}>
        {audience === 'kids' ? (
          <>儿童 / 青少年线下课 · <strong style={{ color: V2.c.ink }}>周三 · 周六 · 周日</strong></>
        ) : (
          <>成人法语线下课 · <strong style={{ color: V2.c.ink }}>工作日 19:00–21:00 · 周末全天</strong></>
        )}
      </div>

      <div style={{ marginTop: 14, borderTop: `1px solid ${V2.c.ink}` }}>
        {slots.map((s, i) => (
          <div key={i} style={{
            padding: '14px 0',
            borderBottom: `1px solid ${V2.c.lineSoft}`,
            display: 'flex', gap: 14,
          }}>
            <div style={{ width: 50, flexShrink: 0 }}>
              <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1, fontWeight: 600 }}>{s.day}</div>
              <div style={{ fontFamily: V2.font.poster, fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>{s.dayCN.slice(1)}</div>
              <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, marginTop: 4 }}>{s.date}</div>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${V2.c.line}`, paddingLeft: 14 }}>
              <div style={{
                fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, letterSpacing: -0.1,
              }}>{s.time}</div>
              <div style={{
                marginTop: 4, fontFamily: V2.font.cn, fontSize: 11, color: V2.c.inkSoft,
              }}>{s.mode}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onBookAssessment} style={{
        marginTop: 22, width: '100%', padding: '14px',
        background: V2.c.ink, color: V2.c.paper, border: 'none', cursor: 'pointer',
        fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700,
      }}>预约一个时段 →</button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GUEST · ME — login form + small reassurances
// ────────────────────────────────────────────────────────────
function V3GuestMe({ onLogin }) {
  const [phone, setPhone] = u3gState('+33 6 12 34 56 78');
  const [code, setCode] = u3gState('');
  const [sent, setSent] = u3gState(false);

  return (
    <div style={{ padding: '24px 22px 40px' }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5,
      }}>· SIGN IN</div>

      <div style={{
        marginTop: 12, fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
        letterSpacing: -0.6, lineHeight: 1.2,
      }}>登录 Lumen</div>
      <div style={{
        marginTop: 8, fontFamily: V2.font.cn, fontSize: 12.5,
        color: V2.c.inkSoft, lineHeight: 1.65,
      }}>使用注册时的手机号——一条短信验证码，无需密码。</div>

      {/* Phone field */}
      <div style={{ marginTop: 24 }}>
        <label style={{
          display: 'block', fontFamily: V2.font.mono, fontSize: 9.5,
          fontWeight: 700, letterSpacing: 1.5, marginBottom: 6,
        }}>手机号 · PHONE</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} style={{
          width: '100%', padding: '12px 14px', boxSizing: 'border-box',
          background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
          fontFamily: V2.font.cn, fontSize: 14, fontWeight: 600,
          outline: 'none',
        }}/>
      </div>

      {/* Code field */}
      <div style={{ marginTop: 14 }}>
        <label style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: V2.font.mono, fontSize: 9.5,
          fontWeight: 700, letterSpacing: 1.5, marginBottom: 6,
        }}>
          <span>验证码 · CODE</span>
          <button onClick={() => setSent(true)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: V2.font.mono, fontSize: 9.5, fontWeight: 600,
            color: sent ? V2.c.muted : V2.c.cobalt, letterSpacing: 1,
          }}>{sent ? '已发送 · 60S' : '发送 · SEND'}</button>
        </label>
        <input value={code} onChange={e => setCode(e.target.value)}
          placeholder="6 位数字"
          style={{
            width: '100%', padding: '12px 14px', boxSizing: 'border-box',
            background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
            fontFamily: V2.font.cn, fontSize: 14, fontWeight: 600,
            outline: 'none', letterSpacing: 4,
          }}/>
      </div>

      <button onClick={onLogin} style={{
        marginTop: 20, width: '100%', padding: '14px',
        background: V2.c.ink, color: V2.c.paper, border: 'none', cursor: 'pointer',
        fontFamily: V2.font.cn, fontSize: 13.5, fontWeight: 700, letterSpacing: -0.1,
      }}>登录 →</button>

      <div style={{
        marginTop: 20, padding: '14px 0', borderTop: `1px solid ${V2.c.lineSoft}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1,
      }}>
        <span>· 帮助</span>
        <span>HELLO@LUMEN.EDU</span>
      </div>

      {/* Demo hint */}
      <div style={{
        marginTop: 24, padding: '14px 16px',
        background: V2.c.cream, border: `1px dashed ${V2.c.ink}`,
      }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          fontWeight: 700, letterSpacing: 1.5, marginBottom: 6,
        }}>· DEMO TIP</div>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 12, color: V2.c.inkSoft, lineHeight: 1.6,
        }}>这是原型——点击"登录 →"即可以王女士的身份进入家长视角，也可在顶部头像处切换为林小曜（孩子）的视角。</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ASSESSMENT DETAIL — book a free assessment
// ────────────────────────────────────────────────────────────
function V3AssessmentDetail({ onBack }) {
  const [name, setName] = u3gState('');
  const [grade, setGrade] = u3gState('CM2');
  const [subject, setSubject] = u3gState('chinese');
  const [mode, setMode] = u3gState('on-site');
  const [slot, setSlot] = u3gState(2);
  const [submitted, setSubmitted] = u3gState(false);

  const slots = [
    { d: 'SAT 05.03', t: '09:00' },
    { d: 'SAT 05.03', t: '11:00' },
    { d: 'SAT 05.03', t: '15:00' },
    { d: 'SUN 05.04', t: '11:00' },
    { d: 'SUN 05.04', t: '15:00' },
    { d: 'MON 05.05', t: '17:30' },
  ];

  if (submitted) {
    return (
      <div style={{ background: V2.c.paper, minHeight: '100%' }}>
        <div style={{
          position: 'sticky', top: 0, background: V2.c.paper, zIndex: 4,
          padding: '54px 22px 12px', borderBottom: `1px solid ${V2.c.line}`,
        }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600,
          }}>
            <span style={{ fontSize: 16 }}>←</span> 返回
          </button>
        </div>
        <div style={{ padding: '40px 22px' }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, color: V2.c.cobalt,
            fontWeight: 700, letterSpacing: 2,
          }}>· CONFIRMED · 已收到</div>
          <div style={{
            marginTop: 14, fontFamily: V2.font.cn, fontSize: 28, fontWeight: 800,
            letterSpacing: -0.5, lineHeight: 1.2,
          }}>谢谢，我们到时见。</div>
          <div style={{
            marginTop: 12, fontFamily: V2.font.cn, fontSize: 13.5,
            color: V2.c.inkSoft, lineHeight: 1.7,
          }}>顾问会在 24 小时内通过短信和你确认。如需调整请回复短信，或致电 +33 1 42 00 00 00。</div>

          <div style={{
            marginTop: 24, border: `1px solid ${V2.c.ink}`, padding: 18,
          }}>
            <div style={{ fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1.5, marginBottom: 8 }}>预约详情 · BOOKING</div>
            <V3DetailRow label="孩子" value={name || '— 未填 —'}/>
            <V3DetailRow label="年级" value={grade}/>
            <V3DetailRow label="重点学科" value={subjectLabel(subject)}/>
            <V3DetailRow label="形式" value={mode === 'on-site' ? '巴黎 13 区 · 线下' : '线上 ZOOM'}/>
            <V3DetailRow label="时间" value={`${slots[slot].d} · ${slots[slot].t}`} last/>
          </div>
          <button onClick={onBack} style={{
            marginTop: 18, width: '100%', padding: '13px',
            background: V2.c.ink, color: V2.c.paper, border: 'none', cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700,
          }}>回到首页</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: V2.c.paper, minHeight: '100%' }}>
      <div style={{
        position: 'sticky', top: 0, background: V2.c.paper, zIndex: 4,
        padding: '54px 22px 12px', borderBottom: `1px solid ${V2.c.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600,
        }}>
          <span style={{ fontSize: 16 }}>←</span> 返回
        </button>
        <span style={{ fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1.5 }}>
          预约评估
        </span>
      </div>

      <div style={{ padding: '20px 22px 60px' }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.cobalt, letterSpacing: 2, fontWeight: 700 }}>· FREE · 30 MIN</div>
        <h1 style={{
          margin: '8px 0 0', fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>预约一次免费评估</h1>
        <p style={{
          margin: '10px 0 0', fontFamily: V2.font.cn, fontSize: 13,
          color: V2.c.inkSoft, lineHeight: 1.65,
        }}>顾问会与孩子和家长各谈 15 分钟，48 小时内出具一份起点画像 PDF。</p>

        {/* ── Section A · 孩子 ─ */}
        <V3FormSection no="01" en="THE CHILD" title="关于孩子">
          <V3FormField label="姓名 · NAME">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="例：林小曜"
              style={v3Input}/>
          </V3FormField>
          <V3FormField label="年级 · GRADE">
            <V3SegControl value={grade} onChange={setGrade}
              options={[
                { v: 'CP', l: 'CP' },
                { v: 'CE1', l: 'CE1-2' },
                { v: 'CM', l: 'CM1-2' },
                { v: 'CM2', l: '6e-3e' },
                { v: 'lycee', l: 'Lycée' },
              ]}/>
          </V3FormField>
        </V3FormSection>

        {/* ── Section B · 想了解什么 ─ */}
        <V3FormSection no="02" en="THE FOCUS" title="想重点了解什么">
          <V3FormField label="学科 · SUBJECT">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { v: 'chinese', l: '中文' },
                { v: 'english', l: '英语' },
                { v: 'math',    l: '数学' },
                { v: 'french',  l: '法语' },
              ].map(o => (
                <button key={o.v} onClick={() => setSubject(o.v)} style={{
                  flex: '1 1 calc(50% - 3px)', padding: '11px',
                  background: subject === o.v ? V2.c.ink : V2.c.paper,
                  color: subject === o.v ? V2.c.paper : V2.c.ink,
                  border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
                  fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600,
                }}>{o.l}</button>
              ))}
            </div>
          </V3FormField>
        </V3FormSection>

        {/* ── Section C · 形式 + 时间 ─ */}
        <V3FormSection no="03" en="WHEN & HOW" title="形式与时间">
          <V3FormField label="形式 · MODE">
            <V3SegControl value={mode} onChange={setMode}
              options={[
                { v: 'on-site', l: '线下 · 巴黎 13 区' },
                { v: 'online',  l: '线上 ZOOM' },
              ]}/>
          </V3FormField>
          <V3FormField label="时间 · TIME">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {slots.map((s, i) => (
                <button key={i} onClick={() => setSlot(i)} style={{
                  padding: '12px 10px', textAlign: 'left',
                  background: slot === i ? V2.c.ink : V2.c.paper,
                  color: slot === i ? V2.c.paper : V2.c.ink,
                  border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
                }}>
                  <div style={{ fontFamily: V2.font.mono, fontSize: 9, opacity: 0.7, letterSpacing: 1 }}>{s.d}</div>
                  <div style={{ fontFamily: V2.font.poster, fontSize: 18, fontWeight: 800, marginTop: 2 }}>{s.t}</div>
                </button>
              ))}
            </div>
          </V3FormField>
        </V3FormSection>

        <button onClick={() => setSubmitted(true)} style={{
          marginTop: 24, width: '100%', padding: '15px',
          background: V2.c.ink, color: V2.c.paper, border: 'none', cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, letterSpacing: -0.1,
        }}>提交预约 →</button>
        <div style={{
          marginTop: 10, fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          letterSpacing: 1, textAlign: 'center',
        }}>提交后 24 小时内顾问会通过短信确认</div>
      </div>
    </div>
  );
}

// Form helpers
const v3Input = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
  fontFamily: V2.font.cn, fontSize: 14, fontWeight: 600,
  outline: 'none',
};

function V3FormSection({ no, en, title, children }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        paddingTop: 14, borderTop: `1px solid ${V2.c.ink}`,
      }}>
        <span style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>{no}</span>
        <span style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1.5 }}>· {en}</span>
      </div>
      <div style={{
        fontFamily: V2.font.cn, fontSize: 17, fontWeight: 800,
        letterSpacing: -0.3, marginTop: 4,
      }}>{title}</div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function V3FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9.5, fontWeight: 700,
        letterSpacing: 1.5, marginBottom: 6,
      }}>{label}</div>
      {children}
    </div>
  );
}

function V3SegControl({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', border: `1px solid ${V2.c.ink}` }}>
      {options.map((o, i) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          flex: 1, padding: '11px 6px',
          background: value === o.v ? V2.c.ink : V2.c.paper,
          color: value === o.v ? V2.c.paper : V2.c.ink,
          border: 'none',
          borderLeft: i > 0 ? `1px solid ${V2.c.ink}` : 'none',
          cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
        }}>{o.l}</button>
      ))}
    </div>
  );
}

Object.assign(window, {
  V3GuestHome, V3GuestArchive, V3GuestSchedule, V3GuestMe, V3AssessmentDetail,
});
