-- 99_reset_and_setup.sql
-- Script unique pour remettre Supabase à zéro puis reconstruire les tables et politiques.
-- Usage : exécuter ce fichier dans le SQL Editor de Supabase.

-- =============================================================
-- RESET COMPLET (optionnel mais utile pour recréer proprement)
-- =============================================================

drop policy if exists "Users can read their own progress" on public.quiz_progress;
drop policy if exists "Users can create their own progress" on public.quiz_progress;
drop policy if exists "Users can update their own progress" on public.quiz_progress;
drop policy if exists "Users can delete their own progress" on public.quiz_progress;
drop trigger if exists set_quiz_progress_updated_at on public.quiz_progress;
drop function if exists public.set_quiz_progress_updated_at();
drop table if exists public.quiz_progress;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;
drop trigger if exists set_profiles_updated_at on public.profiles;
drop function if exists public.set_profiles_updated_at();
drop table if exists public.profiles;

-- =============================================================
-- SETUP PROFILES / ADMIN
-- =============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, public;
grant select, insert, update on table public.profiles to authenticated;

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (p.is_admin = true or p.role = 'admin')
  )
);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (p.is_admin = true or p.role = 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (p.is_admin = true or p.role = 'admin')
  )
);

-- =============================================================
-- SETUP QUIZ PROGRESS
-- =============================================================

create table public.quiz_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  quiz_count integer not null default 0 check (quiz_count >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  answer_count integer not null default 0 check (answer_count >= correct_count),
  by_theme jsonb not null default '{}'::jsonb check (jsonb_typeof(by_theme) = 'object'),
  recent jsonb not null default '[]'::jsonb check (jsonb_typeof(recent) = 'array' and jsonb_array_length(recent) <= 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;
revoke all on table public.quiz_progress from anon, public;
grant select, insert, update, delete on table public.quiz_progress to authenticated;

create or replace function public.set_quiz_progress_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_quiz_progress_updated_at
before update on public.quiz_progress
for each row
execute function public.set_quiz_progress_updated_at();

create policy "Users can read their own progress"
on public.quiz_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own progress"
on public.quiz_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
on public.quiz_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own progress"
on public.quiz_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- =============================================================
-- PROMOTION DU COMPTE ADMIN
-- =============================================================

insert into public.profiles (id, email, is_admin, role)
values ('87bcaa7f-aee4-43cb-a168-3184c5ad74da', 'clementpog@gmail.com', true, 'admin')
on conflict (id)
do update set
  email = excluded.email,
  is_admin = true,
  role = 'admin';

-- =============================================================
-- CHECKS
-- =============================================================

select *
from public.profiles
where id = '87bcaa7f-aee4-43cb-a168-3184c5ad74da';
