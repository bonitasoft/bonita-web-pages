const url = 'build/dist/resources/index.html';

given('Server tenant is running', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/tenant/*', 'fixture:tenantRunning').as('tenant');
});

given('Server tenant is paused', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/tenant/*', 'fixture:tenantPaused').as('tenant');
});

given('I\'m logged as technical user', () => {
    cy.server();
    cy.route('GET', 'build/dist/API/system/session/unusedId', 'fixture:technicalUser').as('session');
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