# Bonita Admin Application Details

This page provides detailed information about an application. It is dedicated to Admin-like profiles. This page has not been created with the UI Designer  but it can still be used as a custom page in any application.

- **Family:** PortalJS stub — `community/portaljs-pages/page-admin-application-details`
- **Page id:** `custompage_adminApplicationDetailsBonita`
- **Stub only — no business logic.** This page is a thin HTML wrapper that does a `window.location.replace()` to `/portal.js/#/...`. The real UI lives in the Portal.js app. Do not add logic here.

## Declared resources

The `resources` in `page.properties` authorize the REST calls the *target* portal page makes (missing = `403`). Keep them in sync with the portal page; don't call them from this stub.

| Method | Endpoint |
|---|---|
| GET | `system/session` |
| GET | `system/feature` |
| GET | `system/i18ntranslation` |
| GET | `portal/profile` |
| GET | `identity/user` |
| GET | `portal/page` |
| GET / PUT | `living/application` |
| GET / POST / DELETE | `living/application-page` |
| GET / POST / PUT / DELETE | `living/application-menu` |
