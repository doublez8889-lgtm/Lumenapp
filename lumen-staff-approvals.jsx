// lumen-staff-approvals.jsx
// 教务端审批页：处理家长提交的请假/调课申请
//
// 暴露：window.ApprovalsTab

(function () {
  'use strict';

  const T = window.T;
  if (!T) {
    console.error('[approvals] T tokens not ready');
    return;
  }

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    if (diff < 60_000)       return '刚刚';
    if (diff < 3_600_000)    return Math.floor(diff / 60_000) + ' 分钟前';
    if (diff < 86_400_000)   return Math.floor(diff / 3_600_000) + ' 小时前';
    return Math.floor(diff / 86_400_000) + ' 天前';
  }

  const TYPE_LABEL = {
    leave: { label: '请假', color: T.c.coral || '#D6603A' },
    reschedule: { label: '调课', color: T.c.math || '#1E3FCC' },
  };

  const STATUS_LABEL = {
    pending:  { label: '待处理', color: T.c.muted },
    approved: { label: '已批准', color: '#2C7A4E' },
    rejected: { label: '已驳回', color: '#B83232' },
  };

  function ApprovalsTab() {
    window.LumenStore.useLumenStore();
    const all = window.LumenStore.getRequests();
    const [filter, setFilter] = React.useState('pending'); // pending | all | approved | rejected
    const [selected, setSelected] = React.useState(null);
    const [note, setNote] = React.useState('');

    const filtered = filter === 'all' ? all : all.filter(r => r.status === filter);

    const counts = {
      pending: all.filter(r => r.status === 'pending').length,
      approved: all.filter(r => r.status === 'approved').length,
      rejected: all.filter(r => r.status === 'rejected').length,
      all: all.length,
    };

    const decide = (status) => {
      if (!selected) return;
      window.LumenStore.updateRequest(selected.id, {
        status,
        decidedAt: Date.now(),
        decidedBy: '教务',
        staffNote: note.trim() || undefined,
      });
      setSelected(null);
      setNote('');
    };

    return (
      <div style={{ padding: 32, minHeight: '100vh' }}>
        {/* 标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2, color: T.c.muted }}>APPROVALS</div>
            <h1 style={{ margin: '4px 0 0', fontFamily: T.font.display, fontSize: 30, fontWeight: 800, letterSpacing: -0.6 }}>
              请假 · 调课 审批
            </h1>
          </div>
          <div style={{
            fontFamily: T.font.mono, fontSize: 11, color: T.c.muted, letterSpacing: 1,
          }}>
            待处理 <span style={{
              color: counts.pending > 0 ? '#B83232' : T.c.muted,
              fontWeight: 700, fontSize: 13,
            }}>{counts.pending}</span>
          </div>
        </div>

        {/* 过滤器 */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${T.c.line}` }}>
          {[
            { k: 'pending', label: '待处理', n: counts.pending },
            { k: 'approved', label: '已批准', n: counts.approved },
            { k: 'rejected', label: '已驳回', n: counts.rejected },
            { k: 'all', label: '全部', n: counts.all },
          ].map(t => {
            const on = filter === t.k;
            return (
              <button key={t.k} onClick={() => setFilter(t.k)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '10px 18px',
                fontFamily: T.font.cn, fontSize: 13, fontWeight: on ? 700 : 500,
                color: on ? T.c.ink : T.c.inkSoft,
                borderBottom: on ? `2px solid ${T.c.ink}` : '2px solid transparent',
                marginBottom: -1,
              }}>
                {t.label} <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted, marginLeft: 4 }}>{t.n}</span>
              </button>
            );
          })}
        </div>

        {/* 主内容 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          {/* 左：列表 */}
          <div>
            {filtered.length === 0 ? (
              <div style={{
                padding: '60px 20px', border: `1px dashed ${T.c.line}`,
                textAlign: 'center', color: T.c.muted,
              }}>
                <div style={{ fontFamily: T.font.cn, fontSize: 14, marginBottom: 4 }}>
                  {filter === 'pending' ? '没有待处理的申请' : '没有记录'}
                </div>
                <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1, opacity: 0.7 }}>
                  ALL CLEAR
                </div>
              </div>
            ) : filtered.map(r => {
              const tm = TYPE_LABEL[r.type] || TYPE_LABEL.leave;
              const sm = STATUS_LABEL[r.status];
              const active = selected?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => { setSelected(r); setNote(''); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: active ? T.c.lineSoft : T.c.paper,
                    border: `1px solid ${T.c.line}`,
                    borderLeft: `4px solid ${tm.color}`,
                    padding: '14px 18px',
                    marginBottom: 10, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: T.font.mono, fontSize: 9, letterSpacing: 1.5,
                      fontWeight: 700, color: tm.color, textTransform: 'uppercase',
                    }}>{tm.label}</span>
                    <span style={{
                      fontFamily: T.font.mono, fontSize: 9, letterSpacing: 1,
                      fontWeight: 600, color: sm.color, textTransform: 'uppercase',
                    }}>· {sm.label}</span>
                    <span style={{ flex: 1 }}/>
                    <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted }}>
                      {timeAgo(r.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontFamily: T.font.cn, fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                    {r.studentName} · {r.lessonTitle}
                  </div>
                  <div style={{ fontFamily: T.font.mono, fontSize: 11, color: T.c.muted, marginBottom: 6 }}>
                    {r.lessonDate}
                  </div>
                  <div style={{ fontFamily: T.font.cn, fontSize: 13, color: T.c.inkSoft, lineHeight: 1.5 }}>
                    {r.reason}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右：详情 / 审批面板 */}
          <div style={{ position: 'sticky', top: 32 }}>
            {!selected ? (
              <div style={{
                padding: '40px 20px', border: `1px dashed ${T.c.line}`,
                textAlign: 'center', color: T.c.muted, background: T.c.paper,
              }}>
                <div style={{ fontFamily: T.font.cn, fontSize: 13 }}>选一条申请查看详情</div>
              </div>
            ) : (
              <div style={{
                background: T.c.paper, border: `1px solid ${T.c.ink}`, padding: 22,
              }}>
                <div style={{
                  fontFamily: T.font.mono, fontSize: 9, letterSpacing: 2,
                  color: TYPE_LABEL[selected.type].color, fontWeight: 700, marginBottom: 8,
                }}>{TYPE_LABEL[selected.type].label.toUpperCase()} · {STATUS_LABEL[selected.status].label}</div>
                <h2 style={{ margin: '0 0 4px', fontFamily: T.font.cn, fontSize: 18, fontWeight: 800 }}>
                  {selected.studentName}
                </h2>
                <div style={{
                  fontFamily: T.font.cn, fontSize: 14, color: T.c.inkSoft, marginBottom: 14,
                }}>
                  {selected.lessonTitle} · {selected.lessonDate}
                </div>

                <Row label="原因" value={selected.reason}/>
                {selected.preferredSlot && (
                  <Row label="期望调到" value={selected.preferredSlot}/>
                )}
                <Row label="提交时间" value={new Date(selected.createdAt).toLocaleString('zh-CN')} mono/>
                {selected.decidedAt && (
                  <>
                    <Row label="处理时间" value={new Date(selected.decidedAt).toLocaleString('zh-CN')} mono/>
                    <Row label="处理人" value={selected.decidedBy || '—'}/>
                    {selected.staffNote && <Row label="教务备注" value={selected.staffNote}/>}
                  </>
                )}

                {selected.status === 'pending' && (
                  <>
                    <div style={{
                      marginTop: 16,
                      fontFamily: T.font.mono, fontSize: 9, letterSpacing: 2,
                      color: T.c.muted, textTransform: 'uppercase',
                    }}>给家长留言（可选）</div>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      rows={3}
                      placeholder="例：已为孩子安排调到下周三 17:00 同班"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: T.c.cream || '#FAF6EE',
                        border: `1px solid ${T.c.line}`,
                        padding: 10, marginTop: 6,
                        fontFamily: T.font.cn, fontSize: 13,
                        outline: 'none', resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button onClick={() => decide('rejected')} style={{
                        flex: 1, padding: '12px',
                        background: T.c.paper, color: '#B83232',
                        border: `1px solid #B83232`, cursor: 'pointer',
                        fontFamily: T.font.cn, fontSize: 13, fontWeight: 700,
                      }}>驳回</button>
                      <button onClick={() => decide('approved')} style={{
                        flex: 2, padding: '12px',
                        background: T.c.ink, color: T.c.paper,
                        border: `1px solid ${T.c.ink}`, cursor: 'pointer',
                        fontFamily: T.font.cn, fontSize: 13, fontWeight: 700,
                      }}>批准 · 推送家长</button>
                    </div>
                  </>
                )}

                {selected.status !== 'pending' && (
                  <div style={{
                    marginTop: 14, padding: '10px 12px',
                    background: T.c.lineSoft || '#F0EBE2',
                    fontFamily: T.font.mono, fontSize: 10, color: T.c.muted, letterSpacing: 1,
                  }}>已结案，结果已推送给家长。</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function Row({ label, value, mono }) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontFamily: T.font.mono, fontSize: 9, letterSpacing: 2,
          color: T.c.muted, textTransform: 'uppercase', marginBottom: 3,
        }}>{label}</div>
        <div style={{
          fontFamily: mono ? T.font.mono : T.font.cn,
          fontSize: 13, color: T.c.ink, lineHeight: 1.5,
        }}>{value}</div>
      </div>
    );
  }

  window.ApprovalsTab = ApprovalsTab;
  window.dispatchEvent(new CustomEvent('lumen-staff-module-ready'));
})();
