// ***********************************************************
// This support file is processed and loaded automatically
// before your test files in Cypress 13.x
//
// This replaces the old cypress/support/index.js pattern
// ***********************************************************

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing tests on uncaught exceptions
    // that are not related to the test
    return false;
});
