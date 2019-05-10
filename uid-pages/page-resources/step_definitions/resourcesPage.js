const url = 'build/dist/resources/index.html';

given('The user has resources', () => {
    cy.server();
    cy.fixture('json/resourceList.json').as('resourceList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/portal/page?p=0&c=999',
        response: '@resourceList'
    });
});

when('The user visits the resources page', () => {
    cy.visit(url);
})

then('The user see the list resources', () => {
    cy.get('.app-item').should('have.length', 2);
})