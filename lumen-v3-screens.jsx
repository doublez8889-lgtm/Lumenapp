// Lumen v3 — Home / Schedule / Me screens
// Archive screen reuses V2ScreenProgress

const { useState: u3sState } = React;

// ────────────────────────────────────────────────────────────
// HOME — designed for monthly-cadence feedback (not daily)
// ────────────────────────────────────────────────────────────
function V3Home({ accountId, onOpenFeedback, onOpenLesson, onOpenArchive, onOpenSchedule }) {
  const account = ACCOUNTS.find(a => a.id === accountId);
  const week = WEEK_SCHEDULE[accountId] || [];
  const fb = RECENT_FEEDBACK[accountId];
  const q = QUARTER_HIGHLIGHT[accountId];

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
// ME — settings, contact, reports
// ────────────────────────────────────────────────────────────
function V3Me({ accountId }) {
  const account = ACCOUNTS.find(a => a.id === accountId);
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
        <V3MeRow label="语言 · 中文 / Français" right="→"/>
        <V3MeRow label="隐私政策" right="→"/>
        <V3MeRow label="版本" right="v1.0.0"/>
      </V3MeSection>
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

function V3MeRow({ label, right, badge, highlight }) {
  return (
    <button style={{
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
