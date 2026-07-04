create extension if not exists "pgcrypto";

create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  description text not null,
  amount numeric(10,2) not null,
  category text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create index idx_expenses_user_id on expenses(user_id);
create index idx_expenses_date on expenses(date);

alter table public.expenses enable row level security;

create policy "Users can manage own expenses"
  on public.expenses
  for all
  using (auth.uid() = user_id);
