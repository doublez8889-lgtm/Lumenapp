// Lumen App — 新生引导 (Stage A / B / C)
//
// Stage A: 刚注册，还没登记孩子 → 入学登记表
// Stage B: 已登记孩子，等第一节课 → "第一节课贴士" + 简化首页
// Stage C: 已上过课 → 完整首页（默认走原 V3LiveHome）

const { useState: uOnState } = React;

// ── Stage A: 入学登记 ──────────────────────────────────────────
function OnboardingStageA({ user, onSubmitted }) {
  const [name, setName]   = uOnState('');
  const [age, setAge]     = uOnState('');
  const [school, setSchool] = uOnState('');
  const [interest, setInterest] = uOnState({ chinese: false, math: false, english: false, french: false });
  const [submitting, setSubmitting] = uOnState(false);

  const toggle = (k) => setInterest(s => ({ ...s, [k]: !s[k] }));
  const valid = name.trim().length > 0 && age.trim().length > 0;

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    // TODO: 实际调用 supabase；现在仅本地存
    try {
      const data = {
        name: name.trim(),
        age: age.trim(),
        school: school.trim(),
        interest: Object.keys(interest).filter(k => interest[k]),
        submittedAt: new Date().toISOString(),
        userId: user?.id,
      };
      localStorage.setItem('lumen_onboarding_submitted', JSON.stringify(data));
    } catch (e) {}
    setSubmitting(false);
    onSubmitted?.();
  };

  const sx = stageStyle();

  return (
    <div style={sx.scroll}>
      {/* Hero */}
      <section style={sx.heroA}>
        <div style={sx.eyebrow}>STAGE 01 · 入学登记</div>
        <h1 style={sx.heroH1}>欢迎来到 Lumen</h1>
        <p style={sx.heroP}>
          填一份简短的孩子信息，我们的<strong style={{ color: V2.c.ink }}>学习顾问</strong>会在 1-2 个工作日联系你，
          安排一次<strong style={{ color: V2.c.ink }}>免费试听 / 入学诊断</strong>。
        </p>
      </section>

      {/* Form */}
      <section style={sx.formCard}>
        <Field label="孩子姓名" required>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：林小曜" style={sx.input}/>
        </Field>

        <Field label="年龄" required>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="6-15 岁" style={sx.input}/>
        </Field>

        <Field label="目前在读学校（选填）">
          <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="如：法国 EPL · CP3" style={sx.input}/>
        </Field>

        <Field label="感兴趣的科目（多选）">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {[
              { id: 'chinese', label: '中文' },
              { id: 'math',    label: '数学' },
              { id: 'english', label: '英语' },
              { id: 'french',  label: '法语' },
            ].map(s => {
              const on = interest[s.id];
              return (
                <button key={s.id} onClick={() => toggle(s.id)} style={{
                  padding: '10px 18px',
                  border: `1.5px solid ${on ? V2.c.ink : V2.c.line}`,
                  background: on ? V2.c.ink : V2.c.paper,
                  color: on ? V2.c.paper : V2.c.inkSoft,
                  fontFamily: V2.font.cn, fontSize: 13, fontWeight: 600,
                  borderRadius: 999,
                  cursor: 'pointer',
                }}>{s.label}</button>
              );
            })}
          </div>
        </Field>
      </section>

      {/* Submit */}
      <div style={{ padding: '0 22px 32px' }}>
        <button
          disabled={!valid || submitting}
          onClick={submit}
          style={{
            width: '100%',
            border: 'none',
            background: valid ? V2.c.ink : V2.c.line,
            color: V2.c.paper,
            padding: '16px',
            fontFamily: V2.font.cn,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.5,
            borderRadius: 6,
            cursor: valid ? 'pointer' : 'not-allowed',
            opacity: submitting ? 0.6 : 1,
          }}
        >{submitting ? '提交中…' : '提交登记'}</button>

        <div style={{ marginTop: 16, fontSize: 11, color: V2.c.muted, lineHeight: 1.6, textAlign: 'center' }}>
          提交后请留意微信 / 邮件，<br/>
          顾问会在 1-2 个工作日内联系你
        </div>
      </div>
    </div>
  );
}

// ── Stage B: 等第一节课 ─────────────────────────────────────────
function OnboardingStageB({ studentName = '小曜', onComplete }) {
  const sx = stageStyle();

  return (
    <div style={sx.scroll}>
      {/* Welcome banner */}
      <section style={sx.heroB}>
        <div style={sx.eyebrow}>STAGE 02 · 已入学</div>
        <h1 style={sx.heroH1}>{studentName} 的第一节课</h1>
        <p style={sx.heroP}>
          你已成功为孩子完成入学登记，下方是<strong style={{ color: V2.c.ink }}>第一次上课</strong>需要知道的所有事。
          上完第一节课后，这里会变成本周课表 + 老师反馈。
        </p>
      </section>

      {/* First-class checklist */}
      <section style={sx.checklist}>
        <div style={sx.checklistTitle}>开课前 · 准备清单</div>

        <ChecklistItem
          n="01"
          title="时间"
          body="本周六 09:30 · 第一节课为入学诊断（约 90 分钟）"
        />
        <ChecklistItem
          n="02"
          title="地址"
          body="Lumen 中心 · 巴黎 13 区 · A 教室。门口有 Lumen 标识，从地铁 7 号线 Tolbiac 站步行 6 分钟。"
        />
        <ChecklistItem
          n="03"
          title="带什么"
          body="文具 · 水杯 · 一份目前在校最近的成绩单或作业本（有助于老师快速了解孩子）"
        />
        <ChecklistItem
          n="04"
          title="家长可以做什么"
          body="第一节课家长可在大厅旁听前 10 分钟。课后老师会在 App 里发本节课反馈，建议留 15 分钟阅读。"
        />
        <ChecklistItem
          n="05"
          title="如有问题"
          body="本周内顾问会主动联系你；如需提前沟通，点击下方按钮。"
          last
        />
      </section>

      {/* Footer CTA */}
      <div style={{ padding: '0 22px 32px' }}>
        <button onClick={onComplete} style={{
          width: '100%', border: 'none',
          background: V2.c.ink, color: V2.c.paper,
          padding: '14px', fontFamily: V2.font.cn,
          fontSize: 14, fontWeight: 700, borderRadius: 6, cursor: 'pointer',
          marginBottom: 10,
        }}>首课已结束 · 进入完整 App</button>
        <button style={{
          width: '100%', border: `1.5px solid ${V2.c.ink}`,
          background: V2.c.paper, color: V2.c.ink,
          padding: '14px', fontFamily: V2.font.cn,
          fontSize: 14, fontWeight: 700, borderRadius: 6, cursor: 'pointer',
        }}>联系顾问</button>

        <div style={{ marginTop: 12, fontSize: 11, color: V2.c.muted, textAlign: 'center', lineHeight: 1.6 }}>
          {studentName} 的 Progress File 将在第一节课后启用
        </div>
      </div>
    </div>
  );
}

// ── 通用小组件 ────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block',
        fontFamily: V2.font.mono, fontSize: 9, letterSpacing: 1.5,
        color: V2.c.muted, textTransform: 'uppercase', marginBottom: 8,
      }}>
        {label}{required && <span style={{ color: '#C04A2B', marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ChecklistItem({ n, title, body, last }) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '16px 0',
      borderBottom: last ? 'none' : `1px solid ${V2.c.line}`,
    }}>
      <div style={{
        fontFamily: V2.font.mono, fontSize: 11, color: V2.c.muted,
        letterSpacing: 1, paddingTop: 2,
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 14, fontWeight: 700,
          color: V2.c.ink, marginBottom: 4,
        }}>{title}</div>
        <div style={{
          fontFamily: V2.font.cn, fontSize: 13, color: V2.c.inkSoft, lineHeight: 1.6,
        }}>{body}</div>
      </div>
    </div>
  );
}

// ── 共用样式 ──────────────────────────────────────────────────
function stageStyle() {
  return {
    scroll: {
      maxHeight: 'calc(100vh - 60px)',
      overflowY: 'auto',
      paddingBottom: 24,
    },
    heroA: {
      padding: '32px 22px 28px',
      borderBottom: `1px solid ${V2.c.line}`,
    },
    heroB: {
      padding: '32px 22px 28px',
      background: '#F8F4EE',
      borderBottom: `1px solid ${V2.c.line}`,
    },
    eyebrow: {
      fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 2,
      color: V2.c.muted, textTransform: 'uppercase',
    },
    heroH1: {
      margin: '8px 0 12px',
      fontFamily: V2.font.display,
      fontSize: 32,
      letterSpacing: -0.6,
      color: V2.c.ink,
      fontWeight: 800,
    },
    heroP: {
      margin: 0,
      fontFamily: V2.font.cn,
      fontSize: 14,
      color: V2.c.inkSoft,
      lineHeight: 1.7,
    },
    formCard: {
      padding: '24px 22px 8px',
    },
    input: {
      width: '100%',
      border: `1px solid ${V2.c.line}`,
      background: V2.c.paper,
      padding: '12px 14px',
      fontFamily: 'inherit',
      fontSize: 14,
      color: V2.c.ink,
      borderRadius: 4,
      outline: 'none',
      marginTop: 6,
    },
    checklist: {
      margin: '20px 22px',
      padding: '8px 18px',
      background: V2.c.paper,
      border: `1px solid ${V2.c.line}`,
      borderRadius: 6,
    },
    checklistTitle: {
      padding: '14px 0 10px',
      fontFamily: V2.font.mono, fontSize: 10, letterSpacing: 1.5,
      color: V2.c.muted, textTransform: 'uppercase',
      borderBottom: `1px solid ${V2.c.line}`,
    },
  };
}

// expose
window.OnboardingStageA = OnboardingStageA;
window.OnboardingStageB = OnboardingStageB;
