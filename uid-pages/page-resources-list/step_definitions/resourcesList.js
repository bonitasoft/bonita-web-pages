const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=updatedBy&f=isHidden=false';
const resourceUrl = 'API/portal/page?';
const defaultRequestUrl = urlPrefix + resourceUrl + 'c=20&p=0' + defaultFilters;

given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse('', 'resourcesRoute', 'resources5');
            break;
        case 'hide provided resources':
            createRoute('&f=isProvided=false', 'isNotProvidedRoute');
            break;
        case 'content type':
            createRoute('&f=contentType=page', 'resourcesPagesRoute');
            createRouteWithResponse('&f=contentType=layout', 'emptyResultRoute', 'emptyResult');
            break;
        case 'sort by':
            createRoute('&o=displayName+ASC', 'sortByNameAscRoute');
            createRoute('&o=displayName+DESC', 'sortByNameDescRoute');
            createRoute('&o=lastUpdateDate+ASC', 'sortByUpdateDateAscRoute');
            createRoute('&o=lastUpdateDate+DESC', 'sortByUpdateDateDescRoute');
            break;
        case 'search by name':
            createRoute('&s=ApplicationHomeBonita', 'searchRoute');
            createRouteWithResponse('&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponse('', 'resources20Route', 'resources20');
            createRouteWithResponseAndPagination('', 'resources10Route', 'resources10', 2, 10);
            createRouteWithResponseAndPagination('', 'resources5Route', 'resources5', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse('', 'resources20Route', 'resources20');
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
        }).as(routeName);
    }

    function createRouteWithResponse(queryParameter, routeName, response) {
        createRouteWithResponseAndPagination(queryParameter, routeName, response, 0, 20);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + resourceUrl + 'c=' + count + '&p=' + page + defaultFilters;
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: loadMoreUrl + queryParameter,
            response: responseValue
        }).as(routeName);
    }
});

when("I visit the index page", () => {
    cy.visit(url);
});

when("I visit the resources list page", () => {
    cy.visit(url);
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'content type':
            selectFilterContentTypeOption(filterValue);
            break;
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
    }

    function selectFilterContentTypeOption(filterValue) {
        switch (filterValue) {
            case 'All resources':
                cy.get('select').eq(0).select('0');
                cy.wait('@resourcesRoute');
                break;
            case 'Pages':
                cy.get('select').eq(0).select('1');
                break;
            case 'Layouts':
                cy.get('select').eq(0).select('3');
                break;
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Resource name (Asc)':
                cy.get('select').eq(1).select('0');
                break;
            case 'Resource name (Desc)':
                cy.get('select').eq(1).select('1');
                break;
            case 'Updated - newest first':
                cy.get('select').eq(1).select('2');
                break;
            case 'Updated - oldest first':
                cy.get('select').eq(1).select('3');
                break;
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input').type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input').clear();
});

when("I filter hide provided resources", () => {
    cy.get('.checkbox').click();
});

when("I click on Load more resources button", () => {
    cy.get('button').contains('Load more resources').click();
});

when("I click on install button in the page", () => {
        cy.get('button').contains('Install').click();
});

when("I click on close button in the modal", () => {
    cy.get('button').contains('Close').click();
});

then("The resources have the correct information", () => {
    cy.get('.resource-item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.resource-property-label').contains('Resource name');
        cy.get('.resource-property-value').contains('Page 1');
        cy.get('.resource-property-label').contains('Type');
        cy.get('.resource-property-value').contains('Pages');
        cy.get('.resource-property-label').contains('Updated by');
        cy.get('.resource-property-value').contains('Walter Bates');
        cy.get('.resource-property-label').contains('Updated on');
        cy.get('.resource-property-value').contains('12/10/19 2:00 PM');
    });

    cy.get('.resource-item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.resource-property-label').contains('Resource name');
        cy.get('.resource-property-value').contains('Page 2');
        cy.get('.resource-property-label').contains('Type');
        cy.get('.resource-property-value').contains('Pages');
        cy.get('.resource-property-label').contains('Updated by');
        cy.get('.resource-property-value').contains('helen.kelly');
        cy.get('.resource-property-label').contains('Updated on');
        cy.get('.resource-property-value').contains('12/10/19 11:29 AM');
    });

    cy.get('.resource-item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.resource-property-label').contains('Resource name');
        cy.get('.resource-property-value').contains('Page 3');
        cy.get('.resource-property-label').contains('Type');
        cy.get('.resource-property-value').contains('Pages');
        cy.get('.resource-property-label').contains('Updated by');
        cy.get('.resource-property-value').contains('System');
        cy.get('.resource-property-label').contains('Updated on');
        cy.get('.resource-property-value').contains('12/10/19 11:29 AM');
    });

    cy.get('.resource-item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.resource-property-label').contains('Resource name');
        cy.get('.resource-property-value').contains('Page 4');
        cy.get('.resource-property-label').contains('Type');
        cy.get('.resource-property-value').contains('Pages');
        cy.get('.resource-property-label').contains('Updated by');
        cy.get('.resource-property-value').contains('thomas.wallis');
        cy.get('.resource-property-label').contains('Updated on');
        cy.get('.resource-property-value').contains('12/10/19 11:28 AM');
    });

    cy.get('.resource-item').eq(4).within(() => {
        cy.get('.resource-property-label').contains('Resource name');
        cy.get('.resource-property-value').contains('Theme 1');
        cy.get('.resource-property-label').contains('Type');
        cy.get('.resource-property-value').contains('Themes');
        cy.get('.resource-property-label').contains('Updated by');
        cy.get('.resource-property-value').contains('william.jobs');
        cy.get('.resource-property-label').contains('Updated on');
        cy.get('.resource-property-value').contains('12/10/19 11:27 AM');
    });
});

then("A list of {string} resources is displayed", (nbrOfResources) => {
    cy.get('.resource-item').should('have.length', nbrOfResources);
});

then("I see only the filtered resources by {string}", (filterType) => {
    switch (filterType) {
        case 'content type':
            cy.wait('@resourcesPagesRoute');
            cy.get('.resource-item').eq(0).within(() => {
                cy.get('.resource-property-value').contains('Page 1');
            });

            cy.get('.resource-item').eq(1).within(() => {
                cy.get('.resource-property-value').contains('Page 2');
            });

            cy.get('.resource-item').eq(2).within(() => {
                cy.get('.resource-property-value').contains('Page 3');
            });

            cy.get('.resource-item').eq(3).within(() => {
                cy.get('.resource-property-value').contains('Page 4');
            });
            break;

        case 'started by me':
            cy.get('.case-item:visible').eq(0).within(() => {
                cy.get('.case-property-value').contains('32001');
                cy.get('.case-property-value').contains('Another My Pool (1.0)');
            });

            cy.get('.case-item:visible').eq(1).within(() => {
                cy.get('.case-property-value').contains('22001');
                cy.get('.case-property-value').contains('Another My Pool (1.0)');
            });

            cy.get('.case-item:visible').eq(2).within(() => {
                cy.get('.case-property-value').contains('12001');
                cy.get('.case-property-value').contains('Another My Pool (1.0)');
            });

            cy.get('.case-item:visible').eq(3).within(() => {
                cy.get('.case-property-value').contains('8008');
                cy.get('.case-property-value').contains('Pool3');
            });
            break;
    }
});

then("No resources are available", () => {
    cy.get('.resource-item').should('have.length', 0);
    cy.contains('No resources to display').should('be.visible');
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Updated - newest first':
            cy.wait('@sortByUpdateDateDescRoute');
            break;
        case 'Updated - oldest first':
            cy.wait('@sortByUpdateDateAscRoute');
            break;
        case 'Resource name (Asc)':
            cy.wait('@sortByNameAscRoute');
            break;
        case 'Resource name (Desc)':
            cy.wait('@sortByNameDescRoute');
            break;
        case 'ApplicationHomeBonita':
            cy.wait('@searchRoute');
            break;
        case 'Pages':
            cy.wait('@resourcesPagesRoute');
            break;
        case 'hide provided resources':
            cy.wait('@isNotProvidedRoute');
            break;
    }
});

then("The Load more resources button is disabled", () => {
    cy.get('button').contains('Load more resources').should('be.disabled');
});

then("The modal install button is disabled",() => {
    cy.get('.modal-footer button').contains('Install').should('be.disabled');
});

then("The modal is closed",() => {
    cy.get('.modal').should('not.visible');
});
