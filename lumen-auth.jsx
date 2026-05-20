// Lumen · Real auth screen (Supabase email OTP)
// Renders inside the v3 shell as a "view" the way other detail screens do.

const { useState: uAuthState, useEffect: uAuthEffect } = React;

function V3AuthScreen({ onSuccess, onBack }) {
  const [step, setStep]   = uAuthState('email');     // 'email' → 'otp'
  const [email, setEmail] = uAuthState('');
  const [otp, setOtp]     = uAuthState('');
  const [busy, setBusy]   = uAuthState(false);
  const [err, setErr]     = uAuthState(null);
  const [info, setInfo]   = uAuthState(null);

  const sendOtp = async () => {
    setErr(null); setInfo(null);
    if (!email || !email.includes('@')) {
      setErr('请输入有效的邮箱'); return;
    }
    setBusy(true);
    try {
      await window.LumenData.authSendOtp(email.trim());
      setStep('otp');
      setInfo('验证码已发送，请查收邮箱（垃圾箱也看一下）');
    } catch (e) {
      setErr(e.message || '发送失败，请稍后重试');
    } finally { setBusy(false); }
  };

  const verifyOtp = async () => {
    setErr(null); setInfo(null);
    if (otp.length < 6) { setErr('请输入完整的 6 位验证码'); return; }
    setBusy(true);
    try {
      const user = await window.LumenData.authVerifyOtp(email.trim(), otp.trim());
      await window.LumenData.ensureFamily(user);
      onSuccess(user);
    } catch (e) {
      setErr(e.message || '验证失败，请检查验证码');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ background: V2.c.paper, minHeight: '100%' }}>
      {/* Top nav */}
      <div style={{
        padding: '14px 22px', display: 'flex', alignItems: 'center',
        gap: 12, borderBottom: `1px solid ${V2.c.line}`,
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted,
          letterSpacing: 1, padding: 0,
        }}>← 返回</button>
        <span style={{
          marginLeft: 'auto',
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          letterSpacing: 1.5,
        }}>SIGN IN · 登录</span>
      </div>

      {/* Hero */}
      <div style={{ padding: '32px 22px 22px' }}>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          letterSpacing: 1.5, marginBottom: 10,
        }}>
          STEP {step === 'email' ? '01' : '02'} / 02
        </div>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 28, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.15,
        }}>
          {step === 'email' ? '用邮箱登录' : '查收验证码'}
        </div>
        <div style={{
          marginTop: 8, fontFamily: V2.font.cn, fontSize: 13,
          color: V2.c.inkSoft, lineHeight: 1.5,
        }}>
          {step === 'email'
            ? '我们会发一个 6 位验证码到你的邮箱，无需密码。'
            : `我们刚刚发了一个验证码到 ${email}`}
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '0 22px 24px' }}>
        {step === 'email' ? (
          <>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
              letterSpacing: 1.5, marginBottom: 6,
            }}>EMAIL</div>
            <input
              type="email"
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendOtp()}
              style={{
                width: '100%',
                padding: '12px 0',
                border: 'none',
                borderBottom: `1.5px solid ${V2.c.ink}`,
                background: 'transparent',
                fontFamily: V2.font.sans, fontSize: 18,
                color: V2.c.ink,
                outline: 'none',
              }}
            />
          </>
        ) : (
          <>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
              letterSpacing: 1.5, marginBottom: 6,
            }}>验证码 · 6 位数字</div>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()}
              style={{
                width: '100%',
                padding: '12px 0',
                border: 'none',
                borderBottom: `1.5px solid ${V2.c.ink}`,
                background: 'transparent',
                fontFamily: V2.font.mono, fontSize: 28, fontWeight: 700,
                letterSpacing: 8, color: V2.c.ink,
                outline: 'none', textAlign: 'center',
              }}
            />
            <button onClick={() => { setStep('email'); setOtp(''); setInfo(null); setErr(null); }}
              style={{
                marginTop: 18, background: 'transparent', border: 'none',
                cursor: 'pointer', padding: 0,
                fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
                letterSpacing: 1, textDecoration: 'underline',
              }}>换个邮箱</button>
          </>
        )}

        {/* Status messages */}
        {err && (
          <div style={{
            marginTop: 16, padding: '10px 12px',
            background: V2.c.coralLight, color: V2.c.coral,
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>{err}</div>
        )}
        {info && !err && (
          <div style={{
            marginTop: 16, padding: '10px 12px',
            background: V2.c.cobaltLight, color: V2.c.cobalt,
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>{info}</div>
        )}

        {/* Submit */}
        <button
          onClick={step === 'email' ? sendOtp : verifyOtp}
          disabled={busy}
          style={{
            marginTop: 28, width: '100%',
            padding: '16px',
            background: busy ? V2.c.muted : V2.c.ink,
            color: V2.c.paper,
            border: 'none', cursor: busy ? 'wait' : 'pointer',
            fontFamily: V2.font.cn, fontSize: 15, fontWeight: 700,
            letterSpacing: 0.5,
          }}>
          {busy ? '处理中…' : (step === 'email' ? '发送验证码' : '验证并登录 →')}
        </button>

        {/* Demo skip — bypass auth to verify app shell while email rate-limited */}
        <button
          onClick={() => {
            try {
              localStorage.setItem('lumen_demo_mode', '1');
              localStorage.setItem('lumen_demo_account', 'parent');
            } catch (e) {}
            window.location.reload();
          }}
          style={{
            marginTop: 14, width: '100%',
            padding: '14px',
            background: 'transparent',
            color: V2.c.ink,
            border: `1px solid ${V2.c.line}`,
            cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 13, fontWeight: 500,
            letterSpacing: 0.3,
          }}>
          演示模式 · 跳过登录 →
        </button>
        <div style={{
          marginTop: 10, fontFamily: V2.font.cn, fontSize: 10.5,
          color: V2.c.muted, lineHeight: 1.6,
        }}>
          使用预置账号「林女士」直接进入 App，<br/>不连接数据库，仅供演示与界面验证。
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '24px 22px', borderTop: `1px solid ${V2.c.line}`,
        fontFamily: V2.font.cn, fontSize: 11, color: V2.c.muted, lineHeight: 1.6,
      }}>
        登录即代表你同意 Lumen 隐私政策。<br/>
        我们不会用你的邮箱发送广告。
      </div>
    </div>
  );
}

Object.assign(window, { V3AuthScreen });
