// ════════════════════════════════════════════════════════════
// Lumen · Supabase data layer
// All DB access goes through this module.
// ════════════════════════════════════════════════════════════

const SUPABASE_URL  = 'https://jbiiuqkxmkryknyfsczw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_LJxs9xEnCUWEitYwB9UKnw_9Xwee3aZ';

// supabase-js v2 — loaded via <script> tag (sets window.supabase)
// Defensive: if the CDN script is still loading or blocked, defer client creation
let sb = null;
try {
  if (window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
      },
    });
  } else {
    console.warn('[Lumen] supabase-js not loaded yet — auth/data calls will throw until reload');
  }
} catch (e) {
  console.error('[Lumen] supabase init failed:', e);
}

function requireSb() {
  if (!sb) throw new Error('数据服务正在连接，请刷新页面重试。');
  return sb;
}

// ─── Auth ───────────────────────────────────────────────────
async function authSendOtp(email) {
  // Sends a 6-digit code to the email
  const { error } = await requireSb().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

async function authVerifyOtp(email, token) {
  const { data, error } = await requireSb().auth.verifyOtp({
    email, token, type: 'email',
  });
  if (error) throw error;
  return data.user;
}

async function authSignOut() {
  await requireSb().auth.signOut();
}

async function authGetUser() {
  const { data } = await requireSb().auth.getUser();
  return data.user;
}

function authOnChange(cb) {
  return requireSb().auth.onAuthStateChange((_event, session) => cb(session?.user || null));
}

// ─── Family / Students ──────────────────────────────────────
async function ensureFamily(user) {
  // First-time login: create a family row for this user
  const { data: existing } = await sb
    .from('families')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) return existing;

  const { data, error } = await requireSb().from('families').insert({
    user_id: user.id,
    parent_name: user.email?.split('@')[0] || '家长',
  }).select().single();
  if (error) throw error;
  return data;
}

async function getMyStudents() {
  const { data, error } = await sb
    .from('students')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function addStudent({ name, levelChinese, levelMath, levelEnglish, levelFrench, birthYear }) {
  const user = await authGetUser();
  if (!user) throw new Error('not signed in');
  const family = await ensureFamily(user);
  const { data, error } = await requireSb().from('students').insert({
    family_id: family.id,
    name,
    birth_year: birthYear || null,
    level_chinese: levelChinese || null,
    level_math: levelMath || null,
    level_english: levelEnglish || null,
    level_french: levelFrench || null,
  }).select().single();
  if (error) throw error;
  return data;
}

// ─── Lessons ────────────────────────────────────────────────
async function getLessonsForDate(date) {
  // date format: 'YYYY-MM-DD'
  const { data, error } = await sb
    .from('lessons')
    .select('*, teachers(name, code)')
    .eq('date', date)
    .order('time', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function getMyEnrollments(studentId, fromDate, toDate) {
  const { data, error } = await sb
    .from('enrollments')
    .select('*, lessons(*, teachers(name, code))')
    .eq('student_id', studentId)
    .gte('lessons.date', fromDate)
    .lte('lessons.date', toDate)
    .order('lessons(date)', { ascending: true });
  if (error) throw error;
  return (data || []).filter(e => e.lessons); // filter null joins
}

// ─── Teachers ───────────────────────────────────────────────
async function getTeachers() {
  const { data, error } = await requireSb().from('teachers').select('*').order('code');
  if (error) throw error;
  return data || [];
}

// ─── Expose ─────────────────────────────────────────────────
window.LumenData = {
  sb,
  authSendOtp, authVerifyOtp, authSignOut, authGetUser, authOnChange,
  ensureFamily, getMyStudents, addStudent,
  getLessonsForDate, getMyEnrollments,
  getTeachers,
};
