create table public.quiz_progress (
	user_id uuid primary key references auth.users (id) on delete cascade,
	quiz_count integer not null default 0 check (quiz_count >= 0),
	correct_count integer not null default 0 check (correct_count >= 0),
	answer_count integer not null default 0 check (answer_count >= correct_count),
	by_theme jsonb not null default '{}'::jsonb check (jsonb_typeof(by_theme) = 'object'),
	recent jsonb not null default '[]'::jsonb check (jsonb_typeof(recent) = 'array' and jsonb_array_length(recent) <= 4),
	updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

revoke all on table public.quiz_progress from anon, public;
grant select, insert, update on table public.quiz_progress to authenticated;

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