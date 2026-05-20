// Lumen App — 极简 demo 阶段切换器
// 一个固定在右下角的小按钮，点击循环 C → A → B → C
// 不依赖 TweaksPanel，独立工作

(function () {
  'use strict';

  const STAGES = [
    { key: null, label: 'C · 默认',     hint: '完整首页' },
    { key: 'A',  label: 'A · 入学登记', hint: '新生第 1 步' },
    { key: 'B',  label: 'B · 等开课',   hint: '新生第 2 步' },
  ];

  function StageSwitcher() {
    const [stage, setStage] = React.useState(() => {
      try { return localStorage.getItem('lumen_onboarding_stage') || null; } catch { return null; }
    });
    const [open, setOpen] = React.useState(false);

    const apply = (newStage) => {
      try {
        if (newStage) localStorage.setItem('lumen_onboarding_stage', newStage);
        else localStorage.removeItem('lumen_onboarding_stage');
      } catch {}
      setStage(newStage);
      setOpen(false);
      if (window.__lumenSetStage) window.__lumenSetStage(newStage);
      else window.location.reload();
    };

    const current = STAGES.find(s => s.key === stage) || STAGES[0];

    return (
      <div style={{
        position: 'fixed',
        left: 16,
        top: 16,
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {open && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: 44,
            background: '#1a1614',
            color: '#F4EFE7',
            borderRadius: 12,
            padding: 8,
            minWidth: 200,
            boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              fontSize: 9, letterSpacing: 1.5, opacity: 0.5,
              padding: '8px 10px 4px', textTransform: 'uppercase',
            }}>DEMO · 新生引导阶段</div>
            {STAGES.map(s => {
              const on = s.key === stage;
              return (
                <button key={String(s.key)} onClick={() => apply(s.key)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  border: 'none', background: on ? '#D97757' : 'transparent',
                  color: on ? '#fff' : '#F4EFE7',
                  padding: '10px 10px',
                  fontSize: 13, fontWeight: 600,
                  borderRadius: 8,
                  cursor: 'pointer',
                }}>
                  <div>{s.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{s.hint}</div>
                </button>
              );
            })}
          </div>
        )}
        <button onClick={() => setOpen(o => !o)} style={{
          background: '#1a1614',
          color: '#F4EFE7',
          border: 'none',
          borderRadius: 999,
          padding: '10px 14px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ opacity: 0.6, fontSize: 9, letterSpacing: 1.5 }}>STAGE</span>
          <span>{current.label}</span>
        </button>
      </div>
    );
  }

  function mount() {
    let host = document.getElementById('lumen-stage-switcher');
    if (!host) {
      host = document.createElement('div');
      host.id = 'lumen-stage-switcher';
      document.body.appendChild(host);
    }
    ReactDOM.createRoot(host).render(<StageSwitcher/>);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
