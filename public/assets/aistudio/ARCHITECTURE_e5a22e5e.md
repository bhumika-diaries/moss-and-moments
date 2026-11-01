# Architecture — Moss & Moments

## MVP architecture
Browser (React + Vite)
→ UI components / pages / client-side validation
→ Supabase Auth + Supabase client
→ PostgreSQL with Row Level Security

AI path:
Browser AI Planner
→ authenticated server function
→ validate request + rate limit
→ Gemini API (server-side secret)
→ validate/normalize structured response
→ browser displays editable result
→ user chooses what to save to database

## Suggested source structure
```text
src/
  assets/
  components/
    common/
    layout/
    events/
    tasks/
    budget/
    guests/
    ai/
  pages/
  services/
    supabase.ts
    eventService.ts
    taskService.ts
    budgetService.ts
    guestService.ts
  hooks/
  utils/
  styles/
  App.tsx
  main.tsx
supabase/
  migrations/
  functions/
    generate-event-plan/
```

## Engineering principles
- Keep UI, data access and AI calls separate.
- Reuse components and design tokens.
- Validate on both client and server.
- Use database constraints and RLS.
- Keep secrets out of source control.
- Prefer small, testable modules.
- Never display fake success when a request fails.
- If using local demo data, label it as demo and explain that it is stored locally.
