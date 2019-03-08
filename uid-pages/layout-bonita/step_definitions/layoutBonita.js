const url = 'build/dist/resources/index.html';

when('I open the Bonita layout with the {string} application selected', () => {
    cy.server();
    cy.fixture('app1.json').as('app1');
    cy.fixture('pageList.json').as('pageList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application/*',
        response: '@app1',
    }).as('app1Route');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application-menu/**',
        response: '@pageList'
    }).as('pageListRoute');

    cy.visit(url);
});

then( 'The application displayName is {string}', (appName) => {
    cy.get('.navbar-brand').should('have.text', appName);
});

then('The page displayName is {string}', (pageName) => {
    cy.get('li.ng-scope > .ng-binding').should('have.text', pageName);
});
