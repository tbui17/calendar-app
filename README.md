# Google Calendar Table

**[Website Link](https://calendar-app-xi.vercel.app/)**

**[Preview Link](https://calendar-app-xi.vercel.app/preview)**

**This application has not yet completed the the Google security verification process. Please use the preview link instead or use a dummy Google account.**

Feature-rich table allowing users to view and edit their Google Calendar events through the Google Calendar API.


## Features:

- Standard CRUD operations synchronizing with user's Google Calendar data
- Minimize API calls by tracking changes locally and only providing changed data upon synchronization
- Undo deleted events (before synchronization)
- OAuth sign in
- Manage both date and datetime events in one table
- Date/datetime editing widgets
- Toast notifications
    - Toast on server actions (fetching, mutations)
    - Promise-based toasts, allowing a loading toast to be shown while waiting for a server response. Indicates whether a group of requests were successful or not.
- Date input validation
    - Automatic input correction
    - Date range constraints (01/01/1900 - 01/01/2100)
    - Ensure end date is after start date, and vice versa
    - Allow user to edit date with keyboard while still validating input
- Built in AG-Grid Features: 
    - Movable columns
    - Sort
    - Advanced filter operators including contains/not contains/starts with/greater etc. and AND/OR


## Upcoming updates:
- Debug cause of production deployment failures in backend code to re-enable server-side OAuth flow, database access, and token refresh
- Submit application for Google security verification
- Show google tasks in sidebar
- Upgrade to Ag Grid Enterprise or replace with Prime React Table and implement:
    - Show/hide columns
    - Detailed edit view
    - Conditional row coloring based on event type
    - Recurring events
    - Save current table filters and sorting to user's profile
    - Right click context menu options
    - Keyboard shortcuts
- Create Electron desktop app version
