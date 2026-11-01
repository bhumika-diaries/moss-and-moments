# Moss & Moments — Product Requirements Document
**Version:** 1.0 | **Status:** MVP | **Product:** GenAI-powered event planning web app

## 1. Product summary
Moss & Moments helps individuals and small teams plan celebrations in one place. Users can create events, organize tasks, track budgets and guests, and use an AI assistant to generate a practical starting plan.

**Tagline:** Little details. Beautifully planned moments.

## 2. Problem
Event planning is fragmented across notes, spreadsheets, chats and separate services. Organizers struggle to estimate costs, remember deadlines, coordinate people and turn broad ideas into actionable plans.

## 3. Target users
- Individuals and families planning birthdays, weddings, anniversaries and dinners.
- Students and community organizers planning festivals and gatherings.
- Beginner event planners and small planning teams.

## 4. MVP objectives
1. Let users create and manage events.
2. Generate a useful event plan from user-provided details using GenAI (or a clearly labelled demo fallback).
3. Let users create and complete planning tasks.
4. Track budget, expenses and remaining balance.
5. Track a basic guest list and RSVP status.
6. Present all key information in a responsive, cohesive dashboard.

## 5. Roles
- **Organizer:** creates events and manages their event data.
- **Collaborator (future / optional MVP):** helps with assigned tasks.
- **Administrator (future):** manages platform-level users and listings.

For the MVP, implement one authenticated organizer role unless time permits more.

## 6. MVP features and acceptance criteria
### 6.1 Landing page
- Explains the product and its main benefits.
- Has working navigation/CTA to the app or sign-in.
- Matches the woodland storybook visual direction.

### 6.2 Authentication
- Sign up, sign in and sign out if a backend is configured.
- Protect private pages.
- If authentication cannot be completed before submission, use a clearly identified demo mode; never imply demo data is securely account-specific.

### 6.3 Events
- Create, view, edit and delete an event.
- Fields: name, type, date, venue/location, guest estimate, budget, theme and notes.
- Show event status and upcoming events.

### 6.4 AI event planner
- Inputs: event type, date, location, guest count, budget, theme and preferences.
- Output: summary, suggested budget breakdown, preparation checklist, event-day timeline and creative ideas.
- Let users edit and save generated output.
- Validate and handle empty input, loading and API errors.
- Call Gemini only from a secure server-side function. If unavailable, provide a clearly labelled sample/demo plan.

### 6.5 Tasks
- Add, edit, delete and complete tasks.
- Fields: title, due date, priority, status and event association.
- Show pending and completed counts.

### 6.6 Budget
- Set an event budget.
- Add expenses with category, amount, date and description.
- Calculate total spent and remaining amount from saved records.
- Display estimated versus actual spend.

### 6.7 Guests
- Add and remove guests.
- Store name and RSVP status (Pending, Accepted, Declined).
- Show totals by status.

## 7. Pages and navigation
- `/` Landing
- `/login` and `/signup` Authentication
- `/dashboard` Overview
- `/events` Event list
- `/events/:id` Event workspace
- `/planner` AI planner
- `/tasks` Task manager
- `/budget` Budget tracker
- `/guests` Guest list
- `/settings` Basic settings (optional)

Use a consistent sidebar or top navigation, with clear active states and a mobile menu.

## 8. Frontend requirements
Suggested stack: React + Vite + TypeScript (or JavaScript if faster) + CSS/Tailwind + Lucide icons.
- Responsive desktop and mobile layouts.
- Reusable components and consistent spacing.
- Form validation and accessible labels.
- Loading, empty, success and error states.
- Search/filter where useful.
- Charts only when based on real app data.
- No dead buttons or placeholder links presented as working features.

## 9. Backend requirements
Recommended: Supabase Auth + PostgreSQL + Storage, with Edge Functions or a secure server endpoint for Gemini.
- Validate every write server-side/database-side.
- Enforce ownership and access with Row Level Security.
- Keep API keys in server environment variables.
- Return structured errors; do not expose secrets in client bundles.

## 10. Database requirements
Suggested tables:
- `profiles`: user profile; `id` references auth user.
- `events`: owner, name, type, date, location, guest estimate, budget, theme, notes, status.
- `tasks`: event, title, due date, priority, status.
- `expenses`: event, category, description, amount, date.
- `guests`: event, name, email/phone optional, RSVP status.
- `ai_plans`: event, prompt inputs, generated JSON/text, created timestamp.
Use UUID primary keys, foreign keys, timestamps and indexes. Add RLS so users only access events they own and related records.

## 11. API integrations
- **Gemini API:** event plan and idea generation. Use server-side only.
- **Supabase:** authentication, database and optional image storage.
- Optional later: email delivery, maps, calendar export and image generation. Do not make optional integrations blockers for MVP.

## 12. Design references
Primary visual reference: the supplied Fig Ficus image. The other references inform information architecture and event-management functionality.

**Direction:** whimsical woodland / cottagecore / vintage storybook, but readable and professional.
- Parchment `#F4E8D9`
- Cream `#FFF8EF`
- Wood brown `#63463C`
- Dark cocoa `#392D29`
- Muted sage `#A6A98A`
- Olive `#777B59`
- Dusty mauve `#B58D99`
- Mushroom beige `#D6BDA5`

Suggested fonts: Cormorant Garamond for display headings, Nunito for body, Caveat only for small decorative accents. Use subtle mushroom/leaf/flower illustrations, hand-drawn borders, paper textures and restrained shadows. Ensure text contrast and responsive usability.

## 13. Deployment
- Source control: public GitHub repository.
- Frontend: Vercel or another static hosting provider.
- Backend: Supabase.
- Configure production environment variables in hosting dashboard.
- Verify build, routes, auth, RLS, AI function and mobile layout.
- Never commit `.env`, API keys, service-role keys, credentials or private user data.

## 14. Out of scope for MVP
Vendor marketplace, payments, complex team permissions, real-time chat, automated email campaigns, image generation, advanced analytics and full calendar synchronization.

## 15. Definition of done
A user can open the app, navigate the core pages, create an event, save and manage tasks, record expenses, manage guests, and generate or view a clearly identified AI/demo plan. Data persists using the configured backend or is honestly labelled as local demo data. No critical console/runtime errors. Repository is public and under the submission size limit.
