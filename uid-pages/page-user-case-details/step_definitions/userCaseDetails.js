const url = 'build/dist/resources/index.html';

when('I visit the index page', () => {
    cy.visit(url);
});