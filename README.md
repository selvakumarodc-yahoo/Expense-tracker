# Passbook Supabase Project

A separate static web project for Netlify hosting with Supabase authentication and cloud expense storage.

## What is included

- `index.html` — login/signup + expense tracker UI
- `supabase.sql` — schema reference for the `expenses` table
- `netlify.toml` — Netlify publish configuration

## Setup

1. Open `supabase-passbook/index.html`.
2. Replace the placeholder values:
   - `SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'`
   - `SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'`

## Supabase configuration

### Table
Use the following SQL in Supabase SQL editor if you haven't created the `expenses` table already:

```sql
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
```

### Authentication

1. In Supabase Dashboard, go to **Authentication > Settings**.
2. Enable **Email/Password** sign-up.
3. In **Authentication > Users**, confirm login is available.

### Row Level Security

Enable RLS for `expenses` and add this policy:

```sql
alter table public.expenses enable row level security;

create policy "Users can manage own expenses"
  on public.expenses
  for all
  using (auth.uid() = user_id);
```

## Deploy to Netlify

### Option 1: Git repository

1. Commit the `supabase-passbook` folder to your Git repository.
2. Create a new Netlify site and point the publish directory to `supabase-passbook`.
3. Set build command to blank.
4. Set publish directory to `supabase-passbook`.

### Option 2: Manual drag-and-drop

1. Build the folder locally (no build step required).
2. Drag the contents of `supabase-passbook` into Netlify Drop.

## Notes

- This new project uses Supabase Auth for secure login.
- It stores data in the `expenses` table and does not depend on browser localStorage.
- Your existing `users` table in Supabase is not required for this frontend.
- For best results, set up RLS policies in Supabase as shown above.
