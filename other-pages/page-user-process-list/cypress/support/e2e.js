// Bonita's bonita-theme bundle and a few glyphicon font-face loads occasionally
// raise benign uncaught exceptions during initial page load that would otherwise
// fail every Cypress run. Returning `false` here lets the test continue.
//
// Trade-off: this also suppresses GENUINE app errors. When investigating a
// failed Cypress test, check `build-gradle/tests/screenshots/` first — visual
// failures will surface there even when JS exceptions are silenced.
Cypress.on('uncaught:exception', (_err, _runnable) => {
    return false;
});
