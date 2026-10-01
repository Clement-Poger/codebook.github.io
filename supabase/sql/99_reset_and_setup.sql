-- Script unique de reset et de configuration CodeBook.
-- Avertissement : supprime public.profiles et public.quiz_progress, y compris leurs données.
-- Usage : exécuter ce fichier dans le SQL Editor de Supabase.

begin;

-- =============================================================
-- RESET DES TABLES DE L'APPLICATION
-- =============================================================

drop table if exists public.quiz_progress;
drop table if exists public.profiles;

drop function if exists public.set_quiz_progress_updated_at();
drop function if exists public.is_current_user_admin();
drop function if exists public.set_profiles_updated_at();

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
grant select, update on table public.profiles to authenticated;

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

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and (is_admin = true or role = 'admin')
  );
$$;

revoke all on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;

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
  public.is_current_user_admin()
);

create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

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

commit;
