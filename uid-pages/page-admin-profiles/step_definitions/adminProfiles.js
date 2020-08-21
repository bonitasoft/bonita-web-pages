const urlPrefix = 'build/dist/';
const profilesUrl = 'API/portal/profile';
const defaultFilters = '&o=name ASC';
const defaultRequestUrl = urlPrefix + profilesUrl + '?c=20&p=0' + defaultFilters;

given("The response {string} is defined", (responseType) => {
    cy.viewport(1366, 768);
    cy.server();
    switch (responseType) {
        case 'refresh not called':
            cy.route({
                method: "GET",
                url: refreshUrl,
                    onRequest: () => {
                        throw new Error("This should have not been called");
                    }
            });
            break;
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'profiles8Route', 'profiles8');
            break;
        case 'sort by':
            createRoute(profilesUrl + '?c=20&p=0&o=name+ASC', 'sortNameAscRoute');
            createRoute(profilesUrl + '?c=20&p=0&o=name+DESC', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Administrator', 'searchAdministratorRoute', 'profiles1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'profiles load more':
            createRouteWithResponse(defaultRequestUrl,'profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'profiles10Route', 'profiles10', 2, 10);
            createProfilesRouteWithResponseAndPagination('', 'profiles8Route', 'profiles8', 3, 10);
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'profiles 20 load more':
            createRouteWithResponse(defaultRequestUrl, 'profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'profiles 30 load more':
            createRouteWithResponse(defaultRequestUrl, 'profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'profiles10Route', 'profiles10', 2, 10);
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + profilesUrl + '?c=20&p=0&o=name+DESC', 'sortDisplayNameDescRoute', 'profiles20');
            createRouteWithResponse(urlPrefix + profilesUrl + '?c=10&p=2&o=name+DESC', 'sortDisplayNameDescRoute2', 'profiles10');
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

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
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

    function createProfilesRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + profilesUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

when("I visit the admin profiles page", () => {
    cy.visit(urlPrefix + 'resources/index.html');
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
            case 'Name (Asc)':
                cy.get('select').select('0');
                break;
            case 'Name (Desc)':
                cy.get('select').select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input').type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input').clear();
});

when("I click on Load more profiles button", () => {
    cy.get('button').contains('Load more profiles').click();
});

then("The profiles page has the correct information", () => {
    cy.contains('h3', 'Profiles');
    cy.get('.profile-item').should('have.length', 8);
    cy.get('.profile-item').eq(0).within(() => {
        cy.contains('.item-label', 'Name');
        cy.contains('.item-value', 'aaa');
        cy.contains('.item-label', 'Created on');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-label', 'Updated on');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-label', 'No description');
        cy.get('.btn.btn-link .glyphicon-option-horizontal').should('have.attr', 'title', 'View profile details');
        cy.get('.btn.btn-link .glyphicon-export').should('have.attr', 'title', 'Export profile');
        cy.get('.btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete profile');
        cy.get('.is-provided-icon').should('not.be.visible');
    });
    cy.get('.profile-item').eq(1).within(() => {
        cy.contains('.item-label', 'Name');
        cy.contains('.item-value', 'Administrator');
        cy.get('.is-provided-icon').should('be.visible');
        cy.get('.btn.btn-link .glyphicon-trash').should('not.be.enabled');
    });
    cy.contains('.item-label', 'Profiles shown: 8');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.profile-item').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Name (Asc)':
            cy.wait('@sortNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortNameDescRoute');
            break;
        case 'Administrator':
            cy.wait('@searchAdministratorRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No profiles are displayed", () => {
    cy.get('.profiles-item:visible').should('have.length', 0);
    cy.contains('No profiles to display').should('be.visible');
});

then("The load more profiles button is disabled", () => {
    cy.get('button').contains('Load more profiles').should('be.disabled');
});