const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const rolesUrl = 'API/identity/role?';
const defaultFilters = '&o=displayName ASC';
const defaultRequestUrl = urlPrefix + rolesUrl + 'c=20&p=0' + defaultFilters;

given("The response {string} is defined", (responseType) => {
    cy.viewport(1366, 768);
    cy.server();
    switch (responseType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'roles8Route', 'roles8');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl,'roles20Route', 'roles20');
            createRouteWithResponseAndPagination('', 'roles10Route', 'roles10', 2, 10);
            createRouteWithResponseAndPagination('', 'roles8Route', 'roles8', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl, 'roles20Route', 'roles20');
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'sort by':
            createRoute(rolesUrl + 'c=20&p=0&o=displayName+DESC', 'sortDisplayNameDescRoute');
            createRoute(rolesUrl + 'c=20&p=0&o=name+ASC', 'sortNameAscRoute');
            createRoute(rolesUrl + 'c=20&p=0&o=name+DESC', 'sortNameDescRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(urlSuffix, routeName) {
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix,
        }).as(routeName);
    }

    function createPostRoute(urlSuffix, routeName) {
        cy.route({
            method: 'POST',
            url: urlPrefix + urlSuffix,
            response: ""
        }).as(routeName);
    }

    function createRouteWithResponse(urlSuffix, routeName, response) {
        createRouteWithResponseAndMethod(urlSuffix, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(urlSuffix, routeName, response, method) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: urlSuffix,
            response: '@' + response
        }).as(routeName);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlSuffix,
            status: status,
            response: ''
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + rolesUrl + 'c=' + count + '&p=' + page + defaultFilters;
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

when("I visit the admin roles page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on Load more roles button", () => {
    cy.get('button').contains('Load more roles').click();
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Display name (Asc)':
                cy.get('select:visible').select('0');
                break;
            case 'Display name (Desc)':
                cy.get('select:visible').select('1');
                break;
            case 'Name (Asc)':
                cy.get('select:visible').select('2');
                break;
            case 'Name (Desc)':
                cy.get('select:visible').select('3');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }
});

then("The roles page have the correct information", () => {
    cy.contains('h3', 'Roles');
    cy.get('.role-item').should('have.length', 8);
    cy.get('.role-item').eq(0).contains('.item-label', 'Name');
    cy.get('.role-item').eq(0).contains('.item-value', 'member');
    cy.get('.role-item').eq(0).contains('.item-label', 'Display name');
    cy.get('.role-item').eq(0).contains('.item-value', 'Member');
    cy.get('.role-item').eq(0).contains('.item-label', 'Created on');
    cy.get('.role-item').eq(0).contains('.item-value', '3/20/20 8:58 AM');
    cy.get('.role-item').eq(0).contains('.item-label', 'Updated on');
    cy.get('.role-item').eq(0).contains('.item-value', '7/15/20 3:05 PM');
    cy.get('.role-item').eq(0).contains('.item-label', 'This is a description.');
    cy.get('.role-item').eq(0).get('.btn.btn-link .glyphicon-pencil');
    cy.get('.role-item').eq(0).get('.btn.btn-link .glyphicon-trash');
});

then("A list of {int} roles is displayed", (nbrOfItems) => {
    cy.get('.role-item:visible').should('have.length', nbrOfItems);
});

then("The load more roles button is disabled", () => {
    cy.get('button').contains('Load more roles').should('be.disabled');
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Display name (Asc)':
            cy.wait('@roles8Route');
            break;
        case 'Display name (Desc)':
            cy.wait('@sortDisplayNameDescRoute');
            break;
        case 'Name (Asc)':
            cy.wait('@sortNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortNameDescRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});
