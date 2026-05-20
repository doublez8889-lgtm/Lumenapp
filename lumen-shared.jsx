// lumen-shared.jsx
// 家长端 app.html 和 教务端 staff.html 之间共享的数据层。
// localStorage 在同源标签页之间共享，'storage' 事件可以跨标签广播变更。
//
// 数据形状：
//   requests:      Request[]      家长提交的请假/调课
//   notifications: Notification[] 推给家长或教务的消息
//
// Request:
//   { id, type: 'leave'|'reschedule', studentName, lessonTitle,
//     lessonDate, reason, preferredSlot?, status: 'pending'|'approved'|'rejected',
//     createdAt, decidedAt?, decidedBy?, staffNote? }
//
// Notification:
//   { id, audience: 'parent'|'staff', kind, title, body, refId?, createdAt, read }

(function () {
  'use strict';

  const LS_REQ  = 'lumen_requests_v1';
  const LS_NOTE = 'lumen_notifications_v1';

  function readJSON(k, fallback) {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }
  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  // ── Requests ─────────────────────────────────────────────
  function getRequests() {
    return readJSON(LS_REQ, []);
  }
  function addRequest(req) {
    const list = getRequests();
    const full = {
      id: uid('req'),
      status: 'pending',
      createdAt: Date.now(),
      ...req,
    };
    list.unshift(full);
    writeJSON(LS_REQ, list);
    // 自动给教务推一条通知
    pushNotification('staff', {
      kind: req.type === 'leave' ? 'leave_request' : 'reschedule_request',
      title: req.type === 'leave' ? '新的请假申请' : '新的调课申请',
      body: `${req.studentName}：${req.lessonTitle}（${req.lessonDate}）`,
      refId: full.id,
    });
    emit();
    return full;
  }
  function updateRequest(id, patch) {
    const list = getRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx < 0) return null;
    const updated = { ...list[idx], ...patch };
    list[idx] = updated;
    writeJSON(LS_REQ, list);
    // 状态变化时给家长推通知
    if (patch.status && patch.status !== 'pending') {
      const isOk = patch.status === 'approved';
      pushNotification('parent', {
        kind: updated.type + '_' + patch.status,
        title: isOk ? '申请已通过' : '申请未通过',
        body: `${updated.studentName} 的「${updated.lessonTitle}」${isOk ? '已批准' : '未批准'}${patch.staffNote ? '：' + patch.staffNote : ''}`,
        refId: id,
      });
    }
    emit();
    return updated;
  }

  // ── Notifications ────────────────────────────────────────
  function getNotifications(audience) {
    const all = readJSON(LS_NOTE, []);
    return audience ? all.filter(n => n.audience === audience) : all;
  }
  function pushNotification(audience, n) {
    const list = readJSON(LS_NOTE, []);
    list.unshift({
      id: uid('note'),
      audience,
      createdAt: Date.now(),
      read: false,
      ...n,
    });
    writeJSON(LS_NOTE, list);
    emit();
  }
  function markNotificationRead(id) {
    const list = readJSON(LS_NOTE, []);
    const idx = list.findIndex(n => n.id === id);
    if (idx < 0) return;
    list[idx] = { ...list[idx], read: true };
    writeJSON(LS_NOTE, list);
    emit();
  }
  function markAllRead(audience) {
    const list = readJSON(LS_NOTE, []);
    const next = list.map(n => n.audience === audience ? { ...n, read: true } : n);
    writeJSON(LS_NOTE, next);
    emit();
  }
  function unreadCount(audience) {
    return getNotifications(audience).filter(n => !n.read).length;
  }

  // ── Feedback (老师课后反馈) ────────────────────────────
  const LS_FB = 'lumen_feedback_v1';
  function getFeedback() {
    return readJSON(LS_FB, []);
  }
  function addFeedback(fb) {
    const list = getFeedback();
    const full = {
      id: uid('fb'),
      createdAt: Date.now(),
      ...fb,
    };
    list.unshift(full);
    writeJSON(LS_FB, list);
    pushNotification('parent', {
      kind: 'feedback',
      title: '老师课后反馈',
      body: `${fb.studentName} · ${fb.lessonTitle}：${(fb.text || '').slice(0, 40)}${(fb.text || '').length > 40 ? '…' : ''}`,
      refId: full.id,
    });
    emit();
    return full;
  }

  // ── Class Snippets (课堂切片：照片/瞬间) ───────────────
  const LS_SNIP = 'lumen_snippets_v1';
  function getSnippets() {
    return readJSON(LS_SNIP, []);
  }
  function addSnippet(s) {
    const list = getSnippets();
    const full = {
      id: uid('snip'),
      createdAt: Date.now(),
      ...s,
    };
    list.unshift(full);
    writeJSON(LS_SNIP, list);
    pushNotification('parent', {
      kind: 'feedback',
      title: '新的课堂切片',
      body: `${s.studentName} · ${s.keywords?.join(' · ') || s.note?.slice(0, 30) || '老师上传了新的瞬间'}`,
      refId: full.id,
    });
    emit();
    return full;
  }

  // ── Reports (月度报告) ────────────────────────────────
  const LS_REP = 'lumen_reports_v1';
  function getReports() {
    return readJSON(LS_REP, []);
  }
  function addReport(r) {
    const list = getReports();
    const full = {
      id: uid('rep'),
      createdAt: Date.now(),
      ...r,
    };
    list.unshift(full);
    writeJSON(LS_REP, list);
    pushNotification('parent', {
      kind: 'report',
      title: '月度报告已就绪',
      body: `${r.studentName} · ${r.period} · 点击查看完整报告`,
      refId: full.id,
    });
    emit();
    return full;
  }

  // ── Subscriptions ────────────────────────────────────────
  const subs = new Set();
  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }
  function emit() {
    subs.forEach(fn => { try { fn(); } catch {} });
  }
  // 跨标签同步：另一个标签写 localStorage 时触发
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === LS_REQ || e.key === LS_NOTE) emit();
    });
  }

  // ── React hook ───────────────────────────────────────────
  function useLumenStore() {
    const [, force] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => subscribe(force), []);
  }

  // ── Demo seeding (optional) ──────────────────────────────
  function seedDemo() {
    if (getRequests().length > 0) return;
    addRequest({
      type: 'leave',
      studentName: '小宇',
      lessonTitle: 'HSK 2 · 中文',
      lessonDate: '本周四 16:30',
      reason: '发烧请假一次',
    });
  }
  function clearAll() {
    writeJSON(LS_REQ, []);
    writeJSON(LS_NOTE, []);
    writeJSON(LS_FB, []);
    writeJSON(LS_SNIP, []);
    writeJSON(LS_REP, []);
    emit();
  }

  window.LumenStore = {
    getRequests, addRequest, updateRequest,
    getNotifications, pushNotification, markNotificationRead, markAllRead, unreadCount,
    getFeedback, addFeedback,
    getSnippets, addSnippet,
    getReports, addReport,
    subscribe, useLumenStore,
    seedDemo, clearAll,
  };
})();
