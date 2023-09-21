import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const buildDir = Cypress.env('BUILD_DIR');
const url = `${buildDir}/resources/index.html`;

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given('Maintenance mode is disabled', () => {
    cy.server();
    cy.route('GET', `${buildDir}/API/system/maintenance?t=0`, 'fixture:maintenanceModeDisabled').as('maintenance');
});

given('Maintenance mode is enabled', () => {
    cy.server();
    cy.route('GET', `${buildDir}/API/system/maintenance?t=0`, 'fixture:maintenanceModeEnabled').as('maintenance');
});

given('I\'m logged as technical user', () => {
    cy.server();
    cy.route('GET', `${buildDir}/API/system/session/unusedId`, 'fixture:technicalUser').as('session');
});

given('The tenant status page can refresh', () => {
    cy.server();
    cy.route('PUT', `${buildDir}/API/system/maintenance`, 'fixture:maintenanceModeEnabled').as('enableMaintenance')
    cy.route('GET', `${buildDir}/API/system/maintenance?t=1*`, 'fixture:maintenanceModeEnabled').as('platformStateAfterRefresh');
});

given('The tenant status page can refresh after maintenance message enabled', () => {
    cy.server();
    cy.route('PUT', `${buildDir}/API/system/maintenance`, 'fixture:maintenanceModeDisabled-msgEnabled').as('enableMaintenanceMsg')
    cy.route('GET', `${buildDir}/API/system/maintenance?t=1*`, 'fixture:maintenanceModeDisabled-msgEnabled').as('platformStateAfterRefresh');
});

given('The tenant status page can refresh after maintenance message updated', () => {
    cy.server();
    cy.route('PUT', `${buildDir}/API/system/maintenance`, 'fixture:maintenanceModeDisabled-msgUpdated').as('updateMaintenanceMsg')
    cy.route('GET', `${buildDir}/API/system/maintenance?t=1*`, 'fixture:maintenanceModeDisabled-msgUpdated').as('platformStateAfterRefresh');
});

given('The license information is defined', () => {
    cy.server();
    cy.route('GET', `${buildDir}/API/system/license/1`, 'fixture:license').as('license');
});

when('I press the modal opening button', () => {
    cy.get('.ng-binding').click();
});

when('I click on {string} button', (btnName) => {
    cy.contains('button.btn-primary', btnName).click();
});

when('I press the status changing button', () => {
    cy.get('.modal-footer button.btn-primary').click();
    cy.visit(url);
});

when('I open platform-maintenance page', () => {
    cy.visit(url);
});

when('I press the "Cancel" button', () => {
    cy.get('.text-left > .ng-binding').click();
});

then('I\'m user with {string} bos_local', (text) => {
    cy.setCookie('BOS_Locale', text);
});

then('I see {string} button', (text) => {
    cy.wait(['@maintenance', '@session']);
    cy.contains('button.btn-primary', text).should('be.visible');
});

then('I see a modal that opened', () => {
    cy.get('#modal-body').invoke('show');
});

then('The modal closes afterwards', () => {
   cy.get('.text-left > .ng-binding').click();
});

then('The modal is closed', () => {
    cy.get('#modal-body').should('not.exist');
});

then('There is an API call for refreshing the page', () => {
    cy.wait('@platformStateAfterRefresh');
});

then('I see the license information is displayed correctly', () => {
    cy.get('.panel').eq(0).within(() => {
        cy.contains('label', 'Version (Build Id):').should('be.visible');
        cy.contains('p', '7.8.0-SNAPSHOT').should('be.visible');
        cy.contains('label', 'Edition:').should('be.visible');
        cy.contains('p', 'Performance').should('be.visible');
        cy.contains('label', 'License expiration date:').should('be.visible');
        cy.contains('p', '7/28/21 12:00 AM').should('be.visible');

    });
});

then('I see the license information is displayed correctly for the community edition', () => {
    cy.get('.panel').eq(0).within(() => {
        cy.contains('label', 'Version (Build Id):').should('be.visible');
        cy.contains('p', '7.8.0-SNAPSHOT').should('be.visible');
        cy.contains('label', 'Edition:').should('be.visible');
        cy.contains('p', 'Community').should('be.visible');
        cy.contains('label', 'License expiration date:').should('not.exist');
        cy.contains('p', '7/28/21 12:00 AM').should('not.exist');

    });
});

then('The platform maintenance section is displayed correctly', () => {
    cy.wait(['@maintenance', '@session']);
    cy.contains('h4', 'Platform Maintenance').should('be.visible');
    cy.get('.platform-icon img').eq(0).should('have.attr', 'alt', 'Maintenance scheduled image');
    cy.contains('label', 'Display message to users').should('be.visible');
    cy.get('.input-display-message input[type="checkbox"]').should('not.be.checked');
    cy.contains('label', 'Scheduled maintenance message').should('be.visible');
    cy.get('textarea').should('have.value', 'maintenance msg');
    cy.contains('p', 'The message specified here will be visible to users who are logged in. It should provide information about the scheduled maintenance time and the details of the updates.').should('be.visible');
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
});

then('The platform maintenance message is enabled correctly', () => {
    cy.wait(['@maintenance', '@session']);
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
    cy.get('.input-display-message input[type="checkbox"]').check();
    cy.contains('button.btn-primary', 'Update').click();
    cy.wait(['@enableMaintenanceMsg', '@platformStateAfterRefresh']);
    cy.contains('p', 'Maintenance scheduled message successfully updated.');
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
});

then('Display Error when The platform maintenance message cannot be enabled', () => {
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
    cy.get('.input-display-message input[type="checkbox"]').check();
    cy.contains('button.btn-primary', 'Update').click();
    cy.contains('p', 'Maintenance scheduled message has not been updated, check the log.');
});

then('The platform maintenance message is updated correctly', () => {
    cy.wait(['@maintenance', '@session']);
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
    cy.get('textarea').type(' updated');
    cy.contains('button.btn-primary', 'Update').click();
    cy.wait(['@updateMaintenanceMsg', '@platformStateAfterRefresh']);
    cy.contains('p', 'Maintenance scheduled message successfully updated.');
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
});

then('Display Error when The platform maintenance message cannot be updated', () => {
    cy.contains('button.btn-primary', 'Update').should('be.disabled');
    cy.get('textarea').type(' updated');
    cy.contains('button.btn-primary', 'Update').click();
    cy.contains('p', 'Maintenance scheduled message has not been updated, check the log.');
});