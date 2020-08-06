const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const groupsUrl = 'API/identity/group';
const defaultFilters = '&o=displayName ASC';
const defaultRequestUrl = urlPrefix + groupsUrl + '?c=20&p=0' + defaultFilters;

given("The response {string} is defined", (responseType) => {
    cy.viewport(1366, 768);
    cy.server();
    switch (responseType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'groups8Route', 'groups8');
            break;
        case 'sort by':
            createRoute(groupsUrl + '?c=20&p=0&o=displayName+DESC', 'sortDisplayNameDescRoute');
            createRoute(groupsUrl + '?c=20&p=0&o=name+ASC', 'sortNameAscRoute');
            createRoute(groupsUrl + '?c=20&p=0&o=name+DESC', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Acme', 'searchAcmeRoute', 'groups1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl,'groups20Route', 'groups20');
            createRolesRouteWithResponseAndPagination('', 'groups10Route', 'groups10', 2, 10);
            createRolesRouteWithResponseAndPagination('', 'groups8Route', 'groups8', 3, 10);
            createRolesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl, 'groups20Route', 'groups20');
            createRolesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(urlSuffix, routeName) {
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix
        }).as(routeName);
    }

    function createRouteWithMethod(urlSuffix, routeName, method) {
        createRouteWithMethodAndStatus(urlSuffix, routeName, method, 200);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            response: "",
            status: status
        }).as(routeName);
    }

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: url,
            status: status,
            response: '@' + response
        }).as(routeName);
    }

    function createRolesRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + groupsUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

    function createUserRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + userUrl + '?c=' + count + '&p=' + page;
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

when("I visit the admin groups page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
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

    function searchForValue(filterValue) {
        cy.get('pb-input input:visible').type(filterValue);
    }

});

when("I erase the search filter", () => {
    cy.get('pb-input input:visible').clear();
});

when("I click on Load more groups button", () => {
    cy.get('button').contains('Load more groups').click();
});

then("The groups page have the correct information", () => {
    cy.contains('h3', 'Groups');
    cy.get('.group-item').should('have.length', 8);
    cy.get('.group-item').eq(0).contains('.item-label', 'Display name');
    cy.get('.group-item').eq(0).contains('.item-value', 'Acme');
    cy.get('.group-item').eq(0).contains('.item-label', 'Name');
    cy.get('.group-item').eq(0).contains('.item-value', 'acme');
    cy.get('.group-item').eq(0).contains('.item-label', 'Created on');
    cy.get('.group-item').eq(0).contains('.item-value', '7/31/20 11:34 AM');
    cy.get('.group-item').eq(0).contains('.item-label', 'Updated on');
    cy.get('.group-item').eq(0).contains('.item-value', '8/6/20 9:52 AM');
    cy.get('.group-item').eq(0).contains('.item-label', 'This group represents the acme department of the ACME organization');
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-th-list').should('have.attr', 'title', 'View sub-groups');;
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-user').should('have.attr', 'title', 'View users in the group');
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-pencil').should('have.attr', 'title', 'Edit group');;
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete group');;
    cy.contains('.item-label', 'Groups shown: 8');
});

then("A list of {int} groups is displayed", (nbrOfItems) => {
    cy.get('.group-item:visible').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Display name (Asc)':
            cy.wait('@groups8Route');
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
        case 'Acme':
            cy.wait('@searchAcmeRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No groups are available", () => {
    cy.get('.group-item:visible').should('have.length', 0);
    cy.contains('No groups to display').should('be.visible');
});

then("The load more groups button is disabled", () => {
    cy.get('button').contains('Load more groups').should('be.disabled');
});