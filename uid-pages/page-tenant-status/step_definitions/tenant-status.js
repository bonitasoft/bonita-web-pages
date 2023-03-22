import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const url = 'build/dist/resources/index.html';

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given('Server tenant is running', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/tenant/unusedId?t=0', 'fixture:tenantRunning').as('tenant');
});

given('Server tenant is paused', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/tenant/unusedId?t=0', 'fixture:tenantPaused').as('tenant');
});

given('I\'m logged as technical user', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/session/unusedId', 'fixture:technicalUser').as('session');
});

given('The tenant status page can refresh', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/tenant/unusedId?t=1*', 'fixture:tenantPaused').as('tenantAfterRefresh');
});

given('The license information is defined', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/license/1', 'fixture:license').as('license');
});

when('I press the modal opening button', () => {
    cy.get('.ng-binding').click();
});

when('I press the status changing button', () => {
    cy.get('.text-right > .ng-binding').click();
    cy.visit(url);
});

when('I open tenant-status page', () => {
    cy.visit(url);
});

when('I press the "Cancel" button', () => {
    cy.get('.text-left > .ng-binding').click();
});

then('I\'m user with {string} bos_local', (text) => {
    cy.setCookie('BOS_Locale', text);
});

then('I see {string} button', (text) => {
    cy.wait(['@tenant', '@session']);
    cy.get('.ng-binding').should('have.text', text);
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
    cy.wait('@tenantAfterRefresh');
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