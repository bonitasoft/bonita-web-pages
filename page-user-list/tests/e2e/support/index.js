// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

//Workaround to support fetch stubbing in Cypress
//https://github.com/cypress-io/cypress/issues/687
Cypress.on("window:before:load", win => {
    win.fetch = null;
  });

// Alternatively you can use CommonJS syntax:
// require('./commands')
