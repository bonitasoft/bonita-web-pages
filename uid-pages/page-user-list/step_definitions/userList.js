const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&time=0';
const userUrl = 'API/identity/user?';
const defaultRequestUrl = urlPrefix + userUrl + 'c=20&p=0' + defaultFilters;
const enabledFilter = '&f=enabled=true';
const defaultSortOrder = '&o=lastname+ASC' + enabledFilter;

given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse(defaultSortOrder, 'usersRoute', 'users5');
            break;
        case 'sort by':
            createRoute('&o=firstname+ASC' + enabledFilter, 'sortByFirstNameAscRoute');
            createRoute('&o=firstname+DESC' + enabledFilter, 'sortByFirstNameDescRoute');
            createRoute('&o=lastname+DESC' + enabledFilter, 'sortByLastNameDescRoute');
            break;
        case 'search by':
            createRoute('&o=lastname+ASC&s=Walter' + enabledFilter, 'firstNameRoute');
            createRoute('&o=lastname+ASC&s=Bates' + enabledFilter, 'lastNameRoute');
            createRoute('&o=lastname+ASC&s=walter.bates' + enabledFilter, 'userNameRoute');
            createRouteWithResponse('&o=lastname+ASC&s=Search term with no match' + enabledFilter, 'emptyResultRoute', 'emptyResult');
            break;
        case 'show inactive':
            createRoute('&o=lastname+ASC&f=enabled=false', 'showInactiveRoute');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultSortOrder, 'users20Route', 'users20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10Route', 'users10', 2, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'users5Route', 'users5', 3, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultSortOrder, 'users20Route', 'users20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 2, 10);
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
        const loadMoreUrl = urlPrefix + userUrl + 'c=' + count + '&p=' + page + defaultFilters;
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

when('I visit the user list page', () => {
    cy.visit(url);
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'First name (Asc)':
                cy.get('select').eq(0).select('0');
                break;
            case 'First name (Desc)':
                cy.get('select').eq(0).select('1');
                break;
            case 'Last name (Asc)':
                cy.get('select').eq(0).select('2');
                break;
            case 'Last name (Desc)':
                cy.get('select').eq(0).select('3');
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

when("I filter show inactive users", () => {
    cy.get('input[value=inactive').click();
});

when("I click on Load more users button", () => {
    cy.get('button').contains('Load more users').click();
});

then("The users have the correct information", () => {
    cy.get('.user-item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.user-property-label').contains('First name');
        cy.get('.user-property-value').contains('Giovanna');
        cy.get('.user-property-label').contains('Last name');
        cy.get('.user-property-value').contains('Almeida');
        cy.get('.user-property-label').contains('Username');
        cy.get('.user-property-value').contains('giovanna.almeida');
        cy.get('.user-property-label').contains('Status');
        cy.get('.user-property-value').contains('active');
    });

    cy.get('.user-item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.user-property-label').contains('First name');
        cy.get('.user-property-value').contains('Daniela');
        cy.get('.user-property-label').contains('Last name');
        cy.get('.user-property-value').contains('Angelo');
        cy.get('.user-property-label').contains('Username');
        cy.get('.user-property-value').contains('daniela.angelo');
        cy.get('.user-property-label').contains('Status');
        cy.get('.user-property-value').contains('active');
    });

    cy.get('.user-item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.user-property-label').contains('First name');
        cy.get('.user-property-value').contains('Walter');
        cy.get('.user-property-label').contains('Last name');
        cy.get('.user-property-value').contains('Bates');
        cy.get('.user-property-label').contains('Username');
        cy.get('.user-property-value').contains('walter.bates');
        cy.get('.user-property-label').contains('Status');
        cy.get('.user-property-value').contains('active');
    });

    cy.get('.user-item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.user-property-label').contains('First name');
        cy.get('.user-property-value').contains('Isabel');
        cy.get('.user-property-label').contains('Last name');
        cy.get('.user-property-value').contains('Bleasdale');
        cy.get('.user-property-label').contains('Username');
        cy.get('.user-property-value').contains('isabel.bleasdale');
        cy.get('.user-property-label').contains('Status');
        cy.get('.user-property-value').contains('active');
    });

    cy.get('.user-item').eq(4).within(() => {
        cy.get('.user-property-label').contains('First name');
        cy.get('.user-property-value').contains('Jan');
        cy.get('.user-property-label').contains('Last name');
        cy.get('.user-property-value').contains('Fisher');
        cy.get('.user-property-label').contains('Username');
        cy.get('.user-property-value').contains('jan.fisher');
        cy.get('.user-property-label').contains('Status');
        cy.get('.user-property-value').contains('active');
    });
});

then("A list of {string} users is displayed", (nbrOfUsers) => {
    cy.get('.user-item').should('have.length', nbrOfUsers);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'First name (Asc)':
            cy.wait('@sortByFirstNameAscRoute');
            break;
        case 'First name (Desc)':
            cy.wait('@sortByFirstNameDescRoute');
            break;
        case 'Last name (Asc)':
            cy.wait('@usersRoute');
            break;
        case 'Last name (Desc)':
            cy.wait('@sortByLastNameDescRoute');
            break;
        case 'Walter':
            cy.wait('@firstNameRoute');
            break;
        case 'Bates':
            cy.wait('@lastNameRoute');
            break;
        case 'walter.bates':
            cy.wait('@userNameRoute');
            break;
        case 'show inactive':
            cy.wait('@showInactiveRoute');
            break;
    }
});

then("No users are available", () => {
    cy.get('.user-item').should('have.length', 0);
    cy.contains('No users to display').should('be.visible');
});

then("The Load more users button is disabled", () => {
    cy.get('button').contains('Load more users').should('be.disabled');
});