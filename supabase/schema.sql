create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  whatsapp text,
  preferred_channel text not null default 'email',
  preferred_time time,
  interests text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.moment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  input_text text,
  selected_theme text,
  generated_title text,
  generated_reference text,
  generated_bible_passage text,
  generated_reflection text,
  generated_prayer text,
  generated_question text,
  generated_practice text,
  created_at timestamptz not null default now()
);

alter table public.moment_requests
  add column if not exists generated_bible_passage text;

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  donor_name text,
  donor_email text,
  amount numeric(10, 2) not null,
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  bible_reference text,
  base_reflection text,
  base_question text,
  base_practice text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.daily_subscribers enable row level security;
alter table public.moment_requests enable row level security;
alter table public.donations enable row level security;
alter table public.themes enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own daily subscriptions"
  on public.daily_subscribers for insert
  with check (auth.uid() = user_id);

create policy "Users can read own daily subscriptions"
  on public.daily_subscribers for select
  using (auth.uid() = user_id);

create policy "Users can insert own moment requests"
  on public.moment_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can read own moment requests"
  on public.moment_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own donations"
  on public.donations for insert
  with check (auth.uid() = user_id);

create policy "Users can read own donations"
  on public.donations for select
  using (auth.uid() = user_id);

create policy "Authenticated users can read themes"
  on public.themes for select
  using (auth.role() = 'authenticated');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email)
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
