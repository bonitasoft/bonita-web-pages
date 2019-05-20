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

then('The user sees the list of resources', () => {
    cy.get('.app-item').should('have.length', 3);
})

given('The filter responses are defined for the type of resources', () => {
    cy.fixture('json/filteredResourcesByPage.json').as('filteredResourcesByPage');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/portal/page?p=0&c=999&f=contentType=page*',
        response: '@filteredResourcesByPage'
    }).as('filteredResourcesByPageRoute');
});

then('The {string} resource displays {string} as title', (resource,title) => {
    switch (resource) {
        case "first":
            cy.get('.itemName').eq(0).contains(title);
            break;
        case "second":
            cy.get('.itemName').eq(1).contains(title);
            break;
        case "third":
            cy.get('.itemName').eq(2).contains(title);
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
        case "third":
            cy.get('.itemDescription').eq(2).contains(description);
            break;
    }
});

then('The user sees the filter dropdown', () => {
    cy.get('pb-select select[name="pbSelect0"]').should('be.visible');
});

when('The user select {string} type', (type) => {
    cy.get('.form-control').eq(0).select(type);
});

 then('The user sees only the list of {string} type resources', () => {
    cy.wait('@filteredResourcesByPageRoute');
    cy.get('.itemName').should('have.length', 2);
    cy.get('.itemName').eq(0).contains("API extension viewer page");
     cy.get('.itemName').eq(1).contains("TESTTESTTESTTESTTESTTESTTESTTESTTEST");
 });

 then('The user won\'t be able to see the list of other type of resources', () => {
     cy.get('.itemName').contains('REST API extension example').should('not.exist');
 });


given('The sort responses are defined for the order of resources to be shown in the list', () => {
    cy.fixture('json/sortedResourcesByUpdatedDateDESC.json').as('sortedResourcesByUpdatedDateDESC');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/portal/page?p=0&c=999&o=lastUpdateDate%20DESC*',
        response: '@sortedResourcesByUpdatedDateDESC'
    }).as('sortedResourcesByUpdatedDateDESCRoute');
});

then('The user sees the sort by dropdown', () => {
    cy.get('select[name="pbSelect"]').should('be.visible');
});

when('The user select {string} option', (sorting) => {
    cy.get('pb-select select[name="pbSelect1"]').eq(0).select(sorting);
});
