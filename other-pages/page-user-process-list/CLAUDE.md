# Default process list

This page is dedicated to User-like profiles. It lists the processes a logged in user can start. A click on one process displays the process instantiation form. This page is developed in React; it can be exported to an IDE to be edited, but not in Bonita UI Designer.

- **Family:** Legacy other-page (**React 16**, maintenance only) — `community/other-pages/page-user-process-list`
- **id:** `custompage_processlistBonita`
- A Svelte 5 migration is in progress (PR #635). Until it lands, treat this as **maintenance only** — no new features.
- When the migration merges, the `frontend/*` Svelte rules apply (rescope their `paths:` to include this page).

## API endpoints

| Method | Endpoint |
|---|---|
| GET | `bpm/category` |
| GET | `bpm/process` |
| GET | `bpm/process/*/contract` |
| POST | `bpm/process/*/instantiation` |
| GET | `form/mapping` |
| GET | `system/session` |
| GET | `API/formsDocumentImage` |
| GET | `API/documentDownload` |
| POST | `API/formFileUpload` |
