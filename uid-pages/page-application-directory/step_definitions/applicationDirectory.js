const urlPrefix = 'build/dist/';
const applicationUrl = 'API/living/application';
const session = 'API/system/session/unusedId';
const defaultFilters = '&d=profileId&d=createdBy&d=updatedBy&d=layoutId&f=userId=4';
const defaultRequestUrl = urlPrefix + applicationUrl + '?c=20&p=0' + defaultFilters;

given("The response {string} is defined", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'applications5Route', 'applications5');
            break;
        case 'session':
            createRouteWithResponse(urlPrefix + session, 'sessionRoute', 'session');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Bonita', 'applications1Route', 'applications1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'applications load more':
            createRouteWithResponse(defaultRequestUrl, 'applications20Route', 'applications20');
            createApplicationsRouteWithResponseAndPagination('', 'applications10Route', 'applications10', 2, 10);
            createApplicationsRouteWithResponseAndPagination('', 'applications5Route', 'applications5', 3, 10);
            createApplicationsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'applications 20 load more':
            createRouteWithResponse(defaultRequestUrl, 'applications20Route', 'applications20');
            createApplicationsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'applications 30 load more':
            createRouteWithResponse(defaultRequestUrl, 'applications20Route', 'applications20');
            createApplicationsRouteWithResponseAndPagination('', 'applications10Route', 'applications10', 2, 10);
            createApplicationsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'search during limitation':
            createRouteWithResponse(defaultRequestUrl + '&s=Bonita', 'applications20Route', 'applications20');
            createApplicationsRouteWithResponseAndPagination('&s=Bonita', 'applications10Route', 'applications10', 2, 10);
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

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            response: "",
            status: status
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

    function createApplicationsRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + applicationUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

    function createRouteWithResponseAndPagination(urlSuffix, queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + urlSuffix + '?p=' + page + '&c=' + count;
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

when("I visit the application directory page", () => {
    cy.visit(urlPrefix + 'resources/index.html');
});

when("I put {string} in search filter field", (filterValue) => {
    cy.get('pb-input input').type(filterValue);
});

when("I erase the search filter", () => {
    cy.get('pb-input input').clear();
});

when("I click on Load more applications button", () => {
    cy.get('button').contains('Load more applications').click();
});

then("The application directory page has the correct information", () => {
    cy.contains('h3', 'Application list');
    cy.contains('p', 'This is your catalog of applications; hover to get a description, click to access.');
    cy.get('.application-container').should('have.length', 5);
    cy.get('.application-container').eq(0).within(() => {
        cy.get('.icon-container img').should('be.visible').should('have.attr', 'src', '../API/applicationIcon/15');
        cy.contains('.application-title span', 'A10');
        cy.contains('.application-details p', '101.0').should('be.hidden');
        cy.contains('.application-details p', 'This is a sample description.').should('be.hidden');
    });
    cy.get('.application-container').eq(1).within(() => {
        cy.get('.icon-container img').should('be.visible').should('have.attr', 'src', '../theme/images/logo.png');
        cy.contains('.application-title span', 'A11');
        cy.contains('.application-details p', '1.0').should('be.hidden');
        cy.contains('.application-details p', 'No description').should('be.hidden');
    });
    cy.get('.application-container').eq(2).within(() => {
        cy.contains('.application-details.bg-primary p', 'UID allows to introspect your Business Data Model and simplify the retrieval of data by proposing an advanced wizard to generate a variable.').should('be.hidden');
        cy.contains('.application-details.bg-primary p', 'UID allows to introspect your Business').should('have.attr', 'title').and('include', 'It will also used later to interact with any data management related topics (e.g. BPM).');
        cy.get('.clickable-overlay a a').should('have.attr', 'title').and('include', 'UID allows to introspect your Business Data Model and simplify the retrieval of data by proposing an advanced wizard to generate a variable.');
        cy.get('.application-description').should('have.css', '-webkit-line-clamp', '5');
    });
    cy.contains('h4', 'No applications to display').should('not.exist');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.application-card').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Bonita':
            cy.wait('@applications1Route');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No applications are displayed", () => {
    cy.get('.application-card').should('have.length', 0);
    cy.contains('No applications to display').should('be.visible');
});

then("The load more applications button is disabled", () => {
    cy.get('button').contains('Load more applications').should('be.disabled');
});