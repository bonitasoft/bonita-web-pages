const url = 'build/dist/resources/index.html';

given('The user has resources', () => {
    cy.server();
    cy.fixture('json/resourceList.json').as('resourceList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/portal/page?*',
        response: '@resourceList'
    });
});

when('The user visits the resources page', () => {
    cy.visit(url);
})

then('The user see the list resources', () => {
    cy.get('.app-item').should('have.length', 2);
})

then('The {string} resource displays {string} as title', (resource,title) => {
    switch (resource) {
        case "first":
            cy.get('.itemName').eq(0).contains(title);
            break;
        case "second":
            cy.get('.itemName').eq(1).contains(title);
            break;
    }
})
then('The {string} resource displays {string} as description', (resource, description) => {
    switch (resource){
        case "first":
            cy.get('.itemDescription').eq(0).contains(description);
            break;
        case "second":
            cy.get('.itemDescription').eq(1).contains(description);
            break;
    }
})
