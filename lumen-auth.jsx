// Lumen — 真实登录界面
// 用 Supabase Magic Link OTP（邮箱验证码）
// 替换原来假的 doLogin()

const { useState: uAuthState, useEffect: uAuthEffect } = React;

// ────────────────────────────────────────────────────────────
// LOGIN SCREEN — 邮箱 + 6位验证码
// ────────────────────────────────────────────────────────────
function V3LoginScreen({ onLoginSuccess, onBack }) {
  const [step, setStep] = uAuthState('email'); // 'email' | 'otp' | 'loading' | 'error'
  const [email, setEmail] = uAuthState('');
  const [otp, setOtp] = uAuthState('');
  const [errorMsg, setErrorMsg] = uAuthState('');
  const [countdown, setCountdown] = uAuthState(0);

  // 倒计时
  uAuthEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // 发送验证码
  async function handleSendOTP() {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('请输入有效的邮箱地址');
      return;
    }
    setErrorMsg('');
    setStep('loading');
    try {
      await LumenAuth.sendOTP(email.trim().toLowerCase());
      setStep('otp');
      setCountdown(60);
    } catch (e) {
      setErrorMsg('发送失败，请检查邮箱地址后重试');
      setStep('email');
    }
  }

  // 验证OTP
  async function handleVerifyOTP() {
    if (otp.length < 6) {
      setErrorMsg('请输入6位验证码');
      return;
    }
    setErrorMsg('');
    setStep('loading');
    try {
      const user = await LumenAuth.verifyOTP(email.trim().toLowerCase(), otp.trim());
      onLoginSuccess(user);
    } catch (e) {
      setErrorMsg('验证码错误或已过期，请重新发送');
      setStep('otp');
    }
  }

  // 重新发送
  async function handleResend() {
    if (countdown > 0) return;
    setOtp('');
    setErrorMsg('');
    try {
      await LumenAuth.sendOTP(email.trim().toLowerCase());
      setCountdown(60);
    } catch (e) {
      setErrorMsg('发送失败，请稍后重试');
    }
  }

  return (
    <div style={{ background: V2.c.paper, minHeight: '100%' }}>
      {/* 顶部导航 */}
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
          登录 · LOGIN
        </span>
      </div>

      <div style={{ padding: '28px 22px 60px' }}>
        {/* 标题 */}
        <div style={{
          fontFamily: V2.font.mono, fontSize: 9.5, color: V2.c.cobalt,
          letterSpacing: 2, fontWeight: 700, marginBottom: 8,
        }}>· LUMEN · PARIS</div>
        <h1 style={{
          margin: '0 0 6px', fontFamily: V2.font.cn, fontSize: 24, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>
          {step === 'otp' ? '输入验证码' : '登录 · 查看档案'}
        </h1>
        <p style={{
          margin: '0 0 28px', fontFamily: V2.font.cn, fontSize: 13,
          color: V2.c.inkSoft, lineHeight: 1.65,
        }}>
          {step === 'otp'
            ? `验证码已发送至 ${email}，请在10分钟内输入。`
            : '输入注册邮箱，我们会发送一个6位验证码。'}
        </p>

        {/* ── STEP 1：输入邮箱 ── */}
        {(step === 'email' || step === 'loading') && (
          <>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: 1.5, marginBottom: 6,
            }}>邮箱 · EMAIL</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
              placeholder="exemple@email.com"
              autoFocus
              style={{
                width: '100%', padding: '14px', boxSizing: 'border-box',
                background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
                fontFamily: V2.font.cn, fontSize: 15, fontWeight: 500,
                outline: 'none', marginBottom: 12,
              }}
            />
            {errorMsg && (
              <div style={{
                fontFamily: V2.font.cn, fontSize: 12, color: V2.c.coral,
                marginBottom: 12, padding: '8px 10px',
                background: V2.c.coralLight,
              }}>{errorMsg}</div>
            )}
            <button
              onClick={handleSendOTP}
              disabled={step === 'loading'}
              style={{
                width: '100%', padding: '14px',
                background: step === 'loading' ? V2.c.muted : V2.c.ink,
                color: V2.c.paper, border: 'none', cursor: step === 'loading' ? 'not-allowed' : 'pointer',
                fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              {step === 'loading' ? '发送中……' : '发送验证码 →'}
            </button>
          </>
        )}

        {/* ── STEP 2：输入验证码 ── */}
        {step === 'otp' && (
          <>
            <div style={{
              fontFamily: V2.font.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: 1.5, marginBottom: 6,
            }}>验证码 · CODE</div>
            <input
              type="number"
              value={otp}
              onChange={e => setOtp(e.target.value.slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
              placeholder="000000"
              autoFocus
              style={{
                width: '100%', padding: '14px', boxSizing: 'border-box',
                background: V2.c.paper, border: `1px solid ${V2.c.ink}`,
                fontFamily: V2.font.mono, fontSize: 28, fontWeight: 700,
                letterSpacing: 8, outline: 'none', marginBottom: 12,
                textAlign: 'center',
              }}
            />
            {errorMsg && (
              <div style={{
                fontFamily: V2.font.cn, fontSize: 12, color: V2.c.coral,
                marginBottom: 12, padding: '8px 10px',
                background: V2.c.coralLight,
              }}>{errorMsg}</div>
            )}
            <button
              onClick={handleVerifyOTP}
              style={{
                width: '100%', padding: '14px',
                background: V2.c.ink, color: V2.c.paper,
                border: 'none', cursor: 'pointer',
                fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700,
              }}
            >
              确认登录 →
            </button>

            {/* 重新发送 */}
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              style={{
                marginTop: 12, width: '100%', padding: '11px',
                background: 'transparent', border: `1px solid ${V2.c.line}`,
                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                fontFamily: V2.font.cn, fontSize: 12,
                color: countdown > 0 ? V2.c.muted : V2.c.ink,
              }}
            >
              {countdown > 0 ? `重新发送（${countdown}s）` : '重新发送验证码'}
            </button>

            {/* 修改邮箱 */}
            <button
              onClick={() => { setStep('email'); setOtp(''); setErrorMsg(''); }}
              style={{
                marginTop: 8, width: '100%', padding: '8px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: V2.font.cn, fontSize: 11, color: V2.c.muted,
              }}
            >
              修改邮箱地址
            </button>
          </>
        )}

        {/* 说明文字 */}
        <div style={{
          marginTop: 32, paddingTop: 20,
          borderTop: `1px solid ${V2.c.lineSoft}`,
          fontFamily: V2.font.mono, fontSize: 9, color: V2.c.muted,
          letterSpacing: 1, lineHeight: 1.8,
        }}>
          · 仅限已在 Lumen 注册的家庭<br/>
          · 验证码10分钟内有效<br/>
          · 如有问题请联系 contact@lumenfrance.com
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// AUTH GATE — 包裹整个 App，自动检测登录状态
// ────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = uAuthState(null);
  const [loading, setLoading] = uAuthState(true);

  uAuthEffect(() => {
    // 检查是否已登录
    LumenAuth.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });

    // 监听登录状态变化
    const { data: { subscription } } = LumenAuth.onAuthStateChange((event, u) => {
      setUser(u);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

Object.assign(window, { V3LoginScreen, useAuth });
