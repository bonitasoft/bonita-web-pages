const url = 'build/dist/resources/index.html';

given('No file is selected', () => {
    cy.get('.form-control').should('have.attr','placeholder','Click here to choose your .xml file');
});

when(`I\'m user with {string} bos_local`, (text) => {
    cy.setCookie('BOS_Locale', text);
});

when('I open the install-export organization page', () => {
    cy.server();
    cy.visit(url);
});

then('I can download the file', () => {
    cy.get('pb-link > .text-right > .ng-binding').should('have.attr', 'href', '../API/exportOrganization');
    cy.get('pb-link > .text-right > .ng-binding').should('have.attr', 'target', '_blank');
});

then('I see the "Incorrect extension" message', () => {
    cy.get('.form-control').should('have.attr','placeholder','Incorrect extension');
});

then('I see {string} label on the install button', (text) => {
    cy.get('pb-button > .text-right > .ng-binding').should('have.text', text);
});

then('I see {string} label on the export button', (text) => {
    cy.get('pb-link > .text-right > .ng-binding').should('have.text', text);
});

then('I see the "Install" button being disabled', () => {
    cy.get('pb-button > .text-right > .ng-binding').should('be.disabled');
});
