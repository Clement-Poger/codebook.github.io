create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text,
    is_admin boolean not null default false,
    role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, public;
grant select, insert, update on table public.profiles to authenticated;

create function if not exists public.set_profiles_updated_at()
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

drop trigger if exists set_profiles_updated_at on public.profiles;
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
            where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')
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
            where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')
        )
    )
    with check (
        exists (
            select 1
            from public.profiles p
            where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')
        )
    );

-- Example of promotion :
-- update public.profiles set is_admin = true, role = 'admin' where id = '<USER_UUID>';
