// Lumen — Supabase Auth Helper
// 把这个文件放在项目根目录，在 app.html / index.html 里 <script src="supabase-auth.js"> 引入

// ── Supabase 配置 ─────────────────────────────────────────────
const SUPABASE_URL = 'https://jbiiuqkxmkryknyfsczw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LJxs9xEnCUWEitYwB9UKnw_9Xwee3aZ';

// ── 初始化 Supabase 客户端 ─────────────────────────────────────
// 用 CDN 版本，不需要 npm，直接在浏览器里跑
// 在 HTML 里先引入：
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ── Auth 方法 ─────────────────────────────────────────────────

// 发送验证码（Magic Link OTP）到邮箱
async function sendOTP(email) {
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // 自动注册新用户
    },
  });
  if (error) throw error;
  return true;
}

// 验证 OTP 码
async function verifyOTP(email, token) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;
  return data.user;
}

// 获取当前登录用户
async function getCurrentUser() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

// 登出
async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
}

// 监听登录状态变化
function onAuthStateChange(callback) {
  const sb = getSupabase();
  return sb.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user ?? null);
  });
}

// 获取用户 profile（从 profiles 表）
async function getUserProfile(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

// 暴露到全局，React 组件可以直接调用
Object.assign(window, {
  LumenAuth: {
    sendOTP,
    verifyOTP,
    getCurrentUser,
    signOut,
    onAuthStateChange,
    getUserProfile,
    getSupabase,
  }
});
