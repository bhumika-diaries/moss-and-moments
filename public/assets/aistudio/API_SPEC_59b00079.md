# API Specification — MVP

Prefer Supabase client operations for ordinary authenticated CRUD, protected by RLS. Use a server-side function for Gemini.

## POST `/functions/v1/generate-event-plan`
Purpose: generate an event plan.

Request JSON:
```json
{
  "eventType": "Birthday",
  "eventName": "Garden Birthday",
  "eventDate": "2026-12-12",
  "location": "Mumbai",
  "guestCount": 40,
  "budget": 25000,
  "theme": "woodland garden",
  "preferences": "vegetarian menu, simple decor"
}
```

Successful response JSON:
```json
{
  "summary": "A concise plan overview",
  "budgetBreakdown": [
    {"category": "Venue", "amount": 5000, "reason": "..." }
  ],
  "checklist": [
    {"title": "Confirm venue", "priority": "High", "daysBefore": 21}
  ],
  "timeline": [
    {"time": "17:00", "activity": "Guest arrival"}
  ],
  "ideas": ["..."]
}
```

## Error contract
Return appropriate HTTP status and JSON:
```json
{"error": {"code": "VALIDATION_ERROR", "message": "Guest count must be positive."}}
```
Handle unauthenticated requests, invalid inputs, rate limits, Gemini errors/timeouts and malformed model output. Validate/parse model output before returning it. Never expose API keys or raw internal stack traces.

## Data operations
Events, tasks, expenses and guests can use Supabase authenticated CRUD. Keep queries scoped to the current user and rely on RLS as the security boundary.

## Integration notes
- Gemini API key belongs in server environment secrets.
- Use structured JSON output where supported, but still validate server-side.
- Do not promise vendor discovery, map search, email delivery or payments until those integrations exist.
