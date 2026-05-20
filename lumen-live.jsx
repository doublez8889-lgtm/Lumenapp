// Lumen · Live home (authed user · real data from Supabase)

const { useState: uLiveState, useEffect: uLiveEffect } = React;

function V3LiveHome({ user, onSignOut, onAddStudent }) {
  const [students, setStudents] = uLiveState(null); // null = loading
  const [err, setErr] = uLiveState(null);

  uLiveEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await window.LumenData.getMyStudents();
        if (alive) setStudents(list);
      } catch (e) {
        if (alive) setErr(e.message || '加载失败');
      }
    })();
    return () => { alive = false; };
  }, []);

  const refresh = async () => {
    try { setStudents(await window.LumenData.getMyStudents()); } catch (e) { setErr(e.message); }
  };

  return (
    <div style={{ padding: '4px 0 24px' }}>
      {/* Date strip */}
      <div style={{
        padding: '14px 22px 12px',
        fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.muted,
        letterSpacing: 1.5, textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>WEEK 18 · 2026</span>
        <span>已登录 · {user.email}</span>
      </div>

      {/* Greeting */}
      <div style={{ padding: '0 22px 24px' }}>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>
          欢迎，<span style={{ color: V2.c.cobalt }}>{user.email?.split('@')[0]}</span>。
        </div>
      </div>

      {/* Section · 孩子档案 */}
      <div style={{
        padding: '12px 22px 8px', borderTop: `1px solid ${V2.c.ink}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
          01 · 我的孩子
        </div>
        <button onClick={onAddStudent} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.cobalt, letterSpacing: 1, fontWeight: 600,
        }}>+ 添加</button>
      </div>

      <div style={{ padding: '4px 22px 24px' }}>
        {students === null ? (
          <div style={{ padding: 20, fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted }}>加载中…</div>
        ) : err ? (
          <div style={{
            padding: '12px 14px', background: V2.c.coralLight, color: V2.c.coral,
            fontFamily: V2.font.cn, fontSize: 12,
          }}>{err}</div>
        ) : students.length === 0 ? (
          <button onClick={onAddStudent} style={{
            width: '100%', padding: '24px 18px',
            background: V2.c.cream, border: `1px dashed ${V2.c.line}`, cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{ fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              首次使用 · 添加孩子档案
            </div>
            <div style={{ fontFamily: V2.font.cn, fontSize: 11.5, color: V2.c.muted, lineHeight: 1.5 }}>
              填一次中 / 数 / 英 / 法的级别，<br/>系统会自动给孩子排出周末一日动线。
            </div>
            <div style={{
              marginTop: 12, fontFamily: V2.font.mono, fontSize: 10,
              color: V2.c.cobalt, letterSpacing: 1, fontWeight: 600,
            }}>+ 现在添加</div>
          </button>
        ) : (
          students.map(s => (
            <div key={s.id} style={{
              padding: '14px 0',
              borderTop: `1px solid ${V2.c.lineSoft}`,
            }}>
              <div style={{ fontFamily: V2.font.cn, fontSize: 16, fontWeight: 700 }}>{s.name}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.level_chinese && <SmallTag subject="chinese" label={`中 · ${s.level_chinese}`}/>}
                {s.level_math && <SmallTag subject="math" label={`数 · ${s.level_math}`}/>}
                {s.level_english && <SmallTag subject="english" label={`英 · ${s.level_english}`}/>}
                {s.level_french && <SmallTag subject="french" label={`法 · ${s.level_french}`}/>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sign out */}
      <div style={{ padding: '20px 22px', borderTop: `1px solid ${V2.c.line}` }}>
        <button onClick={onSignOut} style={{
          width: '100%', padding: '14px',
          background: 'transparent', border: `1px solid ${V2.c.line}`, cursor: 'pointer',
          fontFamily: V2.font.cn, fontSize: 13, color: V2.c.muted,
        }}>退出登录</button>
      </div>
    </div>
  );
}

function SmallTag({ subject, label }) {
  const c = {
    chinese: V2.c.chinese, math: V2.c.math,
    english: V2.c.english, french: V2.c.french,
  }[subject] || V2.c.ink;
  return (
    <span style={{
      fontFamily: V2.font.cn, fontSize: 10.5, fontWeight: 600,
      padding: '3px 7px',
      background: c + '18', color: c,
      border: `0.5px solid ${c}33`,
    }}>{label}</span>
  );
}

// ─── Add student form ───────────────────────────────────────
function V3AddStudent({ onSaved, onBack }) {
  const [name, setName] = uLiveState('');
  const [lc, setLc]   = uLiveState('');
  const [lm, setLm]   = uLiveState('');
  const [le, setLe]   = uLiveState('');
  const [lf, setLf]   = uLiveState('');
  const [busy, setBusy] = uLiveState(false);
  const [err, setErr]   = uLiveState(null);

  const save = async () => {
    setErr(null);
    if (!name.trim()) { setErr('请填写孩子姓名'); return; }
    setBusy(true);
    try {
      await window.LumenData.addStudent({
        name: name.trim(),
        levelChinese: lc || null,
        levelMath:    lm || null,
        levelEnglish: le || null,
        levelFrench:  lf || null,
      });
      onSaved();
    } catch (e) {
      setErr(e.message || '保存失败');
    } finally { setBusy(false); }
  };

  const PickRow = ({ label, value, onChange, options }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
        letterSpacing: 1.5, marginBottom: 6,
      }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(value === o ? '' : o)} style={{
            padding: '8px 12px',
            background: value === o ? V2.c.ink : 'transparent',
            color:      value === o ? V2.c.paper : V2.c.ink,
            border: `1px solid ${value === o ? V2.c.ink : V2.c.line}`,
            cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>{o}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: V2.c.paper, minHeight: '100%' }}>
      <div style={{
        padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${V2.c.line}`,
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted, letterSpacing: 1, padding: 0,
        }}>← 返回</button>
        <span style={{
          marginLeft: 'auto', fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          letterSpacing: 1.5,
        }}>添加孩子档案</span>
      </div>

      <div style={{ padding: '24px 22px' }}>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 24, fontWeight: 800,
          letterSpacing: -0.5, marginBottom: 6,
        }}>给孩子建一个档案</div>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 13, color: V2.c.inkSoft,
          lineHeight: 1.5, marginBottom: 24,
        }}>
          填了几科算几科，没测过的级别可以先空着。<br/>
          后续报名时，老师会做一次入学测评再确认。
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
            letterSpacing: 1.5, marginBottom: 6,
          }}>姓名</div>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="例如 林小曜"
            style={{
              width: '100%', padding: '10px 0',
              border: 'none', borderBottom: `1.5px solid ${V2.c.ink}`,
              background: 'transparent',
              fontFamily: V2.font.sans, fontSize: 18, color: V2.c.ink,
              outline: 'none',
            }}/>
        </div>

        <PickRow label="中文 · HSK" value={lc} onChange={setLc}
          options={['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5']}/>
        <PickRow label="数学 · 袋鼠国际" value={lm} onChange={setLm}
          options={['Koala', 'Wallaby', 'Kangaroo', 'Cadet']}/>
        <PickRow label="英语 · 剑桥" value={le} onChange={setLe}
          options={['Starters', 'Movers', 'Flyers', 'KET', 'PET']}/>
        <PickRow label="法语 · 欧标" value={lf} onChange={setLf}
          options={['A1', 'A2', 'B1', 'B2']}/>

        {err && (
          <div style={{
            marginTop: 8, padding: '10px 12px',
            background: V2.c.coralLight, color: V2.c.coral,
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>{err}</div>
        )}

        <button onClick={save} disabled={busy} style={{
          marginTop: 20, width: '100%', padding: '16px',
          background: busy ? V2.c.muted : V2.c.ink,
          color: V2.c.paper, border: 'none', cursor: busy ? 'wait' : 'pointer',
          fontFamily: V2.font.cn, fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
        }}>{busy ? '保存中…' : '保存档案 →'}</button>
      </div>
    </div>
  );
}

Object.assign(window, { V3LiveHome, V3AddStudent });
