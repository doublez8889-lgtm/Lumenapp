// lumen-staff-archive.jsx
// 教务/老师录入界面：课后反馈 · 课堂切片 · 月度报告
//
// 暴露：window.ArchiveTab
// 提交后会自动通过 LumenStore 推送通知给家长

(function () {
  'use strict';

  const T = window.T;
  if (!T) {
    console.error('[archive] T tokens not ready');
    return;
  }

  // 模拟学生 + 课程列表（demo 用）
  const STUDENTS = [
    { id: 'lin',    name: '林小曜', grade: 'CM1' },
    { id: 'wang',   name: '王梓宁', grade: 'CE2' },
    { id: 'parent', name: '陈梓萱', grade: '6e' },
  ];
  const SUBJECTS = [
    { id: 'chinese', label: '中文', color: '#D6603A' },
    { id: 'math',    label: '数学', color: '#1E3FCC' },
    { id: 'french',  label: '法语', color: '#2C7A4E' },
    { id: 'english', label: '英语', color: '#7A5FBA' },
  ];

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    if (diff < 60_000)     return '刚刚';
    if (diff < 3_600_000)  return Math.floor(diff / 60_000) + ' 分钟前';
    if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + ' 小时前';
    return Math.floor(diff / 86_400_000) + ' 天前';
  }

  function ArchiveTab() {
    window.LumenStore.useLumenStore();
    const [section, setSection] = React.useState('feedback'); // feedback | snippet | report

    return (
      <div style={{ padding: 32, minHeight: '100vh' }}>
        {/* 标题 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: T.font.mono, fontSize: 10, letterSpacing: 2, color: T.c.muted,
          }}>ARCHIVES · 课堂记录</div>
          <h1 style={{
            margin: '4px 0 0', fontFamily: T.font.display,
            fontSize: 30, fontWeight: 800, letterSpacing: -0.6,
          }}>录入家长可见的内容</h1>
          <div style={{
            marginTop: 6, fontFamily: T.font.cn, fontSize: 13, color: T.c.muted, lineHeight: 1.5,
          }}>提交后会立刻推送给家长 · 进入家长 App 通知中心</div>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `1px solid ${T.c.line}` }}>
          {[
            { k: 'feedback', label: '课后反馈',   en: 'FEEDBACK', desc: '上完课写 1-2 句话' },
            { k: 'snippet',  label: '课堂切片',   en: 'SNIPPET',  desc: '照片 / 瞬间 / 关键词' },
            { k: 'report',   label: '月度报告',   en: 'REPORT',   desc: '生成 PDF 推送家长' },
          ].map(t => {
            const on = section === t.k;
            return (
              <button key={t.k} onClick={() => setSection(t.k)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '12px 22px 12px 0', textAlign: 'left',
                marginRight: 32, marginBottom: -1,
                borderBottom: on ? `2px solid ${T.c.ink}` : '2px solid transparent',
              }}>
                <div style={{
                  fontFamily: T.font.cn, fontSize: 15, fontWeight: on ? 700 : 500,
                  color: on ? T.c.ink : T.c.inkSoft, marginBottom: 2,
                }}>{t.label} <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.c.muted, marginLeft: 4, letterSpacing: 1 }}>{t.en}</span></div>
                <div style={{ fontFamily: T.font.cn, fontSize: 11, color: T.c.muted }}>{t.desc}</div>
              </button>
            );
          })}
        </div>

        {section === 'feedback' && <FeedbackSection/>}
        {section === 'snippet'  && <SnippetSection/>}
        {section === 'report'   && <ReportSection/>}
      </div>
    );
  }

  // ── 课后反馈 ──────────────────────────────────────────
  function FeedbackSection() {
    const all = window.LumenStore.getFeedback();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, alignItems: 'start' }}>
        <FeedbackForm/>
        <RecentList
          title="最近提交"
          items={all}
          renderItem={fb => (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontFamily: T.font.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                  color: SUBJECTS.find(s => s.id === fb.subject)?.color || T.c.muted,
                  textTransform: 'uppercase',
                }}>{SUBJECTS.find(s => s.id === fb.subject)?.label || fb.subject}</span>
                <span style={{ flex: 1 }}/>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted }}>
                  {timeAgo(fb.createdAt)}
                </span>
              </div>
              <div style={{ fontFamily: T.font.cn, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {fb.studentName} · {fb.lessonTitle}
              </div>
              <div style={{ fontFamily: T.font.cn, fontSize: 13, color: T.c.inkSoft, lineHeight: 1.6 }}>
                "{fb.text}"
              </div>
              {fb.tags?.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {fb.tags.map(tg => (
                    <span key={tg} style={{
                      fontFamily: T.font.cn, fontSize: 10, fontWeight: 600,
                      padding: '3px 7px', border: `1px solid ${T.c.line}`,
                    }}>{tg}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>
    );
  }

  function FeedbackForm() {
    const [studentId, setStudentId] = React.useState(STUDENTS[0].id);
    const [subject, setSubject]     = React.useState(SUBJECTS[0].id);
    const [lessonTitle, setLesson]  = React.useState('HSK 2 · 中文');
    const [text, setText]           = React.useState('');
    const [tagsRaw, setTagsRaw]     = React.useState('');
    const [teacher, setTeacher]     = React.useState('Wang 老师');
    const [submittedId, setSubmitted] = React.useState(null);

    const student = STUDENTS.find(s => s.id === studentId);
    const can = text.trim().length >= 8;

    const submit = () => {
      if (!can) return;
      const tags = tagsRaw.split(/[,，·、\s]+/).map(s => s.trim()).filter(Boolean).slice(0, 5);
      const fb = window.LumenStore.addFeedback({
        studentId, studentName: student.name,
        subject, lessonTitle, text: text.trim(), tags, teacher,
        date: new Date().toLocaleDateString('zh-CN'),
      });
      setSubmitted(fb.id);
      setText(''); setTagsRaw('');
      setTimeout(() => setSubmitted(null), 2200);
    };

    return (
      <Card title="新增课后反馈" en="NEW FEEDBACK">
        <Field label="学生">
          <Select value={studentId} onChange={setStudentId} options={STUDENTS.map(s => ({ v: s.id, l: `${s.name} · ${s.grade}` }))}/>
        </Field>
        <Field label="学科">
          <Pills value={subject} onChange={setSubject} options={SUBJECTS.map(s => ({ v: s.id, l: s.label, c: s.color }))}/>
        </Field>
        <Field label="课程">
          <Input value={lessonTitle} onChange={setLesson} placeholder="例：HSK 2 · 中文"/>
        </Field>
        <Field label="反馈正文" hint="1-2 句话，描述孩子今天的具体表现">
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            rows={4}
            placeholder="例：今天主动用'然后'连接了三个动作，故事讲得有逻辑了。"
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1px solid ${T.c.line}`,
              background: T.c.cream || '#FAF6EE',
              padding: 12, fontSize: 13, fontFamily: T.font.cn,
              outline: 'none', resize: 'vertical', borderRadius: 0,
            }}
          />
          <div style={{
            marginTop: 4, fontFamily: T.font.mono, fontSize: 10, color: T.c.muted,
          }}>{text.length} / 200</div>
        </Field>
        <Field label="关键词" hint="用空格或逗号分隔 · 最多 5 个">
          <Input value={tagsRaw} onChange={setTagsRaw} placeholder="例：连接词 主动表达 复述"/>
        </Field>
        <Field label="老师">
          <Input value={teacher} onChange={setTeacher}/>
        </Field>
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button onClick={submit} disabled={!can} style={{
            flex: 1, padding: '12px',
            background: T.c.ink, color: T.c.paper, border: 'none', cursor: can ? 'pointer' : 'not-allowed',
            fontFamily: T.font.cn, fontSize: 14, fontWeight: 700,
            opacity: can ? 1 : 0.4,
          }}>{submittedId ? '✓ 已推送家长' : '提交并推送家长'}</button>
        </div>
      </Card>
    );
  }

  // ── 课堂切片 ──────────────────────────────────────────
  function SnippetSection() {
    const all = window.LumenStore.getSnippets();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, alignItems: 'start' }}>
        <SnippetForm/>
        <RecentList
          title="最近上传"
          items={all}
          renderItem={s => (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>📸</span>
                <span style={{
                  fontFamily: T.font.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                  color: T.c.muted, textTransform: 'uppercase',
                }}>SNIPPET</span>
                <span style={{ flex: 1 }}/>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted }}>
                  {timeAgo(s.createdAt)}
                </span>
              </div>
              <div style={{ fontFamily: T.font.cn, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {s.studentName}
              </div>
              {s.note && (
                <div style={{ fontFamily: T.font.cn, fontSize: 13, color: T.c.inkSoft, lineHeight: 1.6, marginBottom: 6 }}>
                  {s.note}
                </div>
              )}
              {s.keywords?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.keywords.map(k => (
                    <span key={k} style={{
                      fontFamily: T.font.cn, fontSize: 10, fontWeight: 600,
                      padding: '3px 7px', background: T.c.lineSoft || '#F0EBE2',
                    }}>{k}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>
    );
  }

  function SnippetForm() {
    const [studentId, setStudentId] = React.useState(STUDENTS[0].id);
    const [photoName, setPhotoName] = React.useState('');
    const [note, setNote]           = React.useState('');
    const [kwRaw, setKwRaw]         = React.useState('');
    const [submittedId, setSub]     = React.useState(null);

    const student = STUDENTS.find(s => s.id === studentId);
    const can = note.trim().length >= 4 || kwRaw.trim().length > 0 || photoName;

    const submit = () => {
      if (!can) return;
      const keywords = kwRaw.split(/[,，·、\s]+/).map(x => x.trim()).filter(Boolean).slice(0, 6);
      const r = window.LumenStore.addSnippet({
        studentId, studentName: student.name,
        photoName, note: note.trim(), keywords,
      });
      setSub(r.id); setNote(''); setKwRaw(''); setPhotoName('');
      setTimeout(() => setSub(null), 2200);
    };

    return (
      <Card title="上传课堂切片" en="UPLOAD SNIPPET">
        <Field label="学生">
          <Select value={studentId} onChange={setStudentId} options={STUDENTS.map(s => ({ v: s.id, l: `${s.name} · ${s.grade}` }))}/>
        </Field>

        <Field label="照片 / 视频" hint="拍下孩子的某个学习瞬间（demo · 仅记录文件名）">
          <label style={{
            display: 'block', cursor: 'pointer',
            border: `2px dashed ${T.c.line}`,
            background: T.c.cream || '#FAF6EE',
            padding: '24px 16px', textAlign: 'center',
          }}>
            <input
              type="file" accept="image/*,video/*"
              onChange={e => setPhotoName(e.target.files?.[0]?.name || '')}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.4 }}>📷</div>
            <div style={{
              fontFamily: T.font.cn, fontSize: 13, fontWeight: 600, color: T.c.ink,
            }}>{photoName ? `已选：${photoName}` : '点击选择照片或视频'}</div>
            <div style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted, marginTop: 4, letterSpacing: 1 }}>
              JPG · PNG · MP4 · 最大 30MB
            </div>
          </label>
        </Field>

        <Field label="老师备注" hint="一句话说明这个瞬间为什么值得记录">
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="例：第一次主动举手回答，逻辑清晰"
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1px solid ${T.c.line}`,
              background: T.c.cream || '#FAF6EE',
              padding: 12, fontSize: 13, fontFamily: T.font.cn,
              outline: 'none', resize: 'vertical', borderRadius: 0,
            }}
          />
        </Field>

        <Field label="关键词" hint="孩子展现的能力 · 进入年度档案标签库">
          <Input value={kwRaw} onChange={setKwRaw} placeholder="例：主动 逻辑 表达 创造"/>
        </Field>

        <div style={{ marginTop: 18 }}>
          <button onClick={submit} disabled={!can} style={{
            width: '100%', padding: '12px',
            background: T.c.ink, color: T.c.paper, border: 'none',
            cursor: can ? 'pointer' : 'not-allowed',
            fontFamily: T.font.cn, fontSize: 14, fontWeight: 700,
            opacity: can ? 1 : 0.4,
          }}>{submittedId ? '✓ 已推送家长' : '上传并推送家长'}</button>
        </div>
      </Card>
    );
  }

  // ── 月度报告 ──────────────────────────────────────────
  function ReportSection() {
    const all = window.LumenStore.getReports();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, alignItems: 'start' }}>
        <ReportForm/>
        <RecentList
          title="已生成的报告"
          items={all}
          renderItem={r => (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <span style={{
                  fontFamily: T.font.mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                  color: T.c.math || '#1E3FCC', textTransform: 'uppercase',
                }}>MILESTONE REPORT</span>
                <span style={{ flex: 1 }}/>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.c.muted }}>
                  {timeAgo(r.createdAt)}
                </span>
              </div>
              <div style={{ fontFamily: T.font.cn, fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                {r.studentName} · {r.period}
              </div>
              <div style={{ fontFamily: T.font.cn, fontSize: 12, color: T.c.muted }}>
                {r.lessonsCount} 节课 · {r.keywordsCount} 个关键词 · {r.snippetsCount} 张切片
              </div>
              {r.summary && (
                <div style={{ marginTop: 8, fontFamily: T.font.cn, fontSize: 13, color: T.c.inkSoft, lineHeight: 1.6 }}>
                  {r.summary}
                </div>
              )}
            </div>
          )}
        />
      </div>
    );
  }

  function ReportForm() {
    const [studentId, setStudentId] = React.useState(STUDENTS[0].id);
    const [period, setPeriod]       = React.useState('2026 · 4 月');
    const [summary, setSummary]     = React.useState('');
    const [submittedId, setSub]     = React.useState(null);

    const student = STUDENTS.find(s => s.id === studentId);

    // 自动统计：从 LumenStore 拉数据
    const fbCount   = window.LumenStore.getFeedback().filter(f => f.studentId === studentId).length;
    const snipCount = window.LumenStore.getSnippets().filter(s => s.studentId === studentId).length;
    const allKw = [
      ...window.LumenStore.getFeedback().filter(f => f.studentId === studentId).flatMap(f => f.tags || []),
      ...window.LumenStore.getSnippets().filter(s => s.studentId === studentId).flatMap(s => s.keywords || []),
    ];
    const kwCount = new Set(allKw).size;

    const generate = () => {
      const r = window.LumenStore.addReport({
        studentId, studentName: student.name,
        period,
        lessonsCount: fbCount,
        keywordsCount: kwCount,
        snippetsCount: snipCount,
        summary: summary.trim(),
      });
      setSub(r.id); setSummary('');
      setTimeout(() => setSub(null), 2200);
    };

    return (
      <Card title="生成月度报告" en="GENERATE REPORT">
        <Field label="学生">
          <Select value={studentId} onChange={setStudentId} options={STUDENTS.map(s => ({ v: s.id, l: `${s.name} · ${s.grade}` }))}/>
        </Field>
        <Field label="时间段">
          <Input value={period} onChange={setPeriod}/>
        </Field>

        <Field label="自动统计" hint="基于本月已录入的反馈 + 切片">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8, padding: '12px',
            border: `1px solid ${T.c.line}`,
            background: T.c.cream || '#FAF6EE',
          }}>
            <Stat n={fbCount} label="课堂反馈"/>
            <Stat n={snipCount} label="课堂切片"/>
            <Stat n={kwCount} label="关键词"/>
          </div>
        </Field>

        <Field label="顾问总结" hint="1-3 段，是这份报告的灵魂">
          <textarea
            value={summary} onChange={e => setSummary(e.target.value)}
            rows={5}
            placeholder="例：林小曜本月在中文表达上有显著突破。第二周开始能主动用复合句…"
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1px solid ${T.c.line}`,
              background: T.c.cream || '#FAF6EE',
              padding: 12, fontSize: 13, fontFamily: T.font.cn,
              outline: 'none', resize: 'vertical', borderRadius: 0,
            }}
          />
        </Field>

        <div style={{ marginTop: 18 }}>
          <button onClick={generate} style={{
            width: '100%', padding: '12px',
            background: T.c.ink, color: T.c.paper, border: 'none', cursor: 'pointer',
            fontFamily: T.font.cn, fontSize: 14, fontWeight: 700,
          }}>{submittedId ? '✓ 已生成并推送家长' : '生成报告 · 推送家长'}</button>
          <div style={{
            marginTop: 8, fontFamily: T.font.cn, fontSize: 11, color: T.c.muted, textAlign: 'center',
          }}>家长会在 ME 页「报告」区看到，并收到通知</div>
        </div>
      </Card>
    );
  }

  // ── 通用小部件 ──────────────────────────────────────
  function Card({ title, en, children }) {
    return (
      <div style={{ border: `1px solid ${T.c.ink}`, background: T.c.paper, padding: 22 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: T.font.mono, fontSize: 9, letterSpacing: 2, color: T.c.muted, marginBottom: 4,
          }}>{en}</div>
          <h3 style={{
            margin: 0, fontFamily: T.font.cn, fontSize: 18, fontWeight: 800, letterSpacing: -0.3,
          }}>{title}</h3>
        </div>
        {children}
      </div>
    );
  }

  function Field({ label, hint, children }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: T.font.mono, fontSize: 9, letterSpacing: 2, color: T.c.muted,
          textTransform: 'uppercase', marginBottom: 6,
        }}>{label}</div>
        {children}
        {hint && (
          <div style={{
            marginTop: 4, fontFamily: T.font.cn, fontSize: 11, color: T.c.muted, lineHeight: 1.5,
          }}>{hint}</div>
        )}
      </div>
    );
  }

  function Input({ value, onChange, placeholder }) {
    return (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box',
          border: `1px solid ${T.c.line}`,
          background: T.c.cream || '#FAF6EE',
          padding: '10px 12px', fontSize: 13, fontFamily: T.font.cn,
          outline: 'none', borderRadius: 0,
        }}
      />
    );
  }

  function Select({ value, onChange, options }) {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          border: `1px solid ${T.c.line}`,
          background: T.c.cream || '#FAF6EE',
          padding: '10px 12px', fontSize: 13, fontFamily: T.font.cn,
          outline: 'none', borderRadius: 0,
        }}
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    );
  }

  function Pills({ value, onChange, options }) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => {
          const on = o.v === value;
          return (
            <button key={o.v} onClick={() => onChange(o.v)} style={{
              padding: '8px 14px',
              background: on ? o.c : T.c.paper,
              color: on ? '#fff' : T.c.ink,
              border: `1px solid ${on ? o.c : T.c.line}`,
              cursor: 'pointer',
              fontFamily: T.font.cn, fontSize: 12, fontWeight: on ? 700 : 500,
            }}>{o.l}</button>
          );
        })}
      </div>
    );
  }

  function Stat({ n, label }) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.font.display, fontSize: 24, fontWeight: 800, color: T.c.ink, lineHeight: 1,
        }}>{n}</div>
        <div style={{
          fontFamily: T.font.mono, fontSize: 9, color: T.c.muted, letterSpacing: 1, marginTop: 4,
        }}>{label}</div>
      </div>
    );
  }

  function RecentList({ title, items, renderItem }) {
    return (
      <div>
        <div style={{
          fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1.5, color: T.c.muted,
          marginBottom: 12, fontWeight: 700,
        }}>{title.toUpperCase()} · {items.length}</div>
        {items.length === 0 ? (
          <div style={{
            padding: '40px 20px', border: `1px dashed ${T.c.line}`,
            textAlign: 'center', color: T.c.muted,
          }}>
            <div style={{ fontFamily: T.font.cn, fontSize: 13 }}>还没有记录</div>
            <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: 1, opacity: 0.7, marginTop: 4 }}>
              SUBMIT YOUR FIRST →
            </div>
          </div>
        ) : items.map(it => (
          <div key={it.id} style={{
            background: T.c.paper, border: `1px solid ${T.c.line}`,
            padding: '14px 16px', marginBottom: 10,
          }}>
            {renderItem(it)}
          </div>
        ))}
      </div>
    );
  }

  window.ArchiveTab = ArchiveTab;
  window.dispatchEvent(new CustomEvent('lumen-staff-module-ready'));
})();
