// Lumen v3 — Main app controller + detail screens

const { useState: u3aState } = React;

// ────────────────────────────────────────────────────────────
// LESSON DETAIL — opened from home or schedule
// ────────────────────────────────────────────────────────────
function V3LessonDetail({ lesson, onBack, onRequest }) {
  return (
    <div style={{ background: V2.c.paper, minHeight: '100%' }}>
      {/* Back nav */}
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
          课程详情
        </span>
      </div>

      <div style={{ padding: '20px 22px 60px' }}>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <V2Tag subject={lesson.subject} size="sm"/>
          {lesson.adjusted && (
            <span style={{
              fontFamily: V2.font.mono, fontSize: 8, color: V2.c.coral,
              background: V2.c.coralLight, padding: '2px 5px', letterSpacing: 0.5, fontWeight: 600,
            }}>调课</span>
          )}
        </div>
        <h1 style={{
          margin: 0, fontFamily: V2.font.cn, fontSize: 26, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>{lesson.title}</h1>

        {/* Meta block */}
        <div style={{
          marginTop: 22, padding: '16px 0',
          borderTop: `1px solid ${V2.c.ink}`, borderBottom: `1px solid ${V2.c.ink}`,
        }}>
          <V3DetailRow label="时间" value={`${lesson.dayCN} ${lesson.date} · ${lesson.time}`}/>
          <V3DetailRow label="时长" value={`${lesson.dur} 分钟`}/>
          <V3DetailRow label="教师" value={lesson.teacher}/>
          <V3DetailRow label="形式" value={lesson.mode} last/>
        </div>

        {/* Class plan */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, marginBottom: 10,
          }}>本节大纲</div>
          <div style={{ fontFamily: V2.font.cn, fontSize: 14, lineHeight: 1.7, color: V2.c.inkSoft }}>
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              <li>课前回顾：上节课的关键词复盘（10 min）</li>
              <li>新知讲解：本节主题与方法（25 min）</li>
              <li>互动练习：师生问答 + 即时反馈（15 min）</li>
              <li>课后任务：本周巩固清单（10 min）</li>
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 28, display: 'flex', gap: 8 }}>
          <button onClick={() => onRequest && onRequest('leave', {
            studentName: lesson.student || '小宇',
            lessonTitle: lesson.title,
            lessonDate: `${lesson.dayCN || ''} ${lesson.date || ''} ${lesson.time || ''}`.trim(),
          })} style={{
            flex: 1, padding: '12px',
            background: V2.c.paper, color: V2.c.ink,
            border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>请假</button>
          <button onClick={() => onRequest && onRequest('reschedule', {
            studentName: lesson.student || '小宇',
            lessonTitle: lesson.title,
            lessonDate: `${lesson.dayCN || ''} ${lesson.date || ''} ${lesson.time || ''}`.trim(),
          })} style={{
            flex: 1, padding: '12px',
            background: V2.c.paper, color: V2.c.ink,
            border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>申请调课</button>
        </div>
      </div>
    </div>
  );
}

function V3DetailRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${V2.c.lineSoft}`,
    }}>
      <span style={{ fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted, letterSpacing: 1 }}>{label.toUpperCase()}</span>
      <span style={{ fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// FEEDBACK DETAIL — full classroom slice
// ────────────────────────────────────────────────────────────
function V3FeedbackDetail({ fb, onBack }) {
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
          课堂切片
        </span>
      </div>

      <div style={{ padding: '20px 22px 60px' }}>
        <div style={{ marginBottom: 8 }}>
          <V2Tag subject={fb.subject} size="sm"/>
        </div>
        <div style={{
          fontFamily: V2.font.mono, fontSize: 10, color: V2.c.muted,
          letterSpacing: 1.5, marginBottom: 4,
        }}>
          {fb.date} · {fb.teacher} 记录
        </div>
        <h1 style={{
          margin: 0, fontFamily: V2.font.cn, fontSize: 24, fontWeight: 800,
          letterSpacing: -0.5, lineHeight: 1.25,
        }}>课堂瞬间 · 第 47 帧</h1>

        {/* Pull quote */}
        <div style={{
          marginTop: 24, padding: '24px 20px',
          background: V2.c.ink, color: V2.c.paper,
        }}>
          <div style={{
            fontFamily: V2.font.poster, fontSize: 56, fontWeight: 900,
            lineHeight: 0.6, color: V2.c.butter, opacity: 0.6, marginBottom: 4,
          }}>"</div>
          <div style={{
            fontFamily: V2.font.cn, fontSize: 17, fontWeight: 500,
            lineHeight: 1.55, letterSpacing: -0.2,
          }}>{fb.text}</div>
        </div>

        {/* Tags */}
        <div style={{ marginTop: 18 }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, marginBottom: 10,
          }}>能力标签</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fb.tags.map(t => (
              <span key={t} style={{
                fontFamily: V2.font.cn, fontSize: 11, fontWeight: 700,
                padding: '5px 10px', background: V2.c.cobaltLight, color: V2.c.cobalt,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Teacher's full note */}
        <div style={{ marginTop: 28 }}>
          <div style={{
            fontFamily: V2.font.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, marginBottom: 10,
          }}>下节重点</div>
          <div style={{
            fontFamily: V2.font.cn, fontSize: 13.5, lineHeight: 1.7,
            color: V2.c.inkSoft,
            padding: '14px 16px', background: V2.c.cream,
          }}>
            建议利用本周晚自习再读一遍《示儿》，把"家祭无忘告乃翁"的"翁"字与现代汉语中的称呼联系起来，
            为下周《十一月四日风雨大作》做铺垫。
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 28, display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, padding: '12px',
            background: V2.c.ink, color: V2.c.paper,
            border: 'none', cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>查看全部切片</button>
          <button style={{
            padding: '12px 14px',
            background: V2.c.paper, color: V2.c.ink,
            border: `1px solid ${V2.c.ink}`, cursor: 'pointer',
            fontFamily: V2.font.cn, fontSize: 12, fontWeight: 600,
          }}>分享给家人</button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN APP — controller
// ────────────────────────────────────────────────────────────
function LumenV3App() {
  // Demo mode bypass — set by AuthScreen's "演示模式" button
  const demoMode = (() => {
    try { return localStorage.getItem('lumen_demo_mode') === '1'; } catch { return false; }
  })();
  const demoAccount = (() => {
    try { return localStorage.getItem('lumen_demo_account') || 'parent'; } catch { return 'parent'; }
  })();

  const [accountId, setAccountId] = u3aState(demoMode ? demoAccount : 'guest');
  const [tab, setTab] = u3aState('home');
  const [view, setView] = u3aState({ kind: 'tab' });
  const [authedUser, setAuthedUser] = u3aState(null);

  // Onboarding stage override (for demo / Tweaks)
  // null = auto detect; 'A' / 'B' / 'C' = forced stage
  const [onboardingStage, setOnboardingStage] = u3aState(() => {
    try { return localStorage.getItem('lumen_onboarding_stage') || null; } catch { return null; }
  });
  const setStageAndPersist = (s) => {
    setOnboardingStage(s);
    try {
      if (s) localStorage.setItem('lumen_onboarding_stage', s);
      else localStorage.removeItem('lumen_onboarding_stage');
    } catch {}
  };
  // expose for Tweaks panel
  React.useEffect(() => {
    window.__lumenSetStage = setStageAndPersist;
    window.__lumenGetStage = () => onboardingStage;
  }, [onboardingStage]);

  // Listen for Supabase auth state on mount (skip in demo mode)
  React.useEffect(() => {
    if (demoMode) return; // demo mode — no DB connection
    let unsub;
    (async () => {
      const u = await window.LumenData.authGetUser();
      if (u) {
        setAuthedUser(u);
        setAccountId('me');
      }
      unsub = window.LumenData.authOnChange((user) => {
        setAuthedUser(user);
        if (!user) setAccountId('guest');
      }).data?.subscription;
    })();
    return () => { try { unsub?.unsubscribe(); } catch {} };
  }, []);

  const isGuest = accountId === 'guest';
  const goTab = (t) => { setTab(t); setView({ kind: 'tab' }); };
  const openLesson = (l) => setView({ kind: 'lesson', data: l });
  const openFeedback = (f) => setView({ kind: 'feedback', data: f });
  const openAssessment = () => setView({ kind: 'assessment' });
  const back = () => setView({ kind: 'tab' });
  const goLogin = () => setView({ kind: 'auth' });
  const onAuthSuccess = (user) => {
    setAuthedUser(user);
    setAccountId('me');
    setView({ kind: 'tab' });
    setTab('home');
  };
  const doSignOut = async () => {
    try {
      localStorage.removeItem('lumen_demo_mode');
      localStorage.removeItem('lumen_demo_account');
    } catch {}
    if (!demoMode) {
      await window.LumenData.authSignOut();
    }
    setAuthedUser(null);
    setAccountId('guest');
    setTab('home');
  };

  // ── 通知 / 请假 调课 接入 ─────────────────────────
  if (window.LumenStore) LumenStore.useLumenStore();
  const unread = window.LumenStore ? LumenStore.unreadCount('parent') : 0;
  const openNotifications = () => setView({ kind: 'notifications' });
  const openRequest = (defaultType = 'leave', prefill = {}) =>
    setView({ kind: 'request', data: { defaultType, prefill } });

  const topBarProps = {
    activeId: accountId,
    onChangeAccount: setAccountId,
    onOpenNotifications: openNotifications,
    unreadCount: unread,
  };

  let body;
  if (view.kind === 'notifications') {
    const Screen = window.NotificationsScreen;
    body = Screen ? <Screen onBack={back} audience="parent"/> : null;
  } else if (view.kind === 'request') {
    const Screen = window.RequestFormScreen;
    body = Screen ? <Screen onBack={back} {...(view.data || {})}/> : null;
  } else if (view.kind === 'lesson') {
    body = <V3LessonDetail lesson={view.data} onBack={back} onRequest={openRequest}/>;
  } else if (view.kind === 'feedback') {
    body = <V3FeedbackDetail fb={view.data} onBack={back}/>;
  } else if (view.kind === 'assessment') {
    body = <V3AssessmentDetail onBack={back}/>;
  } else if (view.kind === 'addStudent') {
    body = <V3AddStudent onSaved={() => setView({ kind: 'tab' })} onBack={back}/>;
  } else if (view.kind === 'auth') {
    body = <V3AuthScreen onSuccess={onAuthSuccess} onBack={back}/>;
  } else if (accountId === 'me' && authedUser && tab === 'home') {
    // Onboarding stage override
    const stage = onboardingStage;
    const StageA = window.OnboardingStageA;
    const StageB = window.OnboardingStageB;
    if (stage === 'A' && StageA) {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <StageA user={authedUser} onSubmitted={() => setStageAndPersist('B')}/>
        </>
      );
    } else if (stage === 'B' && StageB) {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <StageB studentName="小曜" onComplete={() => setStageAndPersist(null)}/>
        </>
      );
    } else {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <V3LiveHome
            user={authedUser}
            onSignOut={doSignOut}
            onAddStudent={() => setView({ kind: 'addStudent' })}
          />
        </>
      );
    }
  } else if (accountId === 'me' && authedUser) {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <div style={{ fontFamily: V2.font.cn, fontSize: 14, color: V2.c.muted, lineHeight: 1.6 }}>
            此区即将上线<br/>
            目前请回到首页查看你的孩子档案
          </div>
        </div>
      </>
    );
  } else if (isGuest && tab === 'home') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3GuestHome
          onBookAssessment={openAssessment}
          onOpenLogin={goLogin}
          onOpenSchedule={() => goTab('schedule')}
        />
      </>
    );
  } else if (isGuest && tab === 'archive') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3GuestArchive onBookAssessment={openAssessment} onOpenLogin={goLogin}/>
      </>
    );
  } else if (isGuest && tab === 'schedule') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3GuestSchedule onBookAssessment={openAssessment}/>
      </>
    );
  } else if (isGuest && tab === 'me') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3GuestMe onLogin={goLogin}/>
      </>
    );
  } else if (tab === 'home') {
    // Honor stage override even in mock/demo mode
    const stage = onboardingStage;
    const StageA = window.OnboardingStageA;
    const StageB = window.OnboardingStageB;
    if (stage === 'A' && StageA) {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <StageA user={null} onSubmitted={() => setStageAndPersist('B')}/>
        </>
      );
    } else if (stage === 'B' && StageB) {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <StageB studentName="小曜" onComplete={() => setStageAndPersist(null)}/>
        </>
      );
    } else {
      body = (
        <>
          <V3TopBar {...topBarProps}/>
          <V3Home
            accountId={accountId}
            onOpenLesson={openLesson}
            onOpenFeedback={openFeedback}
            onOpenArchive={() => goTab('archive')}
            onOpenSchedule={() => goTab('schedule')}
          />
        </>
      );
    }
  } else if (tab === 'archive') {
    body = <V2ScreenProgress onBack={() => {}}/>;
  } else if (tab === 'schedule') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3Schedule accountId={accountId} onOpenLesson={openLesson}/>
      </>
    );
  } else if (tab === 'me') {
    body = (
      <>
        <V3TopBar {...topBarProps}/>
        <V3Me accountId={accountId}/>
      </>
    );
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: V2.c.paper,
      overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: view.kind === 'tab' ? 130 : 0,
      WebkitOverflowScrolling: 'touch',
    }}>
      {body}
      {view.kind === 'tab' && <V3TabBar active={tab} onChange={goTab}/>}
    </div>
  );
}

Object.assign(window, { LumenV3App, V3LessonDetail, V3FeedbackDetail });
