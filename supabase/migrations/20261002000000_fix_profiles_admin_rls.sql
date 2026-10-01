-- Remove recursive profile policies and route admin checks through a definer function.
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

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;

revoke insert, update, delete on table public.profiles from authenticated;
grant select, update on table public.profiles to authenticated;

create policy "Users can read their own profile"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id);

create policy "Admins can read all profiles"
    on public.profiles
    for select
    to authenticated
    using (public.is_current_user_admin());

create policy "Admins can update any profile"
    on public.profiles
    for update
    to authenticated
    using (public.is_current_user_admin())
    with check (public.is_current_user_admin());