// Lumen v3 — Home / Schedule / Me screens
// Archive screen reuses V2ScreenProgress

const { useState: u3sState } = React;

// ────────────────────────────────────────────────────────────
// HOME — designed for monthly-cadence feedback (not daily)
// ────────────────────────────────────────────────────────────
function V3Home({ accountId, onOpenFeedback, onOpenLesson, onOpenArchive, onOpenSchedule }) {
  // subscribe to live LumenStore so teacher submissions show up immediately
  if (window.LumenStore) window.LumenStore.useLumenStore();

  const account = ACCOUNTS.find(a => a.id === accountId);
  const week = WEEK_SCHEDULE[accountId] || [];

  // Prefer live teacher-submitted feedback over mock
  const liveFb = window.LumenStore
    ? window.LumenStore.getFeedback().find(f => f.studentId === accountId)
    : null;
  const fb = liveFb || RECENT_FEEDBACK[accountId];

  // Live counts for the "本月小记" strip
  const liveStats = window.LumenStore ? (() => {
    const fbs   = window.LumenStore.getFeedback().filter(f => f.studentId === accountId);
    const snips = window.LumenStore.getSnippets().filter(s => s.studentId === accountId);
    const reps  = window.LumenStore.getReports().filter(r => r.studentId === accountId);
    const kw = new Set([
      ...fbs.flatMap(f => f.tags || []),
      ...snips.flatMap(s => s.keywords || []),
    ]);
    return { fb: fbs.length, snip: snips.length, kw: kw.size, rep: reps.length };
  })() : { fb: 0, snip: 0, kw: 0, rep: 0 };
  const hasLive = liveStats.fb + liveStats.snip + liveStats.rep > 0;

  const q = QUARTER_HIGHLIGHT[accountId];

  // Today's path — full-day camp (e.g. Saturday all-day care)
  const dayPath = week.filter(c => c.dayPlan);
  const hasDayPath = dayPath.length >= 2;

  // Greeting
  const today = new Date();
  const wkLabel = ['日','一','二','三','四','五','六'][today.getDay()];

  return (
    <div style={{ padding: '4px 0 24px' }}>
      {/* Quiet date strip */}
      <div style={{
        padding: '14px 22px 12px',
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5, textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>WEEK 18 · 2026</span>
        <span>04.28 周{wkLabel}</span>
      </div>

      {/* Greeting */}
      <div style={{ padding: '0 22px 20px' }}>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>
          {account.role === 'parent' ? '你好，' : '看看 '}
          <span style={{ color: V2.c.cobalt }}>{account.name}</span>
          {account.role === 'parent' ? '。' : ' 这周。'}
        </div>
      </div>

      {/* ── Live month tally — only when teachers have submitted things ── */}
      {hasLive && (
        <div style={{ padding: '0 22px 20px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: V2.font.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: 1.5, color: V2.c.muted,
            }}>本月 · THIS MONTH</span>
            <span style={{
              flex: 1, height: 1, background: V2.c.line, alignSelf: 'center',
            }}/>
            {liveStats.rep > 0 && (
              <span style={{
                fontFamily: V2.font.mono, fontSize: 9, color: V2.c.cobalt,
                letterSpacing: 1, fontWeight: 700,
              }}>· {liveStats.rep} 份新报告</span>
            )}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
            border: `1px solid ${V2.c.ink}`, background: V2.c.paper,
          }}>
            <Tally n={liveStats.fb}   label="课堂反馈" sub="FEEDBACK"/>
            <Tally n={liveStats.snip} label="课堂切片" sub="SNIPPETS" border/>
            <Tally n={liveStats.kw}   label="关键词"   sub="KEYWORDS" border/>
          </div>
        </div>
      )}

      {/* ── SECTION 0 · 今日动线 (only when there's a full-day camp today) ── */}
      {hasDayPath && (
        <>
          <div style={{
            padding: '12px 22px 8px', borderTop: `1px solid ${V2.c.ink}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <div style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
              00 · 今日动线 · TODAY'S PATH
            </div>
            <span style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1 }}>
              {dayPath[0].date} · {dayPath[0].dayCN}
            </span>
          </div>

          {/* Big day-summary card */}
          <div style={{ padding: '4px 22px 18px' }}>
            <div style={{
              background: V2.c.cobalt, color: V2.c.paper,
              padding: '20px 18px 6px',
            }}>
              <div style={{
                fontFamily: V2.font.mono, fontSize: 9, opacity: 0.7,
                letterSpacing: 1.5, marginBottom: 6,
              }}>
                ALL-DAY · {dayPath.length} SESSIONS · 9:30—15:45
              </div>
              <div style={{
                fontFamily: V2.font.cn, fontSize: 22, fontWeight: 800,
                letterSpacing: -0.5, lineHeight: 1.2,
              }}>
                {account.name} 的一天
              </div>
              <div style={{
                marginTop: 4, fontFamily: V2.font.cn, fontSize: 11.5,
                opacity: 0.85, lineHeight: 1.5,
              }}>
                按级别分班 · 中{dayPath.find(c=>c.subject==='chinese')?.title.replace('中文 ','') || '—'} · 数{dayPath.find(c=>c.subject==='math')?.title.replace('数学 ','') || '—'} · 法{dayPath.find(c=>c.subject==='french')?.title.replace('法语 ','') || '—'} · 英{dayPath.find(c=>c.subject==='english')?.title.replace('英语 ','') || '—'}
              </div>
            </div>

            {/* Vertical timeline of the day */}
            <div style={{ background: V2.c.cream, padding: '6px 0 8px' }}>
              {dayPath.map((cls, i) => {
                const isLast = i === dayPath.length - 1;
                const room = (cls.mode.match(/教室\s*([A-F])|自习区/) || [])[0] || cls.mode;
                return (
                  <button key={i} onClick={() => onOpenLesson(cls)} style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: 'transparent', border: 'none',
                    padding: '10px 18px', display: 'flex', gap: 12, alignItems: 'stretch',
                    position: 'relative',
                  }}>
                    {/* Time + dot column */}
                    <div style={{ width: 46, flexShrink: 0, position: 'relative' }}>
                      <div style={{
                        fontFamily: V2.font.mono, fontSize: 11, fontWeight: 700,
                        color: V2.c.ink, letterSpacing: 0.5,
                      }}>{cls.time}</div>
                      <div style={{
                        fontFamily: V2.font.mono, fontSize: 8.5, color: V2.c.muted,
                        marginTop: 1,
                      }}>{cls.dur}'</div>
                    </div>
                    {/* Connector line + dot */}
                    <div style={{ width: 12, flexShrink: 0, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: 5, top: 0, bottom: isLast ? '50%' : -12,
                        width: 1, background: V2.c.line,
                      }}/>
                      <div style={{
                        position: 'absolute', left: 0, top: 6, width: 11, height: 11,
                        background: V2.c.paper,
                        border: `2px solid ${cls.subject === 'support' ? V2.c.muted : V2.c[cls.subject] || V2.c.ink}`,
                      }}/>
                    </div>
                    {/* Body */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <V2Tag subject={cls.subject} size="sm"/>
                        {cls.adjusted && (
                          <span style={{
                            fontFamily: V2.font.mono, fontSize: 8, color: V2.c.coral,
                            background: V2.c.coralLight, padding: '2px 5px', letterSpacing: 0.5, fontWeight: 600,
                          }}>调课</span>
                        )}
                      </div>
                      <div style={{ fontFamily: V2.font.cn, fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>
                        {cls.title}
                      </div>
                      <div style={{
                        marginTop: 3, fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
                        display: 'flex', gap: 8, alignItems: 'center',
                      }}>
                        <span>{room}</span>
                        <span style={{ width: 2, height: 2, background: V2.c.muted, borderRadius: '50%' }}/>
                        <span>{cls.teacher}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {/* Lunch divider */}
              <div style={{
                margin: '4px 18px 0', padding: '6px 0',
                fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
                letterSpacing: 1.5, textAlign: 'center',
                borderTop: `1px dashed ${V2.c.line}`,
              }}>
                · 11:45 — 13:30  午休 ·
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SECTION 1 · This week's classes ──────────────────── */}
      <div style={{
        padding: '12px 22px 8px', borderTop: `1px solid ${V2.c.ink}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          01 · 本周课程
        </div>
        <button onClick={onOpenSchedule} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1,
        }}>课表 →</button>
      </div>

      {week.length === 0 ? (
        <div style={{
          margin: '4px 22px 24px', padding: '24px 16px',
          background: V2.c.cream, textAlign: 'center',
        }}>
          <div style={{ fontFamily: V2.font.cn, fontSize: 13, color: V2.c.muted }}>
            本周休课 · 下周一起加油
          </div>
        </div>
      ) : (
        <div style={{ padding: '4px 22px 24px' }}>
          {week.map((cls, i) => (
            <button key={i} onClick={() => onOpenLesson(cls)} style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: 'transparent', border: 'none', padding: 0,
              borderTop: i === 0 ? 'none' : `1px solid ${V2.c.lineSoft}`,
              display: 'flex', gap: 14, alignItems: 'stretch',
              padding: '14px 0',
            }}>
              {/* Date column */}
              <div style={{ width: 44, flexShrink: 0, textAlign: 'left' }}>
                <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1, fontWeight: 600 }}>{cls.day}</div>
                <div style={{ fontFamily: V2.font.poster, fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>{cls.dayCN.slice(1)}</div>
                <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, marginTop: 4 }}>{cls.date}</div>
              </div>
              {/* Body */}
              <div style={{ flex: 1, minWidth: 0, borderLeft: `1px solid ${V2.c.line}`, paddingLeft: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <V2Tag subject={cls.subject} size="sm"/>
                  {cls.adjusted && (
                    <span style={{
                      fontFamily: V2.font.mono, fontSize: 8, color: V2.c.coral,
                      background: V2.c.coralLight, padding: '2px 5px', letterSpacing: 0.5, fontWeight: 600,
                    }}>调课</span>
                  )}
                </div>
                <div style={{ fontFamily: V2.font.cn, fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.3 }}>
                  {cls.title}
                </div>
                <div style={{
                  marginTop: 6, fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
                  display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <span>{cls.time} · {cls.dur}'</span>
                  <span style={{ width: 2, height: 2, background: V2.c.muted, borderRadius: '50%' }}/>
                  <span>{cls.teacher}</span>
                </div>
                <div style={{ marginTop: 4, fontFamily: V2.font.cn, fontSize: 10.5, color: V2.c.inkSoft }}>{cls.mode}</div>
              </div>
              <svg width="10" height="10" viewBox="0 0 10 10" style={{ alignSelf: 'center', flexShrink: 0 }}>
                <path d="M3 1.5 L7 5 L3 8.5" stroke={V2.c.muted} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* ── SECTION 2 · Most recent classroom record ────────── */}
      <div style={{
        padding: '12px 22px 8px', borderTop: `1px solid ${V2.c.ink}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          02 · 最近一次记录
        </div>
        <span style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1 }}>
          {fb ? `· ${fb.date}` : '暂无'}
        </span>
      </div>

      {fb ? (
        <button onClick={() => onOpenFeedback(fb)} style={{
          margin: '4px 22px 24px', padding: '18px 18px 16px',
          background: V2.c.ink, color: V2.c.paper,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          width: 'calc(100% - 44px)', display: 'block',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: V2.font.mono, fontSize: 9, color: V2.c.paper, opacity: 0.7,
                letterSpacing: 1.5,
              }}>{subjectLabel(fb.subject)} · {fb.teacher}</span>
            </div>
            <span style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.paper, opacity: 0.5 }}>{fb.date}</span>
          </div>
          <div style={{ fontFamily: V2.font.cn, fontSize: 14.5, fontWeight: 500, lineHeight: 1.55, letterSpacing: -0.2 }}>
            "{fb.text}"
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fb.tags.map(t => (
              <span key={t} style={{
                fontFamily: V2.font.cn, fontSize: 10, fontWeight: 600,
                padding: '3px 7px', border: `1px solid rgba(255,255,255,0.4)`,
                color: V2.c.paper,
              }}>{t}</span>
            ))}
          </div>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: V2.font.mono, fontSize: 9.5, letterSpacing: 1, opacity: 0.85,
          }}>
            <span>查看完整切片</span>
            <span>→</span>
          </div>
        </button>
      ) : (
        <div style={{
          margin: '4px 22px 24px', padding: '20px 16px',
          background: V2.c.cream, textAlign: 'center',
        }}>
          <div style={{ fontFamily: V2.font.cn, fontSize: 13, color: V2.c.muted, lineHeight: 1.5 }}>
            首次月度复盘后<br/>将在此呈现老师的记录
          </div>
        </div>
      )}

      {/* ── SECTION 3 · This quarter's milestone ────────────── */}
      <div style={{
        padding: '12px 22px 8px', borderTop: `1px solid ${V2.c.ink}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          03 · 本季跨越
        </div>
      </div>

      <button onClick={onOpenArchive} style={{
        margin: '4px 22px 0', padding: '20px 0 18px',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        width: 'calc(100% - 44px)', display: 'block',
      }}>
        {q.gain ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div style={{
                fontFamily: V2.font.poster, fontSize: 92, fontWeight: 900,
                lineHeight: 0.85, letterSpacing: -3, color: V2.c.cobalt,
              }}>+{q.gain}</div>
              <div>
                <div style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>{q.label}</div>
                <div style={{ fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted, marginTop: 4, letterSpacing: 0.5 }}>{q.detail}</div>
              </div>
            </div>
            <div style={{
              marginTop: 16, padding: '10px 12px',
              background: V2.c.cobaltLight, color: V2.c.cobalt,
              fontFamily: V2.font.cn, fontSize: 11.5, fontWeight: 600,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>距下次 Milestone Review · {q.daysToReview} 天</span>
              <span>打开 Progress File →</span>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontFamily: V2.font.poster, fontSize: 38, fontWeight: 900, lineHeight: 1, color: V2.c.muted }}>—</div>
            <div style={{ marginTop: 8, fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600 }}>{q.label}</div>
            <div style={{ fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted, marginTop: 4 }}>{q.detail}</div>
            <div style={{ marginTop: 14, fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1 }}>
              首次诊断报告 · {q.daysToReview} 天后 →
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

// Tally — small stat cell used in V3Home month strip
function Tally({ n, label, sub, border }) {
  return (
    <div style={{
      padding: '14px 10px 12px', textAlign: 'center',
      borderLeft: border ? `1px solid ${V2.c.line}` : 'none',
    }}>
      <div style={{
        fontFamily: V2.font.poster, fontSize: 32, fontWeight: 900,
        lineHeight: 1, letterSpacing: -1, color: V2.c.ink,
      }}>{n}</div>
      <div style={{
        marginTop: 6, fontFamily: V2.font.cn, fontSize: 11, fontWeight: 700, color: V2.c.ink,
      }}>{label}</div>
      <div style={{
        marginTop: 2, fontFamily: V2.font.mono, fontSize: 8.5, color: V2.c.muted, letterSpacing: 1,
      }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SCHEDULE — week + month overview
// ────────────────────────────────────────────────────────────
function V3Schedule({ accountId, onOpenLesson }) {
  const week = WEEK_SCHEDULE[accountId] || [];

  // Build month grid
  const month = 4; // April
  const today = 28;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstDayOfMonth = 2; // April 1st 2026 is Wednesday → index 3 (0=Sun). Use 3 for typical CN cal start Mon.
  // Compute: which dates have classes (mock based on weekday)
  // April 2026: 1=Wed, so dates: Wed=1,8,15,22,29; Sat=4,11,18,25; Sun=5,12,19,26
  const classDates = {};
  if (accountId === 'lin') {
    [1, 8, 15, 22, 29].forEach(d => classDates[d] = ['chinese']);
    [4, 11, 18, 25].forEach(d => classDates[d] = ['math']);
    [5, 12, 19, 26].forEach(d => classDates[d] = ['french']);
    classDates[3] = ['math']; // adjusted/补课
  } else if (accountId === 'parent') {
    [1, 8, 15, 22, 29].forEach(d => classDates[d] = ['chinese']);
  } else if (accountId === 'wang') {
    [4, 11, 18, 25].forEach(d => classDates[d] = ['chinese']);
  }

  return (
    <div style={{ padding: '4px 0 24px' }}>
      {/* Header */}
      <div style={{ padding: '14px 22px 8px' }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1.5 }}>
          课表 · SCHEDULE
        </div>
        <div style={{
          fontFamily: V2.font.poster, fontSize: 32, fontWeight: 900,
          letterSpacing: -1, lineHeight: 1, marginTop: 6,
        }}>本周课程</div>
      </div>

      {/* This week */}
      <div style={{ padding: '8px 22px 4px', borderTop: `1px solid ${V2.c.ink}`, marginTop: 12 }}>
        <div style={{
          padding: '8px 0',
          fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>WEEK 18 · 04.27 — 05.03</span>
          <span style={{ color: V2.c.muted, fontWeight: 500 }}>{week.length} 节课</span>
        </div>
      </div>
      <div style={{ padding: '0 22px 16px' }}>
        {week.length === 0 ? (
          <div style={{
            padding: '24px 0', textAlign: 'center',
            fontFamily: V2.font.cn, fontSize: 12, color: V2.c.muted,
            borderTop: `1px solid ${V2.c.lineSoft}`,
          }}>本周休课</div>
        ) : week.map((cls, i) => (
          <button key={i} onClick={() => onOpenLesson(cls)} style={{
            width: '100%', cursor: 'pointer', background: 'transparent',
            border: 'none', padding: '14px 0', textAlign: 'left',
            borderTop: `1px solid ${V2.c.lineSoft}`,
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <div style={{ width: 44, flexShrink: 0 }}>
              <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1, fontWeight: 600 }}>{cls.day}</div>
              <div style={{ fontFamily: V2.font.poster, fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>{cls.dayCN.slice(1)}</div>
              <div style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, marginTop: 4 }}>{cls.date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, borderLeft: `1px solid ${V2.c.line}`, paddingLeft: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <V2Tag subject={cls.subject} size="sm"/>
                {cls.adjusted && (
                  <span style={{
                    fontFamily: V2.font.mono, fontSize: 8, color: V2.c.coral,
                    background: V2.c.coralLight, padding: '2px 5px', letterSpacing: 0.5, fontWeight: 600,
                  }}>调课</span>
                )}
              </div>
              <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>{cls.title}</div>
              <div style={{ marginTop: 4, fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted }}>
                {cls.time} · {cls.dur}' · {cls.teacher}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Month overview */}
      <div style={{ padding: '8px 22px 4px', borderTop: `1px solid ${V2.c.ink}` }}>
        <div style={{
          padding: '8px 0',
          fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        }}>
          APRIL · 2026 · 月览
        </div>
      </div>
      <div style={{ padding: '4px 22px 0' }}>
        {/* Weekday labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
          {['一','二','三','四','五','六','日'].map(d => (
            <div key={d} style={{
              fontFamily: V2.font.cn, fontSize: 9, color: V2.c.muted,
              textAlign: 'center', fontWeight: 600,
            }}>{d}</div>
          ))}
        </div>
        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={'e'+i}/>)}
          {days.map(d => {
            const has = classDates[d];
            const isToday = d === today;
            return (
              <div key={d} style={{
                aspectRatio: '1', position: 'relative',
                background: isToday ? V2.c.ink : (has ? V2.c.cream : 'transparent'),
                color: isToday ? V2.c.paper : V2.c.ink,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontFamily: V2.font.mono, fontSize: 11, fontWeight: 600,
              }}>
                {d}
                {has && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {has.map((s, i) => (
                      <div key={i} style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: V2.c[s] || V2.c.ink,
                      }}/>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '24px 22px 0', borderTop: `1px solid ${V2.c.lineSoft}`, marginTop: 24 }}>
        <button style={{
          width: '100%', padding: '14px',
          background: V2.c.ink, color: V2.c.paper,
          border: 'none', cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
          marginBottom: 8,
        }}>预约新课程 →</button>
        <button style={{
          width: '100%', padding: '14px',
          background: V2.c.paper, color: V2.c.ink,
          border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600,
        }}>请假 / 调课</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SHARE SHEET — 邀请朋友
// ────────────────────────────────────────────────────────────
function ShareSheet({ onClose, accountName }) {
  const [copied, setCopied] = u3sState(false);
  const inviteLink = 'https://lumen.education/i/' + (accountName?.length ? 'X' + (accountName.charCodeAt(0) % 1000) : 'X728');
  const inviteText = `${accountName}向你推荐 Lumen 教育——给孩子做"看得见的成长"。新生通过我的链接报名，双方各得 1 节体验课。`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${inviteText}\n${inviteLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lumen 教育', text: inviteText, url: inviteLink });
      } catch {}
    } else {
      copyLink();
    }
  };

  const channels = [
    { id: 'wechat',    label: '微信好友', icon: '💬', color: '#07C160' },
    { id: 'moments',   label: '朋友圈',   icon: '◫',  color: '#07C160' },
    { id: 'xhs',       label: '小红书',   icon: '✦',  color: '#FF2442' },
    { id: 'mail',      label: '邮件',     icon: '✉',  color: V2.c.cobalt },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      }}/>

      {/* Sheet */}
      <div style={{
        position: 'relative', background: V2.c.paper,
        borderTop: `1px solid ${V2.c.ink}`,
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        maxHeight: '92%', overflowY: 'auto',
        animation: 'shareUp 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        {/* Drag bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
          <div style={{ width: 40, height: 4, background: V2.c.muted, opacity: 0.3, borderRadius: 2 }}/>
        </div>

        {/* Header */}
        <div style={{
          padding: '16px 22px 8px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <div>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1.5,
            }}>SHARE LUMEN</div>
            <h2 style={{
              margin: '4px 0 0', fontFamily: V2.font.cn,
              fontSize: 22, fontWeight: 800, letterSpacing: -0.4,
            }}>邀请朋友</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: V2.font.mono, fontSize: 18, color: V2.c.muted, padding: 4,
          }}>×</button>
        </div>

        {/* Invite card preview — Lumen visual DNA */}
        <div style={{ padding: '12px 22px 0' }}>
          <div style={{
            background: V2.c.ink, color: V2.c.paper,
            padding: '24px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Background mark */}
            <div style={{
              position: 'absolute', right: -20, top: -10,
              fontFamily: V2.font.display, fontSize: 160, fontWeight: 900,
              color: V2.c.paper, opacity: 0.06, lineHeight: 0.8, letterSpacing: -8,
            }}>Lumen</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: V2.font.mono, fontSize: 9.5, letterSpacing: 2,
                opacity: 0.6, marginBottom: 12,
              }}>FROM {accountName?.toUpperCase()}</div>
              <div style={{
                fontFamily: V2.font.cn, fontSize: 19, fontWeight: 700,
                lineHeight: 1.45, marginBottom: 20,
              }}>
                让每个孩子的成长<br/>
                被看见、被记得、被珍藏
              </div>
              <div style={{
                display: 'flex', gap: 16, paddingTop: 14,
                borderTop: `1px solid ${V2.c.paper}30`,
              }}>
                <Stat label="家庭" value="200+"/>
                <Stat label="国家" value="12"/>
                <Stat label="学科" value="6"/>
              </div>
              <div style={{
                marginTop: 18, padding: '8px 12px',
                background: V2.c.cobalt, display: 'inline-block',
                fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
              }}>双方各得 1 节体验课</div>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div style={{ padding: '24px 22px 8px' }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
            letterSpacing: 2, marginBottom: 12,
          }}>分享到</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          }}>
            {channels.map(c => (
              <button key={c.id} onClick={nativeShare} style={{
                background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
                cursor: 'pointer', padding: '14px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                fontFamily: 'inherit',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: c.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700,
                }}>{c.icon}</div>
                <span style={{
                  fontFamily: V2.font.cn, fontSize: 11, color: V2.c.ink, fontWeight: 600,
                }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy link */}
        <div style={{ padding: '8px 22px 0' }}>
          <div style={{
            display: 'flex', border: `1px solid ${V2.c.ink}`,
            background: V2.c.paper, alignItems: 'stretch',
          }}>
            <div style={{
              flex: 1, minWidth: 0, padding: '12px 14px',
              fontFamily: V2.font.mono, fontSize: 12, color: V2.c.inkSoft,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{inviteLink}</div>
            <button onClick={copyLink} style={{
              background: copied ? V2.c.cobalt : V2.c.ink,
              color: V2.c.paper, border: 'none', cursor: 'pointer',
              padding: '0 18px', fontFamily: V2.font.mono, fontSize: 11,
              fontWeight: 700, letterSpacing: 1.5,
              transition: 'background 200ms',
            }}>{copied ? '✓ 已复制' : '复制链接'}</button>
          </div>
        </div>

        {/* Reward note */}
        <div style={{ padding: '20px 22px 36px' }}>
          <div style={{
            fontFamily: V2.font.cn, fontSize: 11, color: V2.c.muted,
            lineHeight: 1.7, paddingTop: 16, borderTop: `1px solid ${V2.c.lineSoft}`,
          }}>
            朋友通过你的邀请链接报名首期课程后，双方账号自动到账 1 节体验课，可在「课表」中预约。每个家庭最多获得 5 节奖励课。
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shareUp {
          from { transform: translateY(40%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{
        fontFamily: V2.font.display, fontSize: 22, fontWeight: 800, lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9, opacity: 0.6,
        letterSpacing: 1.5, marginTop: 4,
      }}>{label}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ME — settings, contact, reports
// ────────────────────────────────────────────────────────────
function V3Me({ accountId }) {
  const account = ACCOUNTS.find(a => a.id === accountId);
  const [shareOpen, setShareOpen] = u3sState(false);
  return (
    <div style={{ padding: '4px 0 24px' }}>
      <div style={{ padding: '14px 22px 8px' }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted, letterSpacing: 1.5 }}>
          我的 · ACCOUNT
        </div>
      </div>

      {/* Profile card */}
      <div style={{ padding: '8px 22px 24px', borderBottom: `1px solid ${V2.c.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: account.role === 'parent' ? V2.c.cobalt : V2.c.ink,
            color: V2.c.paper, fontFamily: V2.font.cn, fontSize: 22, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{account.initial}</div>
          <div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>{account.name}</div>
            <div style={{ fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted, marginTop: 4, letterSpacing: 0.5 }}>{account.courseLabel}</div>
          </div>
        </div>
      </div>

      {/* Invite Friends — 邀请朋友 */}
      <button onClick={() => setShareOpen(true)} style={{
        width: '100%', textAlign: 'left',
        padding: '20px 22px',
        background: V2.c.ink, color: V2.c.paper,
        border: 'none', borderBottom: `1px solid ${V2.c.ink}`,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          border: `1.5px solid ${V2.c.paper}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={V2.c.paper} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 9, letterSpacing: 2,
            opacity: 0.7, marginBottom: 4,
          }}>SHARE LUMEN</div>
          <div style={{ fontFamily: V2.font.cn, fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
            把 Lumen 推荐给好友
          </div>
          <div style={{
            fontFamily: V2.font.cn, fontSize: 12, opacity: 0.7, lineHeight: 1.5,
          }}>朋友首次报名，双方各得 1 节体验课</div>
        </div>
        <span style={{
          fontFamily: V2.font.mono, fontSize: 11, opacity: 0.7, letterSpacing: 1,
        }}>→</span>
      </button>

      {/* Reports */}
      <V3MeSection title="报告" en="REPORTS">
        <V3MeRow label="2026 第一季度 · Milestone Report" right="PDF · 2.4M" badge="新"/>
        <V3MeRow label="2025 第四季度 · Milestone Report" right="PDF · 2.1M"/>
        <V3MeRow label="入学诊断报告" right="PDF · 1.8M"/>
      </V3MeSection>

      {/* Family */}
      <V3MeSection title="家庭与账号" en="FAMILY">
        <V3MeRow label="家庭成员 · 3 人" right="管理 →"/>
        <V3MeRow label="账号通知设置" right="→"/>
      </V3MeSection>

      {/* Support */}
      <V3MeSection title="联系我们" en="SUPPORT">
        <V3MeRow label="顾问 · Lin Wei" right="微信 →" highlight/>
        <V3MeRow label="教学事务" right="电话 →"/>
        <V3MeRow label="预约咨询 / 测评" right="→"/>
      </V3MeSection>

      {/* About */}
      <V3MeSection title="关于" en="ABOUT">
        <V3MeRow label="教务后台" right="登录 →" highlight onClick={() => window.open('/staff.html', '_blank')}/>
        <V3MeRow label="语言 · 中文 / Français" right="→"/>
        <V3MeRow label="隐私政策" right="→"/>
        <V3MeRow label="版本" right="v1.0.0"/>
      </V3MeSection>

      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} accountName={account.name}/>}
    </div>
  );
}

function V3MeSection({ title, en, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${V2.c.ink}` }}>
      <div style={{
        padding: '14px 22px 6px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <span style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 800 }}>{title}</span>
        <span style={{ fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted, letterSpacing: 1.5 }}>{en}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function V3MeRow({ label, right, badge, highlight, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', background: highlight ? V2.c.cobaltLight : 'transparent',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      padding: '14px 22px',
      borderTop: `1px solid ${V2.c.lineSoft}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 10,
    }}>
      <span style={{
        fontFamily: V2.font.cn, fontSize: 13, fontWeight: 500,
        color: highlight ? V2.c.cobalt : V2.c.ink,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {label}
        {badge && (
          <span style={{
            fontFamily: V2.font.cn, fontSize: 9, fontWeight: 700,
            background: V2.c.coral, color: V2.c.paper,
            padding: '1px 5px',
          }}>{badge}</span>
        )}
      </span>
      <span style={{
        fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
        letterSpacing: 0.5, flexShrink: 0,
      }}>{right}</span>
    </button>
  );
}

Object.assign(window, { V3Home, V3Schedule, V3Me });
