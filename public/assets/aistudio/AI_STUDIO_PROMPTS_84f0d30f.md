# Google AI Studio — Copy/Paste Prompt Sequence

Use one prompt at a time. After each step, run the app and fix errors before continuing. Do not ask the model to rebuild the entire app at every step.

## Prompt 0 — Project constitution (send first)
You are a senior product engineer and UI/UX designer. Build **Moss & Moments**, a responsive GenAI-powered event planning web app. Treat the attached PRD.md, DESIGN.md, USER_FLOW.md, DATABASE.md and ARCHITECTURE.md as the source of truth. If any document is missing, ask before inventing major architecture.

Visual identity: whimsical woodland/cottagecore storybook, inspired by my Fig Ficus reference image. Palette: parchment #F4E8D9, cream #FFF8EF, wood #63463C, cocoa #392D29, sage #A6A98A, olive #777B59, mauve #B58D99, mushroom #D6BDA5. Use Cormorant Garamond headings and Nunito body text. The UI must be charming but readable and professional.

Engineering rules:
1. Inspect the existing project before changing files.
2. Preserve working code and dependencies; do not replace the stack without explaining why.
3. Build small modules and reusable components.
4. Every visible control must work; no fake buttons.
5. Implement validation, loading, empty and error states.
6. Never hardcode API secrets in browser code.
7. Do not claim a backend or AI integration works until tested.
8. After each task, list files changed, commands to run and manual tests.
9. Avoid unnecessary dependencies and oversized assets; submission repository must remain under 10 MB excluding GitHub-hosted video.
10. Prioritize the MVP in PRD.md over future features.

First inspect the repository and report the current stack, existing files, gaps and a short implementation plan. Do not start rewriting until the inspection is complete.

## Prompt 1 — Build the visual foundation
Implement the design system and responsive app shell from DESIGN.md. Create typography, color tokens, buttons, inputs, cards, badges, sidebar/top navigation and mobile navigation. Build a polished landing page and dashboard shell. Use lightweight CSS/SVG or CSS illustrations; avoid large image assets. Do not invent working data integrations. Use clearly labelled sample data only where needed for visual scaffolding. Ensure all links navigate to real pages or are removed. Run the build and fix errors.

## Prompt 2 — Core event CRUD
Implement event list, create-event form and event detail/workspace. Fields: event name, type, date, location, guest estimate, budget, theme, notes and status. Add client validation, edit/delete with confirmation, empty states and responsive layouts. First inspect the current data layer. Use the configured Supabase client if present; otherwise use a clearly labelled local demo repository with persistence and isolate it behind service functions so it can later be replaced. Do not mix demo and production data silently. Test create, read, update, delete and refresh persistence.

## Prompt 3 — Tasks, budget and guests
Implement task CRUD/completion, expense CRUD and calculations, and guest CRUD/RSVP statuses. Associate each record with an event. Derive dashboard counts from stored records, not hardcoded constants. Validate positive amounts and required names. Use service modules and keep components reusable. Add loading, empty and error states. Test each flow and refresh persistence.

## Prompt 4 — Gemini event planner
Implement the AI planner according to API_SPEC.md. Before coding, inspect whether a secure server-side Gemini function already exists. Never call Gemini with a secret embedded in frontend code. Validate input and output. Return structured JSON with summary, budgetBreakdown, checklist, timeline and ideas. Show loading, retry and error states. Let users edit results and explicitly save them. If secure AI credentials/backend are not configured, provide a clearly labelled demo sample plan and state how to configure the real integration; do not pretend the AI generated it.

## Prompt 5 — Polish and accessibility
Review every page at desktop and mobile widths. Fix overflow, contrast, keyboard focus, labels, modal behavior, empty/loading/error states and broken navigation. Ensure every visible button works. Remove unused dependencies and large assets. Do not add features outside the MVP. Run lint/build and report any remaining known limitations.

## Prompt 6 — Submission readiness
Prepare the project for a public GitHub repository under 10 MB. Check for secrets, `.env`, service-role keys, node_modules, dist, caches, large images and personal data. Ensure `.gitignore` and `.env.example` are correct. Update README with accurate setup steps, implemented features, limitations and demo link placeholder. Run a production build. Give exact GitHub push commands. Do not claim tests passed unless run.

## Prompt 7 — Demo preparation
Create a concise 3-minute-30-second walkthrough plan based only on features that actually work. Sequence: landing page (15 sec), dashboard (25 sec), create event (40 sec), AI planner (45 sec), tasks (30 sec), budget (30 sec), guests/RSVP (20 sec), responsive view and closing (15 sec). Replace any unavailable feature with an honest explanation; do not stage fake success.
