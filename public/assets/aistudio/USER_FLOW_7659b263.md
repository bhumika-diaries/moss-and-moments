# User Flows — Moss & Moments

## Primary organizer journey
Landing → Sign up / Sign in → Dashboard → Create event → Enter details → Save event → Open event workspace → Generate AI plan → Review/edit/save plan → Create tasks → Add expenses → Add guests → Review progress.

## Create event
1. Select “Create event”.
2. Enter event name and type (required).
3. Add date, location, estimated guests, budget, theme and notes.
4. Validate fields.
5. Save to database.
6. Navigate to event workspace and show confirmation.

## AI planning
1. Select an event or enter event details.
2. Submit prompt to secure backend.
3. Backend validates inputs and calls Gemini.
4. Return structured plan: summary, budget categories, checklist, timeline, ideas.
5. Show loading and error states.
6. User edits and saves selected items.
7. Saved tasks/plan appear in event workspace.

## Task flow
Create task → Set due date/priority → Save → Mark complete → Dashboard counts update.

## Expense flow
Select event → Add expense → Validate positive amount/category → Save → Recalculate total spent and remaining budget.

## Guest flow
Select event → Add guest → Set RSVP status → Save → Guest totals update.

## Key edge cases
- Empty event list.
- Missing required form values.
- Invalid date or negative budget/expense.
- AI timeout, quota or malformed response.
- No internet / backend unavailable.
- User attempts to access an event they do not own.
- Small mobile viewport.
