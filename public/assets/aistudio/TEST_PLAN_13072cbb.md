# Test Plan — MVP

| ID | Test | Expected result |
|---|---|---|
| T01 | Open landing page | Page loads with no runtime error |
| T02 | Navigate to dashboard | Correct page opens |
| T03 | Submit empty create-event form | Required-field validation appears |
| T04 | Create valid event | Event appears in event list |
| T05 | Edit event | Updated values persist |
| T06 | Delete event | Event is removed after confirmation |
| T07 | Add task | Task appears in task list |
| T08 | Complete task | Status and dashboard count update |
| T09 | Add expense | Spent total and remaining budget recalculate |
| T10 | Enter negative expense | Validation rejects it |
| T11 | Add guest and RSVP | Guest count/status summary updates |
| T12 | Generate AI plan | Valid plan appears, or clear recoverable error |
| T13 | AI service unavailable | No crash; helpful error/demo fallback |
| T14 | Refresh page | Backend data persists; local demo mode is clearly labelled |
| T15 | Mobile viewport | No horizontal overflow; navigation usable |
| T16 | Unauthorized data access | User cannot read another user's records |

## Final checks
- Browser console: no critical errors.
- Network: no exposed secrets.
- Forms: labels, validation and feedback.
- Buttons: each performs its advertised action.
- Accessibility: keyboard focus visible; meaningful labels.
