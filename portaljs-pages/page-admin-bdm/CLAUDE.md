# Bonita Admin BDM

This page provides information about BDM management. It is dedicated to Admin-like profiles.

- **Family:** PortalJS stub — `community/portaljs-pages/page-admin-bdm`
- **Page id:** `custompage_adminBDMBonita`
- **Stub only — no business logic.** This page is a thin HTML wrapper that does a `window.location.replace()` to `/portal.js/#/...`. The real UI lives in the Portal.js app. Do not add logic here.

## Declared resources

The `resources` in `page.properties` authorize the REST calls the *target* portal page makes (missing = `403`). Keep them in sync with the portal page; don't call them from this stub.

| Method | Endpoint |
|---|---|
| GET | `system/i18ntranslation` |
| GET | `system/log` |
| GET | `system/feature` |
| GET | `system/session` |
| GET | `system/maintenance` |
| GET / POST | `tenant/bdm` |
| GET / DELETE | `accessControl/bdm` |
| POST | `bdmAccessControl/install` |
| POST | `bdmAccessControl/validation` |
| GET | `bdm/businessData` |
| GET | `bdm/businessDataReference` |
| GET | `bdm/businessDataQuery` |
| GET | `identity/user` |
| GET | `portal/exportAccessControl` |
| POST | `portal/bdmUpload` |
| POST | `portal/bdmAccessControlUpload` |
