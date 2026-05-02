-- Edificar - estrutura inicial completa para Supabase
-- Execute no SQL Editor do Supabase ou use `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  timezone text not null default 'America/Sao_Paulo',
  locale text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_enabled boolean not null default false,
  preferred_channel text not null default 'email' check (preferred_channel in ('email', 'whatsapp', 'ambos')),
  preferred_time time not null default '07:00',
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  title text not null,
  description text,
  bible_reference text,
  base_reflection text,
  base_question text,
  base_practice text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_generation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feature text not null check (feature in ('moment', 'daily', 'theme', 'system')),
  provider text not null default 'content_provider',
  model text not null,
  prompt_version text not null,
  input_text text,
  selected_theme text,
  output_json jsonb,
  status text not null default 'success' check (status in ('success', 'error')),
  error_message text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.moment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  ai_generation_id uuid references public.ai_generation_logs(id) on delete set null,
  input_text text,
  selected_theme text,
  detected_theme text,
  generated_title text,
  generated_introduction text,
  generated_reference text,
  generated_bible_passage text,
  generated_reflection text,
  generated_prayer text,
  generated_question text,
  generated_practice text,
  model text,
  prompt_version text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  whatsapp text,
  preferred_channel text not null default 'email' check (preferred_channel in ('email', 'whatsapp', 'ambos')),
  preferred_time time not null default '07:00',
  interests text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'paused', 'unsubscribed')),
  source text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists daily_subscribers_email_unique
  on public.daily_subscribers (lower(email));

create table if not exists public.daily_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references public.daily_subscribers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  ai_generation_id uuid references public.ai_generation_logs(id) on delete set null,
  channel text not null check (channel in ('email', 'whatsapp')),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'failed', 'cancelled')),
  content_json jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  donor_name text,
  donor_email text,
  amount numeric(10, 2) not null check (amount > 0),
  currency text not null default 'BRL',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  payment_provider text,
  provider_reference text,
  checkout_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibilidade para bancos que já receberam uma versão anterior do schema.
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists timezone text not null default 'America/Sao_Paulo';
alter table public.profiles add column if not exists locale text not null default 'pt-BR';
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.themes add column if not exists slug text;
alter table public.themes add column if not exists is_active boolean not null default true;
alter table public.themes add column if not exists sort_order integer not null default 0;
alter table public.themes add column if not exists updated_at timestamptz not null default now();
update public.themes
set slug = lower(regexp_replace(coalesce(title, id::text), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;
alter table public.themes alter column slug set not null;

alter table public.moment_requests add column if not exists ai_generation_id uuid references public.ai_generation_logs(id) on delete set null;
alter table public.moment_requests add column if not exists detected_theme text;
alter table public.moment_requests add column if not exists generated_introduction text;
alter table public.moment_requests add column if not exists generated_bible_passage text;
alter table public.moment_requests add column if not exists model text;
alter table public.moment_requests add column if not exists prompt_version text;

alter table public.daily_subscribers add column if not exists status text not null default 'active';
alter table public.daily_subscribers add column if not exists source text not null default 'web';
alter table public.daily_subscribers add column if not exists updated_at timestamptz not null default now();

alter table public.donations add column if not exists currency text not null default 'BRL';
alter table public.donations add column if not exists payment_provider text;
alter table public.donations add column if not exists provider_reference text;
alter table public.donations add column if not exists checkout_url text;
alter table public.donations add column if not exists updated_at timestamptz not null default now();

create index if not exists profiles_email_idx on public.profiles (lower(email));
create unique index if not exists themes_slug_unique on public.themes (slug);
create index if not exists themes_active_category_idx on public.themes (is_active, category, sort_order);
create index if not exists moment_requests_user_created_idx on public.moment_requests (user_id, created_at desc);
create index if not exists daily_subscribers_user_idx on public.daily_subscribers (user_id);
create index if not exists daily_deliveries_schedule_idx on public.daily_deliveries (status, scheduled_for);
create index if not exists donations_user_created_idx on public.donations (user_id, created_at desc);
create index if not exists ai_generation_logs_user_created_idx on public.ai_generation_logs (user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

drop trigger if exists themes_set_updated_at on public.themes;
create trigger themes_set_updated_at
  before update on public.themes
  for each row execute function public.set_updated_at();

drop trigger if exists daily_subscribers_set_updated_at on public.daily_subscribers;
create trigger daily_subscribers_set_updated_at
  before update on public.daily_subscribers
  for each row execute function public.set_updated_at();

drop trigger if exists daily_deliveries_set_updated_at on public.daily_deliveries;
create trigger daily_deliveries_set_updated_at
  before update on public.daily_deliveries
  for each row execute function public.set_updated_at();

drop trigger if exists donations_set_updated_at on public.donations;
create trigger donations_set_updated_at
  before update on public.donations
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.themes enable row level security;
alter table public.ai_generation_logs enable row level security;
alter table public.moment_requests enable row level security;
alter table public.daily_subscribers enable row level security;
alter table public.daily_deliveries enable row level security;
alter table public.donations enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "user_preferences_select_own" on public.user_preferences;
create policy "user_preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "user_preferences_insert_own" on public.user_preferences;
create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_preferences_update_own" on public.user_preferences;
create policy "user_preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "themes_select_active" on public.themes;
create policy "themes_select_active"
  on public.themes for select
  using (is_active = true);

drop policy if exists "ai_generation_logs_select_own" on public.ai_generation_logs;
create policy "ai_generation_logs_select_own"
  on public.ai_generation_logs for select
  using (auth.uid() = user_id);

drop policy if exists "ai_generation_logs_insert_own" on public.ai_generation_logs;
create policy "ai_generation_logs_insert_own"
  on public.ai_generation_logs for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "moment_requests_select_own" on public.moment_requests;
create policy "moment_requests_select_own"
  on public.moment_requests for select
  using (auth.uid() = user_id);

drop policy if exists "moment_requests_insert_own" on public.moment_requests;
create policy "moment_requests_insert_own"
  on public.moment_requests for insert
  with check (auth.uid() = user_id);

drop policy if exists "daily_subscribers_select_own" on public.daily_subscribers;
create policy "daily_subscribers_select_own"
  on public.daily_subscribers for select
  using (auth.uid() = user_id);

drop policy if exists "daily_subscribers_insert_own" on public.daily_subscribers;
create policy "daily_subscribers_insert_own"
  on public.daily_subscribers for insert
  with check (auth.uid() = user_id);

drop policy if exists "daily_subscribers_update_own" on public.daily_subscribers;
create policy "daily_subscribers_update_own"
  on public.daily_subscribers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "daily_deliveries_select_own" on public.daily_deliveries;
create policy "daily_deliveries_select_own"
  on public.daily_deliveries for select
  using (auth.uid() = user_id);

drop policy if exists "daily_deliveries_insert_own" on public.daily_deliveries;
create policy "daily_deliveries_insert_own"
  on public.daily_deliveries for insert
  with check (auth.uid() = user_id);

drop policy if exists "donations_select_own" on public.donations;
create policy "donations_select_own"
  on public.donations for select
  using (auth.uid() = user_id);

drop policy if exists "donations_insert_own" on public.donations;
create policy "donations_insert_own"
  on public.donations for insert
  with check (auth.uid() = user_id);

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
    set name = coalesce(excluded.name, public.profiles.name),
        email = excluded.email,
        updated_at = now();

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
