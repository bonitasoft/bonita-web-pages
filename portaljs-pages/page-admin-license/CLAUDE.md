# Bonita Admin License

This page provides detailed information about subscription and licenses. It is dedicated to Platform Admin-like profiles.

- **Family:** PortalJS stub — `community/portaljs-pages/page-admin-license`
- **Page id:** `custompage_adminLicenseBonita`
- **Stub only — no business logic.** This page is a thin HTML wrapper that does a `window.location.replace()` to `/portal.js/#/...`. The real UI lives in the Portal.js app. Do not add logic here.

## Declared resources

The `resources` in `page.properties` authorize the REST calls the *target* portal page makes (missing = `403`). Keep them in sync with the portal page; don't call them from this stub.

| Method | Endpoint |
|---|---|
| GET | `system/i18ntranslation` |
| GET | `system/feature` |
| GET | `system/information` |
