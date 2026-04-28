// Lumen — App screens (家长端 + 学生端)
// Depends on: lumen-tokens.js, lumen-ui.jsx

const { useState } = React;

// ════════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════════
const STUDENT = {
  name: '林小曜',
  nameLatin: 'Lin Xiaoyao',
  age: 10,
  grade: 'CM2 · 五年级',
  avatar: '林',
  joinedDate: '2024.09',
  currentPlan: '2025–2026 · HSK4 冲刺 + 数学思维提升',
};

const PARENT = {
  name: '林女士',
  greeting: 'Bonsoir',
};

// 五维能力雷达（用于 Ability Map）
const ABILITY_AXES = ['听力理解', '阅读', '表达', '书写', '思维'];
const ABILITY_NOW = [82, 76, 68, 71, 79];
const ABILITY_PREV = [72, 64, 58, 60, 70];

// 课堂切片
const SLICES = [
  { id: 1, date: '04.24', subject: 'chinese', title: '《示儿》古诗精读',
    teacher: '陈老师 · Mme Chen', tags: ['朗读流畅', '理解到位', '需积累'],
    note: '小曜今天对"家祭无忘告乃翁"的情感把握非常细腻，主动联系自己的家人体验。建议本周积累 3 个相关意象词。' },
  { id: 2, date: '04.22', subject: 'math', title: '袋鼠数学 · 几何图形拆解',
    teacher: '王老师 · M. Wang', tags: ['思路清晰', '解法独特'],
    note: '面对七巧板组合题展现出非常好的空间想象力，独立给出了一种课本之外的拼法。' },
  { id: 3, date: '04.19', subject: 'french', title: 'DELF B1 · 口语模拟',
    teacher: 'Mme Laurent', tags: ['语速自然', '需练词汇'],
    note: '语速和语调已接近本地学生水平。在"环境保护"话题上词汇略显单薄，本周补充 15 个相关词。' },
];

// Milestone 里程碑
const MILESTONES = [
  { date: '2026.04', title: 'HSK 三级模拟', score: '278 / 300', note: '阅读单项满分', level: 'gold' },
  { date: '2026.02', title: '袋鼠数学预选', score: '前 15%', note: 'Niveau Écolier', level: 'silver' },
  { date: '2025.11', title: '中文阅读突破', score: 'Lv.4 → Lv.6', note: '可独立读《草房子》', level: 'milestone' },
  { date: '2025.09', title: '入学初评', score: '建立档案', note: '诊断起点', level: 'start' },
];

// 课程表（本周）
const SCHEDULE = [
  { day: '周一', date: 'Lun. 28', items: [
    { time: '17:30', dur: '90min', subject: 'chinese', title: 'HSK 阅读专项', teacher: '陈老师', mode: '线下' },
  ]},
  { day: '周三', date: 'Mer. 30', items: [
    { time: '14:00', dur: '60min', subject: 'math', title: '袋鼠数学 · 第 12 讲', teacher: '王老师', mode: '线下' },
    { time: '16:30', dur: '45min', subject: 'french', title: 'DELF 口语', teacher: 'Mme Laurent', mode: '线上' },
  ]},
  { day: '周六', date: 'Sam. 03', items: [
    { time: '10:00', dur: '90min', subject: 'chinese', title: '阶段复盘', teacher: '陈老师', mode: '线下' },
  ]},
];

// 五步成长闭环
const STEPS = [
  { idx: '01', cn: '诊断评估', fr: 'Évaluation', desc: '多维度初始评估报告', state: 'done' },
  { idx: '02', cn: '定制规划', fr: 'Planification', desc: '一年规划 + 季度调整', state: 'done' },
  { idx: '03', cn: '系统教学', fr: 'Cours', desc: '结构化课程设计', state: 'active' },
  { idx: '04', cn: '过程追踪', fr: 'Suivi', desc: 'Progress File 学习档案', state: 'active' },
  { idx: '05', cn: '阶段复盘', fr: 'Révision', desc: 'Milestone Review', state: 'next' },
];

// ════════════════════════════════════════════════════════════════
// HOME — 家长端 Dashboard
// ════════════════════════════════════════════════════════════════
function ScreenHome({ onOpen }) {
  return (
    <div style={{ background: LC.cream, minHeight: '100%', paddingBottom: 100 }}>
      {/* status-bar offset */}
      <div style={{ height: 54 }}/>

      {/* Greeting header */}
      <div style={{ padding: '8px 22px 16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: LF.serif, fontSize: 13, color: LC.gold, fontStyle: 'italic',
              letterSpacing: 0.6, marginBottom: 2,
            }}>{PARENT.greeting} ·  Bonne soirée</div>
            <h1 style={{
              margin: 0, fontFamily: LF.cn, fontSize: 26, fontWeight: 600,
              color: LC.ink, letterSpacing: 0.3,
            }}>{PARENT.name}，晚上好</h1>
            <p style={{
              margin: '4px 0 0', fontFamily: LF.sans, fontSize: 13,
              color: LC.muted,
            }}>小曜今天有 <b style={{color: LC.ink}}>2</b> 项新进展可以查看</p>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: LC.paper, border: `0.5px solid ${LC.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Icon name="bell" size={18} color={LC.inkSoft}/>
            <span style={{
              position: 'absolute', top: 9, right: 10,
              width: 7, height: 7, borderRadius: '50%', background: LC.terracotta,
              border: `1.5px solid ${LC.paper}`,
            }}/>
          </div>
        </div>
      </div>

      {/* HERO — Student card */}
      <div style={{ padding: '0 16px 20px' }}>
        <div onClick={() => onOpen('progress')} style={{
          background: `linear-gradient(135deg, ${LC.midnight} 0%, #383E54 100%)`,
          borderRadius: 22, padding: 22, color: '#F5EFE6',
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
          boxShadow: '0 16px 30px rgba(44,49,66,0.22)',
        }}>
          {/* decorative gold gradient blob */}
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 180, height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${LC.gold}55 0%, transparent 70%)`,
          }}/>
          <div style={{
            position: 'absolute', bottom: -30, left: -10, width: 80, height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${LC.terracotta}33 0%, transparent 70%)`,
          }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div>
              <div style={{
                fontFamily: LF.serif, fontSize: 12, fontStyle: 'italic',
                color: LC.goldSoft, letterSpacing: 1, textTransform: 'uppercase',
                marginBottom: 6,
              }}>Progress File · 学习档案</div>
              <div style={{
                fontFamily: LF.cn, fontSize: 24, fontWeight: 600, letterSpacing: 0.5,
              }}>{STUDENT.name}</div>
              <div style={{
                fontFamily: LF.sans, fontSize: 12, color: LC.goldSoft,
                marginTop: 2, opacity: 0.85,
              }}>{STUDENT.grade}  ·  {STUDENT.nameLatin}</div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: LC.gold, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: LF.serif, fontSize: 26, fontWeight: 600,
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}>{STUDENT.avatar}</div>
          </div>

          {/* mini stats */}
          <div style={{ display: 'flex', gap: 14, marginTop: 22, position: 'relative' }}>
            {[
              { n: '78', l: '能力综合分', s: '+6' },
              { n: '12', l: '本月课堂切片', s: '+3' },
              { n: '4', l: '里程碑达成', s: '本季度' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  fontFamily: LF.serif, fontSize: 28, fontWeight: 600, lineHeight: 1,
                  color: '#F5EFE6',
                }}>{s.n}</div>
                <div style={{
                  fontFamily: LF.sans, fontSize: 10, color: LC.goldSoft,
                  marginTop: 4, letterSpacing: 0.4,
                }}>{s.l}</div>
                <div style={{
                  fontFamily: LF.sans, fontSize: 10, color: '#9CB892',
                  marginTop: 1,
                }}>↗ {s.s}</div>
              </div>
            ))}
          </div>

          {/* CTA pill */}
          <div style={{
            marginTop: 18, padding: '10px 14px',
            background: 'rgba(255,255,255,0.1)', borderRadius: 12,
            border: '0.5px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative',
          }}>
            <span style={{ fontFamily: LF.sans, fontSize: 12, color: '#F5EFE6' }}>
              查看完整 Progress File
            </span>
            <Icon name="arrow" size={16} color="#F5EFE6"/>
          </div>
        </div>
      </div>

      {/* Today's classes */}
      <div style={{ padding: '0 22px 20px' }}>
        <SectionLabel idx="今日" title="今日课程" action="查看课表 →"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { time: '17:30', subject: 'chinese', title: 'HSK 阅读专项', teacher: '陈老师', dur: '90 min', status: 'upcoming' },
          ].map((cls, i) => (
            <Card key={i} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, padding: '10px 0', textAlign: 'center',
                  borderRight: `0.5px solid ${LC.line}`,
                }}>
                  <div style={{ fontFamily: LF.serif, fontSize: 18, fontWeight: 600, color: LC.ink, lineHeight: 1 }}>{cls.time}</div>
                  <div style={{ fontFamily: LF.sans, fontSize: 10, color: LC.muted, marginTop: 4, letterSpacing: 0.4 }}>{cls.dur}</div>
                </div>
                <div style={{ flex: 1, paddingLeft: 4 }}>
                  <div style={{ marginBottom: 5 }}>
                    <SubjectChip subject={cls.subject} size="sm"/>
                  </div>
                  <div style={{ fontFamily: LF.cn, fontSize: 15, fontWeight: 600, color: LC.ink }}>{cls.title}</div>
                  <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 2 }}>{cls.teacher} · 线下教室 A</div>
                </div>
                <div style={{
                  padding: '5px 10px', borderRadius: 999,
                  background: LC.goldWash, color: LC.goldDeep,
                  fontFamily: LF.sans, fontSize: 11, fontWeight: 600,
                }}>1h32m 后</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 五步成长闭环 — preview */}
      <div style={{ padding: '0 22px 20px' }}>
        <SectionLabel idx="04" title="成长路径" action="详情 →"/>
        <Card pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s.idx}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: '0 0 auto',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: `1.2px solid ${s.state === 'next' ? LC.line : LC.gold}`,
                    background: s.state === 'done' ? LC.gold : s.state === 'active' ? LC.goldWash : LC.paper,
                    color: s.state === 'done' ? '#FFF' : s.state === 'active' ? LC.goldDeep : LC.muted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: LF.serif, fontSize: 14, fontWeight: 600,
                  }}>{s.state === 'done' ? <Icon name="check" size={16} color="#FFF"/> : s.idx}</div>
                  <div style={{
                    fontFamily: LF.cn, fontSize: 10, color: s.state === 'next' ? LC.muted : LC.ink,
                    fontWeight: 600,
                  }}>{s.cn}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, margin: '0 -2px 22px',
                    background: i < 1 ? LC.gold : i < 3 ? `linear-gradient(to right, ${LC.gold}, ${LC.line})` : LC.line,
                    borderRadius: 1,
                  }}/>
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{
            marginTop: 16, paddingTop: 14, borderTop: `0.5px dashed ${LC.line}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: LC.goldWash,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="leaf" size={16} color={LC.goldDeep}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: LF.cn, fontSize: 12, color: LC.ink, fontWeight: 600 }}>
                下一站 · 季度 Milestone Review
              </div>
              <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 1 }}>
                预计 6 月 · 与陈老师 1 对 1 复盘
              </div>
            </div>
            <Icon name="chevronR" size={16} color={LC.muted}/>
          </div>
        </Card>
      </div>

      {/* Recent class slices preview */}
      <div style={{ padding: '0 22px 20px' }}>
        <SectionLabel idx="最新" title="课堂切片" action="全部 →"/>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -22px', padding: '0 22px' }}>
          {SLICES.map(s => (
            <div key={s.id} style={{
              flex: '0 0 240px', background: LC.paper,
              borderRadius: LR.lg, border: `0.5px solid ${LC.line}`,
              padding: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SubjectChip subject={s.subject} size="sm"/>
                <span style={{ fontFamily: LF.serif, fontSize: 12, color: LC.muted, fontStyle: 'italic' }}>{s.date}</span>
              </div>
              <div style={{ fontFamily: LF.cn, fontSize: 14, fontWeight: 600, color: LC.ink, marginBottom: 6 }}>{s.title}</div>
              <div style={{
                fontFamily: LF.sans, fontSize: 11, color: LC.inkSoft, lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{s.note}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                {s.tags.slice(0, 2).map(t => (
                  <span key={t} style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: LC.paperDeep, color: LC.inkSoft, fontFamily: LF.sans,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PROGRESS FILE — 招牌画面
// ════════════════════════════════════════════════════════════════
function ScreenProgress({ onBack }) {
  const [tab, setTab] = useState('ability');

  return (
    <div style={{ background: LC.cream, minHeight: '100%', paddingBottom: 100 }}>
      {/* hero header */}
      <div style={{
        background: `linear-gradient(180deg, ${LC.paperDeep} 0%, ${LC.cream} 100%)`,
        padding: '54px 22px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, marginBottom: 18 }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: LC.paper, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `0.5px solid ${LC.line}`,
          }}>
            <Icon name="chevronL" size={18} color={LC.ink}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: LF.serif, fontSize: 11, color: LC.gold, fontStyle: 'italic', letterSpacing: 1.2, textTransform: 'uppercase' }}>Progress File</div>
            <div style={{ fontFamily: LF.cn, fontSize: 16, fontWeight: 600, color: LC.ink }}>{STUDENT.name} · 学习档案</div>
          </div>
          <Icon name="settings" size={20} color={LC.muted}/>
        </div>

        {/* Quote */}
        <div style={{
          fontFamily: LF.serif, fontSize: 18, fontStyle: 'italic',
          color: LC.inkSoft, lineHeight: 1.5, letterSpacing: 0.3,
          paddingLeft: 14, borderLeft: `2px solid ${LC.gold}`,
        }}>
          让成长被看见，<br/>让学习有温度。
          <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 6, fontStyle: 'normal', letterSpacing: 0.5 }}>
            — Lumen Advanced Education
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5, background: LC.cream,
        padding: '12px 22px 8px', borderBottom: `0.5px solid ${LC.line}`,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { k: 'ability', l: '能力雷达' },
            { k: 'slices', l: '课堂切片' },
            { k: 'milestones', l: '里程碑' },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex: 1, padding: '8px 10px', border: 'none', cursor: 'pointer',
              borderRadius: 8,
              background: tab === t.k ? LC.ink : 'transparent',
              color: tab === t.k ? LC.cream : LC.inkSoft,
              fontFamily: LF.cn, fontSize: 13, fontWeight: 600,
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      {tab === 'ability' && <AbilityPanel/>}
      {tab === 'slices' && <SlicesPanel/>}
      {tab === 'milestones' && <MilestonesPanel/>}
    </div>
  );
}

function AbilityPanel() {
  return (
    <div style={{ padding: '20px 22px' }}>
      <Card pad={20} raised>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: LF.serif, fontSize: 11, fontStyle: 'italic', color: LC.gold, letterSpacing: 1, textTransform: 'uppercase' }}>Ability Map</div>
          <div style={{ fontFamily: LF.cn, fontSize: 17, fontWeight: 600, color: LC.ink, marginTop: 2 }}>中文 · 五维能力</div>
          <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 4 }}>2026 Q2 vs 2026 Q1</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'absolute' }}>
            {/* prev quarter (lighter) */}
            {(() => {
              const cx = 140, cy = 140, radius = 280 * 0.38;
              const n = 5;
              const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
              const pts = ABILITY_PREV.map((v, i) => {
                const r = (v / 100) * radius;
                return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))].join(',');
              }).join(' ');
              return <polygon points={pts} fill={LC.muted + '22'} stroke={LC.muted} strokeWidth="1" strokeDasharray="3 3"/>;
            })()}
          </svg>
          <RadarChart data={ABILITY_NOW} axes={ABILITY_AXES} size={280} color={LC.gold}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 3, background: LC.gold, borderRadius: 2 }}/>
            <span style={{ fontFamily: LF.sans, fontSize: 11, color: LC.inkSoft }}>本季度</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 0, borderTop: `2px dashed ${LC.muted}` }}/>
            <span style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted }}>上季度</span>
          </div>
        </div>
      </Card>

      {/* Per-axis breakdown */}
      <div style={{ marginTop: 18 }}>
        <SectionLabel title="能力分项"/>
        <Card pad={4}>
          {ABILITY_AXES.map((axis, i) => {
            const now = ABILITY_NOW[i], prev = ABILITY_PREV[i];
            const delta = now - prev;
            return (
              <div key={axis} style={{
                padding: '14px 16px',
                borderBottom: i < ABILITY_AXES.length - 1 ? `0.5px solid ${LC.line}` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: LF.cn, fontSize: 14, fontWeight: 600, color: LC.ink }}>{axis}</span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: LF.serif, fontSize: 18, fontWeight: 600, color: LC.ink }}>{now}</span>
                    <span style={{ fontFamily: LF.sans, fontSize: 11, color: LC.good, fontWeight: 600 }}>↗ +{delta}</span>
                  </span>
                </div>
                <div style={{ position: 'relative', height: 5, background: LC.lineSoft, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${prev}%`, background: LC.muted + '66',
                  }}/>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${now}%`, background: LC.gold,
                  }}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Teacher note */}
      <div style={{ marginTop: 18 }}>
        <Card pad={16} style={{ background: LC.goldWash, border: `0.5px solid ${LC.gold}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Avatar name="陈" size={28} color={LC.goldDeep}/>
            <div>
              <div style={{ fontFamily: LF.cn, fontSize: 12, fontWeight: 600, color: LC.ink }}>陈老师 · 阶段评语</div>
              <div style={{ fontFamily: LF.sans, fontSize: 10, color: LC.muted }}>2026.04.20</div>
            </div>
          </div>
          <p style={{
            margin: 0, fontFamily: LF.cn, fontSize: 13, lineHeight: 1.7,
            color: LC.inkSoft, letterSpacing: 0.2,
          }}>
            小曜本季度在<b style={{color: LC.ink}}>阅读理解</b>上跨越明显，从依赖注音到能独立读完《草房子》一章。建议下季度在 <b style={{color: LC.ink}}>"表达"</b> 环节增加复述训练。
          </p>
        </Card>
      </div>
    </div>
  );
}

function SlicesPanel() {
  return (
    <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {SLICES.map(s => (
        <Card key={s.id} pad={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <SubjectChip subject={s.subject} size="sm"/>
              <div style={{ fontFamily: LF.cn, fontSize: 16, fontWeight: 600, color: LC.ink, marginTop: 8 }}>{s.title}</div>
              <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 2 }}>{s.teacher}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: LF.serif, fontSize: 22, fontWeight: 600, color: LC.ink, lineHeight: 1 }}>{s.date.split('.')[1]}</div>
              <div style={{ fontFamily: LF.serif, fontSize: 10, color: LC.muted, fontStyle: 'italic', letterSpacing: 0.5 }}>{s.date.split('.')[0]} · 04月</div>
            </div>
          </div>
          <p style={{
            margin: '4px 0 12px', fontFamily: LF.cn, fontSize: 13, lineHeight: 1.65,
            color: LC.inkSoft, padding: 12, background: LC.cream, borderRadius: 10,
            borderLeft: `2px solid ${LC.gold}`,
          }}>{s.note}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {s.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '4px 9px', borderRadius: 999,
                background: LC.paperDeep, color: LC.inkSoft, fontFamily: LF.cn,
                border: `0.5px solid ${LC.line}`,
              }}>{t}</span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function MilestonesPanel() {
  const colors = { gold: LC.gold, silver: LC.midnightSoft, milestone: LC.terracotta, start: LC.muted };
  return (
    <div style={{ padding: '16px 22px' }}>
      <div style={{ position: 'relative', paddingLeft: 8 }}>
        {/* timeline line */}
        <div style={{
          position: 'absolute', left: 22, top: 8, bottom: 8,
          width: 1, background: LC.line,
        }}/>

        {MILESTONES.map((m, i) => (
          <div key={i} style={{ position: 'relative', paddingLeft: 50, paddingBottom: 22 }}>
            <div style={{
              position: 'absolute', left: 7, top: 8,
              width: 30, height: 30, borderRadius: '50%',
              background: LC.paper, border: `1.5px solid ${colors[m.level]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 4px ${LC.cream}`,
            }}>
              {m.level === 'gold' ? <Icon name="award" size={14} color={colors[m.level]}/> :
               m.level === 'milestone' ? <Icon name="flag" size={14} color={colors[m.level]}/> :
               m.level === 'start' ? <Icon name="leaf" size={14} color={colors[m.level]}/> :
               <Icon name="check" size={14} color={colors[m.level]}/>}
            </div>
            <Card pad={14}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: LF.serif, fontSize: 12, color: LC.gold, fontStyle: 'italic', letterSpacing: 0.5 }}>{m.date}</div>
                <div style={{
                  padding: '2px 8px', borderRadius: 999,
                  background: colors[m.level] + '18', color: colors[m.level],
                  fontFamily: LF.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.4,
                }}>{m.score}</div>
              </div>
              <div style={{ fontFamily: LF.cn, fontSize: 15, fontWeight: 600, color: LC.ink, marginTop: 4 }}>{m.title}</div>
              <div style={{ fontFamily: LF.sans, fontSize: 12, color: LC.muted, marginTop: 2 }}>{m.note}</div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SCHEDULE
// ════════════════════════════════════════════════════════════════
function ScreenSchedule() {
  return (
    <div style={{ background: LC.cream, minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ height: 54 }}/>
      <div style={{ padding: '8px 22px 16px' }}>
        <div style={{ fontFamily: LF.serif, fontSize: 11, color: LC.gold, fontStyle: 'italic', letterSpacing: 1.2, textTransform: 'uppercase' }}>Emploi du temps</div>
        <h1 style={{ margin: '2px 0 0', fontFamily: LF.cn, fontSize: 24, fontWeight: 600, color: LC.ink }}>本周课程表</h1>
        <p style={{ margin: '4px 0 0', fontFamily: LF.sans, fontSize: 12, color: LC.muted }}>04.28 – 05.04 · Semaine 18</p>
      </div>

      <div style={{ padding: '0 22px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SCHEDULE.map(day => (
          <div key={day.day}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: LF.cn, fontSize: 14, fontWeight: 600, color: LC.ink }}>{day.day}</span>
              <span style={{ fontFamily: LF.serif, fontSize: 12, color: LC.muted, fontStyle: 'italic' }}>{day.date}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {day.items.map((it, i) => (
                <Card key={i} pad={14}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 50, textAlign: 'center', borderRight: `0.5px solid ${LC.line}`, paddingRight: 12 }}>
                      <div style={{ fontFamily: LF.serif, fontSize: 17, fontWeight: 600, color: LC.ink, lineHeight: 1 }}>{it.time}</div>
                      <div style={{ fontFamily: LF.sans, fontSize: 10, color: LC.muted, marginTop: 4 }}>{it.dur}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <SubjectChip subject={it.subject} size="sm"/>
                      <div style={{ fontFamily: LF.cn, fontSize: 14, fontWeight: 600, color: LC.ink, marginTop: 5 }}>{it.title}</div>
                      <div style={{ fontFamily: LF.sans, fontSize: 11, color: LC.muted, marginTop: 1 }}>{it.teacher} · {it.mode}</div>
                    </div>
                    <Icon name="chevronR" size={16} color={LC.muted}/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <button style={{
          padding: '14px', borderRadius: LR.lg,
          background: LC.paper, border: `1px dashed ${LC.gold}`,
          color: LC.goldDeep, fontFamily: LF.cn, fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          cursor: 'pointer',
        }}>
          <Icon name="plus" size={16} color={LC.goldDeep}/>
          预约新课 / Réserver un cours
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// METHODOLOGY — 五步成长闭环 detail
// ════════════════════════════════════════════════════════════════
function ScreenMethod() {
  return (
    <div style={{ background: LC.cream, minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ height: 54 }}/>
      <div style={{ padding: '8px 22px 24px' }}>
        <div style={{ fontFamily: LF.serif, fontSize: 11, color: LC.gold, fontStyle: 'italic', letterSpacing: 1.2, textTransform: 'uppercase' }}>04 · Methodology</div>
        <h1 style={{ margin: '2px 0 6px', fontFamily: LF.cn, fontSize: 24, fontWeight: 600, color: LC.ink }}>成长路径</h1>
        <p style={{ margin: 0, fontFamily: LF.serif, fontSize: 14, color: LC.inkSoft, fontStyle: 'italic', lineHeight: 1.5 }}>
          清晰的成长路径，<br/>是扎实成长的起点。
        </p>
      </div>

      <div style={{ padding: '0 22px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map((s, i) => (
          <div key={s.idx} style={{ position: 'relative', display: 'flex', gap: 14 }}>
            <div style={{ flex: '0 0 44px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: s.state === 'done' ? LC.gold : s.state === 'active' ? LC.paper : LC.cream,
                border: `1.2px solid ${s.state === 'next' ? LC.line : LC.gold}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: LF.serif, fontSize: 16, fontWeight: 600,
                color: s.state === 'done' ? '#FFF' : LC.goldDeep,
              }}>{s.idx}</div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, background: LC.line, margin: '6px 0' }}/>
              )}
            </div>
            <Card pad={16} style={{ flex: 1, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontFamily: LF.cn, fontSize: 17, fontWeight: 600, color: LC.ink }}>{s.cn}</h3>
                {s.state === 'active' && <span style={{
                  padding: '2px 8px', borderRadius: 999, background: LC.goldWash, color: LC.goldDeep,
                  fontFamily: LF.sans, fontSize: 10, fontWeight: 600,
                }}>进行中</span>}
                {s.state === 'done' && <span style={{
                  padding: '2px 8px', borderRadius: 999, background: LC.sageSoft, color: LC.good,
                  fontFamily: LF.sans, fontSize: 10, fontWeight: 600,
                }}>已完成</span>}
              </div>
              <div style={{ fontFamily: LF.serif, fontSize: 13, color: LC.gold, fontStyle: 'italic', marginTop: 1, letterSpacing: 0.5 }}>{s.fr}</div>
              <div style={{
                marginTop: 10, padding: '8px 12px', background: LC.cream, borderRadius: 8,
                fontFamily: LF.sans, fontSize: 12, color: LC.inkSoft,
              }}>{s.desc}</div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MESSAGES — 家校沟通
// ════════════════════════════════════════════════════════════════
function ScreenMessages() {
  const threads = [
    { teacher: '陈老师', subject: 'chinese', last: '小曜今天的复述练习已经发您查看，建议本周补充 3 个意象词…', time: '17:42', unread: 2 },
    { teacher: '王老师', subject: 'math', last: '袋鼠数学第 12 讲笔记已上传 Progress File', time: '昨天', unread: 0 },
    { teacher: 'Mme Laurent', subject: 'french', last: 'Le travail de Xiaoyao en expression orale est très solide cette semaine.', time: '04.22', unread: 0 },
  ];
  return (
    <div style={{ background: LC.cream, minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ height: 54 }}/>
      <div style={{ padding: '8px 22px 16px' }}>
        <div style={{ fontFamily: LF.serif, fontSize: 11, color: LC.gold, fontStyle: 'italic', letterSpacing: 1.2, textTransform: 'uppercase' }}>Communication</div>
        <h1 style={{ margin: '2px 0 0', fontFamily: LF.cn, fontSize: 24, fontWeight: 600, color: LC.ink }}>家校沟通</h1>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={0}>
          {threads.map((t, i) => (
            <div key={i} style={{
              padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
              borderBottom: i < threads.length - 1 ? `0.5px solid ${LC.line}` : 'none',
            }}>
              <Avatar name={t.teacher} size={42} color={LC[t.subject]}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: LF.cn, fontSize: 14, fontWeight: 600, color: LC.ink }}>{t.teacher}</div>
                  <div style={{ fontFamily: LF.serif, fontSize: 11, color: LC.muted, fontStyle: 'italic' }}>{t.time}</div>
                </div>
                <div style={{ marginTop: 2, marginBottom: 5 }}>
                  <SubjectChip subject={t.subject} size="sm"/>
                </div>
                <p style={{
                  margin: 0, fontFamily: LF.sans, fontSize: 12, color: LC.inkSoft, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{t.last}</p>
              </div>
              {t.unread > 0 && (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: LC.gold,
                  color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: LF.sans, fontSize: 10, fontWeight: 700,
                }}>{t.unread}</div>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenHome, ScreenProgress, ScreenSchedule, ScreenMethod, ScreenMessages,
  STUDENT, PARENT,
});
