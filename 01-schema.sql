-- ════════════════════════════════════════════════════════════
-- Lumen · v1 schema
-- Run in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- ─── 1. teachers (老师) ─────────────────────────────────────
create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,           -- 'A' / 'B' / 'C' / 'D'
  name text not null,                  -- 显示名 '老师A'
  subjects text[] not null,            -- ['chinese','math','french']
  created_at timestamptz default now()
);

-- ─── 2. families (家庭) ─────────────────────────────────────
create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  parent_name text,                    -- '林爸爸'
  phone text,
  created_at timestamptz default now()
);

-- ─── 3. students (学生) ─────────────────────────────────────
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  name text not null,                  -- '林小曜'
  birth_year int,
  -- 4 科级别
  level_chinese text,                  -- 'HSK 1' .. 'HSK 4'
  level_math text,                     -- 'Koala' / 'Wallaby' / 'Kangaroo' / 'Cadet'
  level_english text,                  -- 'Starters' / 'Movers' / 'KET' / 'PET'
  level_french text,                   -- 'A1' / 'A2' / 'B1' / 'B2'
  created_at timestamptz default now()
);

-- ─── 4. lessons (课次 — 已发生 + 未发生) ────────────────────
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  date date not null,                  -- '2026-05-03'
  time text not null,                  -- '09:30'
  duration int default 45,             -- 分钟
  room text not null,                  -- 'A' .. 'F'
  subject text not null,               -- 'chinese' / 'math' / 'english' / 'french' / 'support'
  level text,                          -- 'HSK 3'
  teacher_id uuid references teachers(id),
  capacity int default 8,
  created_at timestamptz default now()
);

-- ─── 5. enrollments (谁上了哪节课) ──────────────────────────
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  status text default 'confirmed',     -- 'confirmed' / 'attended' / 'absent' / 'adjusted'
  created_at timestamptz default now(),
  unique (student_id, lesson_id)
);

-- ─── 6. feedback (老师课后记录) ─────────────────────────────
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments(id) on delete cascade,
  teacher_id uuid references teachers(id),
  text text not null,
  tags text[],                         -- ['理解到位', '主动表达']
  created_at timestamptz default now()
);

-- ════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- 家长只能看自己孩子的数据；老师暂时全开（之后再细化）
-- ════════════════════════════════════════════════════════════

alter table families enable row level security;
alter table students enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table feedback enable row level security;
alter table teachers enable row level security;

-- families: 用户只能看自己的家庭
create policy "own family read" on families
  for select using (auth.uid() = user_id);
create policy "own family insert" on families
  for insert with check (auth.uid() = user_id);
create policy "own family update" on families
  for update using (auth.uid() = user_id);

-- students: 用户能看自己家庭的学生
create policy "own students read" on students
  for select using (
    family_id in (select id from families where user_id = auth.uid())
  );

-- lessons: 所有登录用户可读
create policy "all lessons read" on lessons
  for select using (auth.role() = 'authenticated');

-- enrollments: 用户能看自己孩子的报名
create policy "own enrollments read" on enrollments
  for select using (
    student_id in (
      select id from students where family_id in (
        select id from families where user_id = auth.uid()
      )
    )
  );

-- feedback: 跟着 enrollment 走
create policy "own feedback read" on feedback
  for select using (
    enrollment_id in (
      select e.id from enrollments e
      join students s on s.id = e.student_id
      join families f on f.id = s.family_id
      where f.user_id = auth.uid()
    )
  );

-- teachers: 所有登录用户可读
create policy "all teachers read" on teachers
  for select using (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════
-- 种子数据 — 4 位老师
-- ════════════════════════════════════════════════════════════
insert into teachers (code, name, subjects) values
  ('A', '老师A', array['chinese','math','french']),
  ('B', '老师B', array['chinese','math','english','french']),
  ('C', '老师C', array['math']),
  ('D', '老师D', array['english','french'])
on conflict (code) do nothing;
