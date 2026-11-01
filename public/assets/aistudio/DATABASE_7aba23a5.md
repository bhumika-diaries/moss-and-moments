# Database Design — Supabase PostgreSQL

This is a proposed MVP schema. Create migrations before connecting UI modules.

## Tables

### profiles
- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `created_at timestamptz default now()`

### events
- `id uuid primary key default gen_random_uuid()`
- `owner_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`
- `event_type text not null`
- `event_date date`
- `location text`
- `guest_count integer default 0 check (guest_count >= 0)`
- `budget numeric(12,2) default 0 check (budget >= 0)`
- `theme text`
- `notes text`
- `status text default 'Planning'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### tasks
- `id uuid primary key default gen_random_uuid()`
- `event_id uuid not null references events(id) on delete cascade`
- `title text not null`
- `due_date date`
- `priority text default 'Medium'`
- `status text default 'Pending'`
- `created_at timestamptz default now()`

### expenses
- `id uuid primary key default gen_random_uuid()`
- `event_id uuid not null references events(id) on delete cascade`
- `category text not null`
- `description text`
- `amount numeric(12,2) not null check (amount >= 0)`
- `expense_date date default current_date`
- `created_at timestamptz default now()`

### guests
- `id uuid primary key default gen_random_uuid()`
- `event_id uuid not null references events(id) on delete cascade`
- `name text not null`
- `contact text`
- `rsvp_status text default 'Pending'`
- `created_at timestamptz default now()`

### ai_plans
- `id uuid primary key default gen_random_uuid()`
- `event_id uuid references events(id) on delete cascade`
- `owner_id uuid not null references auth.users(id) on delete cascade`
- `input jsonb not null`
- `output jsonb not null`
- `created_at timestamptz default now()`

## Relationships
- One auth user owns many events.
- One event has many tasks, expenses, guests and AI plans.
- All child records are accessed through an event the current user owns.

## Security / RLS
Enable RLS on every table.
- `events`: owner can select/insert/update/delete where `owner_id = auth.uid()`.
- Child tables: allow operations only when a parent event exists with `events.id = event_id` and `events.owner_id = auth.uid()`.
- `ai_plans`: restrict by `owner_id = auth.uid()` and event ownership.
Never put Supabase service-role credentials in frontend code. Test policies with two separate users before production.
