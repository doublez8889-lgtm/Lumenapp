// lumen-notifications.jsx
// 家长端通知中心 + 请假/调课表单
//
// 暴露：
//   window.NotificationsScreen({ onBack })
//   window.RequestFormScreen({ onBack, prefill?, defaultType? })

(function () {
  'use strict';

  const V2 = window.V2 || {
    c: { ink: '#0A0A0A', paper: '#F7F3EA', cobalt: '#1E3FCC', muted: '#5C5852', tint: '#EDE5D5', cream: '#FAF6EE' },
    font: { display: 'Inter, sans-serif', body: '"Noto Sans SC", sans-serif', mono: 'JetBrains Mono, monospace' },
  };

  // ── 通知图标 ────────────────────────────────────────────
  const KIND_META = {
    leave_request:        { icon: '🏥', tag: '请假申请', color: V2.c.cobalt },
    reschedule_request:   { icon: '🔁', tag: '调课申请', color: V2.c.cobalt },
    leave_approved:       { icon: '✅', tag: '请假已批准', color: '#2C7A4E' },
    leave_rejected:       { icon: '⚠', tag: '请假未通过', color: '#B83232' },
    reschedule_approved:  { icon: '✅', tag: '调课已批准', color: '#2C7A4E' },
    reschedule_rejected:  { icon: '⚠', tag: '调课未通过', color: '#B83232' },
    feedback:             { icon: '💬', tag: '老师反馈', color: V2.c.cobalt },
    reminder:             { icon: '⏰', tag: '上课提醒', color: V2.c.cobalt },
    report:               { icon: '📊', tag: '月度报告', color: V2.c.cobalt },
  };

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    if (diff < 60_000)       return '刚刚';
    if (diff < 3_600_000)    return Math.floor(diff / 60_000) + ' 分钟前';
    if (diff < 86_400_000)   return Math.floor(diff / 3_600_000) + ' 小时前';
    if (diff < 7 * 86_400_000) return Math.floor(diff / 86_400_000) + ' 天前';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  // ── 通知列表 ────────────────────────────────────────────
  function NotificationsScreen({ onBack, audience = 'parent' }) {
    LumenStore.useLumenStore();
    const items = LumenStore.getNotifications(audience);

    React.useEffect(() => {
      // 进入页面后 0.5s 自动标记已读
      const t = setTimeout(() => LumenStore.markAllRead(audience), 500);
      return () => clearTimeout(t);
    }, [audience]);

    return (
      <div style={{ minHeight: '100vh', background: V2.c.paper, paddingBottom: 80 }}>
        {/* 顶部 */}
        <div style={{
          padding: '54px 22px 16px',
          borderBottom: `1px solid ${V2.c.ink}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: V2.font.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            color: V2.c.ink, padding: 4,
          }}>← 返回</button>
          <div style={{ flex: 1 }}/>
          {items.length > 0 && (
            <button onClick={() => LumenStore.markAllRead(audience)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: V2.font.mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
              color: V2.c.muted, padding: 4,
            }}>全部已读</button>
          )}
        </div>

        <div style={{ padding: '20px 22px 8px' }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 2,
            color: V2.c.muted, marginBottom: 6,
          }}>NOTIFICATIONS · 通知中心</div>
          <h1 style={{
            fontFamily: V2.font.display, fontSize: 28, fontWeight: 800,
            margin: 0, letterSpacing: -0.5, lineHeight: 1.1,
          }}>消息</h1>
        </div>

        {items.length === 0 ? (
          <div style={{
            margin: '40px 22px', padding: '60px 20px',
            border: `1px dashed ${V2.c.ink}40`, borderRadius: 4,
            textAlign: 'center', color: V2.c.muted,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🔔</div>
            <div style={{ fontFamily: V2.font.body, fontSize: 13 }}>暂无消息</div>
            <div style={{ fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 1, marginTop: 8, opacity: 0.6 }}>
              EVERYTHING IS QUIET
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 14px' }}>
            {items.map(n => {
              const meta = KIND_META[n.kind] || { icon: '•', tag: '通知', color: V2.c.muted };
              return (
                <div key={n.id} style={{
                  background: n.read ? V2.c.paper : V2.c.cream,
                  border: `1px solid ${V2.c.ink}`,
                  borderLeft: `4px solid ${meta.color}`,
                  padding: '14px 16px',
                  marginBottom: 10,
                  position: 'relative',
                }}>
                  {!n.read && (
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      width: 7, height: 7, borderRadius: 999,
                      background: meta.color,
                    }}/>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                  }}>
                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                    <span style={{
                      fontFamily: V2.font.mono, fontSize: 9, letterSpacing: 1.5,
                      fontWeight: 700, color: meta.color, textTransform: 'uppercase',
                    }}>{meta.tag}</span>
                    <span style={{ flex: 1 }}/>
                    <span style={{
                      fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
                    }}>{timeAgo(n.createdAt)}</span>
                  </div>
                  <div style={{
                    fontFamily: V2.font.body, fontSize: 14, fontWeight: 700,
                    color: V2.c.ink, marginBottom: 4,
                  }}>{n.title}</div>
                  <div style={{
                    fontFamily: V2.font.body, fontSize: 13, color: V2.c.muted,
                    lineHeight: 1.5,
                  }}>{n.body}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── 请假 / 调课 表单 ────────────────────────────────────
  function RequestFormScreen({ onBack, prefill = {}, defaultType = 'leave', onSubmitted }) {
    const [type, setType]         = React.useState(defaultType);
    const [studentName, setName]  = React.useState(prefill.studentName || '小宇');
    const [lessonTitle, setTitle] = React.useState(prefill.lessonTitle || '');
    const [lessonDate, setDate]   = React.useState(prefill.lessonDate || '');
    const [reason, setReason]     = React.useState('');
    const [preferredSlot, setSlot]= React.useState('');
    const [submitted, setSub]     = React.useState(false);

    const submit = () => {
      if (!lessonTitle.trim() || !lessonDate.trim() || !reason.trim()) return;
      LumenStore.addRequest({
        type, studentName, lessonTitle, lessonDate, reason,
        preferredSlot: type === 'reschedule' ? preferredSlot : undefined,
      });
      setSub(true);
      if (onSubmitted) onSubmitted();
    };

    if (submitted) {
      return (
        <div style={{
          minHeight: '100vh', background: V2.c.paper,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 999,
            background: V2.c.cobalt, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 24,
          }}>✓</div>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 2,
            color: V2.c.muted, marginBottom: 8,
          }}>REQUEST SENT</div>
          <h2 style={{
            fontFamily: V2.font.display, fontSize: 22, fontWeight: 800,
            margin: 0, marginBottom: 12,
          }}>{type === 'leave' ? '请假申请已提交' : '调课申请已提交'}</h2>
          <p style={{
            fontFamily: V2.font.body, fontSize: 14, color: V2.c.muted,
            maxWidth: 280, lineHeight: 1.6, margin: 0, marginBottom: 32,
          }}>教务老师收到后会尽快处理，结果会在「消息」里通知你。</p>
          <button onClick={onBack} style={{
            background: V2.c.ink, color: V2.c.paper, border: 'none',
            padding: '14px 28px', fontSize: 13, fontWeight: 700,
            fontFamily: V2.font.mono, letterSpacing: 1.5, cursor: 'pointer',
          }}>返回首页</button>
        </div>
      );
    }

    const Field = ({ label, children, hint }) => (
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9, letterSpacing: 2,
          color: V2.c.muted, marginBottom: 6, textTransform: 'uppercase',
        }}>{label}</div>
        {children}
        {hint && <div style={{
          fontFamily: V2.font.body, fontSize: 11, color: V2.c.muted, marginTop: 4,
        }}>{hint}</div>}
      </div>
    );

    const inputStyle = {
      width: '100%', boxSizing: 'border-box',
      background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
      padding: '12px 14px', fontSize: 14,
      fontFamily: V2.font.body, color: V2.c.ink,
      outline: 'none', borderRadius: 0,
    };

    return (
      <div style={{ minHeight: '100vh', background: V2.c.paper, paddingBottom: 100 }}>
        {/* 顶部 */}
        <div style={{
          padding: '54px 22px 16px',
          borderBottom: `1px solid ${V2.c.ink}`,
          display: 'flex', alignItems: 'center',
        }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: V2.font.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            color: V2.c.ink, padding: 4,
          }}>← 返回</button>
        </div>

        <div style={{ padding: '20px 22px 8px' }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 2,
            color: V2.c.muted, marginBottom: 6,
          }}>REQUEST · 提交申请</div>
          <h1 style={{
            fontFamily: V2.font.display, fontSize: 28, fontWeight: 800,
            margin: 0, letterSpacing: -0.5, lineHeight: 1.1,
          }}>{type === 'leave' ? '请假' : '调课'}</h1>
        </div>

        {/* 类型切换 */}
        <div style={{ padding: '16px 22px 8px', display: 'flex', gap: 0 }}>
          {[
            { key: 'leave', label: '请假', desc: '取消这节课' },
            { key: 'reschedule', label: '调课', desc: '换到其他时间' },
          ].map(t => (
            <button key={t.key} onClick={() => setType(t.key)} style={{
              flex: 1, padding: '14px 12px',
              background: type === t.key ? V2.c.ink : V2.c.paper,
              color: type === t.key ? V2.c.paper : V2.c.ink,
              border: `1px solid ${V2.c.ink}`,
              borderRight: t.key === 'leave' ? 'none' : `1px solid ${V2.c.ink}`,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ fontFamily: V2.font.body, fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{t.label}</div>
              <div style={{
                fontFamily: V2.font.mono, fontSize: 9, letterSpacing: 1, opacity: 0.7,
              }}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 22px 0' }}>
          <Field label="学生">
            <input value={studentName} onChange={e => setName(e.target.value)} style={inputStyle}/>
          </Field>
          <Field label="课程">
            <input
              value={lessonTitle}
              onChange={e => setTitle(e.target.value)}
              placeholder="例：HSK 2 · 中文"
              style={inputStyle}
            />
          </Field>
          <Field label="原定时间">
            <input
              value={lessonDate}
              onChange={e => setDate(e.target.value)}
              placeholder="例：本周四 16:30"
              style={inputStyle}
            />
          </Field>
          {type === 'reschedule' && (
            <Field label="希望调到" hint="可选 · 教务会参考你的偏好">
              <input
                value={preferredSlot}
                onChange={e => setSlot(e.target.value)}
                placeholder="例：下周三 17:00 之后"
                style={inputStyle}
              />
            </Field>
          )}
          <Field label={type === 'leave' ? '请假原因' : '调课原因'}>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder={type === 'leave' ? '简短说明，如：发烧、家里有事' : '简短说明'}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: V2.font.body }}
            />
          </Field>
        </div>

        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          padding: 16, background: V2.c.paper,
          borderTop: `1px solid ${V2.c.ink}`,
          display: 'flex', gap: 10,
        }}>
          <button onClick={onBack} style={{
            flex: 1, background: V2.c.paper, color: V2.c.ink,
            border: `1px solid ${V2.c.ink}`,
            padding: '14px 0', fontSize: 13, fontWeight: 700,
            fontFamily: V2.font.mono, letterSpacing: 1.5, cursor: 'pointer',
          }}>取消</button>
          <button
            onClick={submit}
            disabled={!lessonTitle.trim() || !lessonDate.trim() || !reason.trim()}
            style={{
              flex: 2, background: V2.c.ink, color: V2.c.paper,
              border: `1px solid ${V2.c.ink}`,
              padding: '14px 0', fontSize: 13, fontWeight: 700,
              fontFamily: V2.font.mono, letterSpacing: 1.5,
              cursor: 'pointer',
              opacity: (!lessonTitle.trim() || !lessonDate.trim() || !reason.trim()) ? 0.4 : 1,
            }}
          >提交申请</button>
        </div>
      </div>
    );
  }

  Object.assign(window, { NotificationsScreen, RequestFormScreen });
})();
