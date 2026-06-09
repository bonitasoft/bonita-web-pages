# Bonita Admin Process Details

This page provides detailed information about a process. It is dedicated to Admin-like profiles. This page has not been created with Bonita UI Designer but it can still be used as a custom page in any application.

- **Family:** PortalJS stub — `community/portaljs-pages/page-admin-process-details`
- **Page id:** `custompage_adminProcessDetailsBonita`
- **Stub only — no business logic.** This page is a thin HTML wrapper that does a `window.location.replace()` to `/portal.js/#/...`. The real UI lives in the Portal.js app. Do not add logic here.

## Declared resources

The `resources` in `page.properties` authorize the REST calls the *target* portal page makes (missing = `403`). Keep them in sync with the portal page; don't call them from this stub.

| Method | Endpoint |
|---|---|
| GET / PUT / DELETE | `bpm/process` |
| GET / PUT | `bpm/processConnector` |
| GET | `bpm/processConnectorDependency` |
| GET / POST / PUT / DELETE | `bpm/category` |
| POST / DELETE | `bpm/processCategory` |
| GET / PUT | `bpm/processParameter` |
| GET / POST / PUT / DELETE | `bpm/actorMember` |
| GET | `bpm/processResolutionProblem` |
| GET | `bpm/flowNode` |
| GET | `bpm/caseInfo` |
| GET | `bpm/archivedFlowNode` |
| GET / POST / DELETE | `bpm/processSupervisor` |
| GET / POST | `bpm/case` |
| GET | `bpm/case/*/context` |
| GET | `bpm/archivedCase` |
| POST | `bpm/process/importActors` |
| GET | `bpm/process/*/contract` |
| GET | `bpm/actor` |
| GET | `bpm/diagram` |
| POST | `bpm/process/*/instantiation` |
| GET | `system/session` |
| GET | `system/feature` |
| GET / PUT | `form/mapping` |
| POST | `API/formFileUpload` |
| GET | `identity/user` |
| GET | `identity/role` |
| GET | `identity/group` |
| GET | `identity/membership` |
| POST | `portal/actorsUpload` |
| POST | `portal/connectorImplementation` |
| POST | `portal/pageUpload` |
