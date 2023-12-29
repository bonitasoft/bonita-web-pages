import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&time=0';
const userUrl = 'API/identity/user?';
const defaultRequestUrl = urlPrefix + userUrl + 'c=10&p=0' + defaultFilters;
const enabledFilter = '&f=enabled=true';
const defaultSortOrder = '&o=lastname+ASC' + enabledFilter;

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter with headers":
            createRouteWithResponseAndHeaders(defaultSortOrder, 'usersRoute', 'users5', {'content-range': '0-4/5'});
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
            createRoute('&o=lastname+ASC&s=&Speci@l' + enabledFilter, '&Speci@lRoute');
            createRouteWithResponse('&o=lastname+ASC&s=Search term with no match' + enabledFilter, 'emptyResultRoute', 'emptyResult');
            break;
        case 'user search during limitation':
            createRouteWithResponseAndHeaders('&o=lastname+ASC&s=Walter' + enabledFilter, 'firstNameRoute', 'users10', {'content-range': '0-9/10'});
            createRouteWithResponseAndPagination('&o=lastname+ASC&s=Walter' + enabledFilter, 'users10Route', 'users10', 1, 10);
            createRouteWithResponseAndPagination('&o=lastname+ASC&s=Walter' + enabledFilter, 'users10Route', 'users10', 2, 10);
            break;
        case 'show inactive':
            createRoute('&o=lastname+ASC&f=enabled=false', 'showInactiveRoute');
            break;
        case 'inactive user':
            createRouteWithResponse('&o=lastname+ASC&f=enabled=false', 'inactiveUser1Route', 'inactiveUser1');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
        }).as(routeName);
    }

    function createRouteWithResponse(queryParameter, routeName, response) {
        createRouteWithResponseAndPagination(queryParameter, routeName, response, 0, 10);
    }

    function createRouteWithResponseAndHeaders(queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
            response: responseValue,
            headers: headers
        }).as(routeName);
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

given("Deactivate user response is defined", () => {
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'PUT',
        url: urlPrefix + 'API/identity/user/21',
        response: '@emptyResult'
    }).as("deactivateUserRoute");
    cy.route({
        method: 'GET',
        url: urlPrefix + userUrl + 'c=10&p=0&time=1*&o=lastname+ASC' + enabledFilter,
        response: '@emptyResult',
        headers: {'content-range': '0-0/0'}
    }).as("refreshListRoute");
});

given("Activate user response is defined", () => {
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'PUT',
        url: urlPrefix + 'API/identity/user/21',
        response: '@emptyResult'
    }).as("activateUserRoute");
    cy.route({
        method: 'GET',
        url: urlPrefix + userUrl + 'c=10&p=0&time=1*&o=lastname+ASC' + enabledFilter,
        response: '@emptyResult',
        headers: {'content-range': '0-0/0'}
    }).as("refreshListRoute");
});

given("The deactivate status code {string} response is defined", (statusCode) => {
    cy.route({
        method: 'PUT',
        url: urlPrefix + 'API/identity/user/21',
        status: statusCode,
        response: ''
    }).as("deactivateUserWithError" + statusCode + "Route");
    cy.route({
        method: 'GET',
        url: urlPrefix + userUrl + 'c=10&p=0&time=1*&o=lastname+ASC' + enabledFilter,
        response: '@users5',
        headers: {'content-range': '0-4/5'}
    }).as("usersRoute");
});

given("Create user response is defined", () => {
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'POST',
        url: urlPrefix + 'API/identity/user',
        status: 200,
        response: ''
    }).as("createUserRoute");
    cy.route({
        method: 'GET',
        url: urlPrefix + userUrl + 'c=10&p=0&time=1*&o=lastname+ASC' + enabledFilter,
        response: '@emptyResult',
        headers: {'content-range': '0-0/0'}
    }).as("refreshListRoute");
});

given("The create user status code {string} response is defined", (statusCode) => {
    cy.route({
        method: 'POST',
        url: urlPrefix + 'API/identity/user',
        status: statusCode,
        response: ''
    }).as("createUserRoute");
});

given("The create user already exists response is defined", () => {
    cy.fixture('json/userAlreadyExists.json').as('userAlreadyExists');
    cy.route({
        method: 'POST',
        url: urlPrefix + 'API/identity/user',
        status: 403,
        response: '@userAlreadyExists'
    }).as("userAlreadyExistsRoute");
});

given("The robustness password error response is defined", () => {
    cy.fixture('json/robustnessPasswordError.json').as('robustnessPasswordError');
    cy.route({
        method: 'POST',
        url: urlPrefix + 'API/identity/user',
        status: 500,
        response: '@robustnessPasswordError'
    }).as("robustnessPasswordErrorRoute");
});

when("I visit the user list page", () => {
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
        default:
            throw new Error("Unsupported case");
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

when("I filter show inactive users", () => {
    cy.get('input[value=inactive').click();
});

when("I click on {string} button on the user {string}", (iconName, userNumber) => {
    cy.get('.action-button-container .glyphicon-' + iconName).eq(userNumber - 1).click();
});

when("I click on {string} button in modal", (buttonLabel) => {
    cy.get('.modal button').contains(buttonLabel).click();
});

when("I click on create button", () => {
    cy.get('button').contains('Create').click();
});

when("I fill in the user information", () => {
    cy.get('.modal input').eq(0).type('username');
    cy.get('.modal input').eq(1).type('password');
    cy.get('.modal input').eq(2).type('password');
    cy.get('.modal input').eq(3).type('Firstname');
    cy.get('.modal input').eq(4).type('Lastname');
});

when("I put different passwords", () => {
    cy.get('.modal input').eq(1).type('password');
    cy.get('.modal input').eq(2).type('passwordDontMatch');
});

when("I fill in the username", () => {
    cy.get('.modal input').eq(0).type('username');
});

when("I fill in the password", () => {
    cy.get('.modal input').eq(1).type('password');
});

when("I fill in the confirm password", () => {
    cy.get('.modal input').eq(2).type('password');
});

when("I erase all fields", () => {
    cy.get('.modal input').eq(0).clear();
    cy.get('.modal input').eq(1).clear();
    cy.get('.modal input').eq(2).clear();
});

when("I click on the {string} button in modal", (buttonName) => {
    cy.contains('.modal button', buttonName).click();
});

then("The users have the correct information", () => {
    cy.contains('.item-label-container p', 'First name').should('be.visible');
    cy.contains('.item-label-container p', 'Last name').should('be.visible');
    cy.contains('.item-label-container p', 'Username').should('be.visible');
    cy.contains('.item-label-container p', 'Actions').should('be.visible');

    cy.get('.item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-property-value').contains('Giovanna');
        cy.get('.item-property-value').contains('Almeida');
        cy.get('.item-property-value').contains('giovanna.almeida');
        cy.get('.action-button-container i.glyphicon-eye-open').should('have.attr', 'title', 'View user details');
    });

    cy.get('.item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.item-property-value').contains('--');
        cy.get('.item-property-value').contains('Angelo');
        cy.get('.item-property-value').contains('daniela.angelo');
    });

    cy.get('.item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.item-property-value').contains('Walter');
        cy.get('.item-property-value').contains('--');
        cy.get('.item-property-value').contains('walter.bates');
    });

    cy.get('.item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.item-property-value').contains('--');
        cy.get('.item-property-label').contains('Last name');
        cy.get('.item-property-value').contains('--');
        cy.get('.item-property-value').contains('isabel.bleasdale');
    });

    cy.get('.item').eq(4).within(() => {
        cy.get('.item-property-value').contains('Jan');
        cy.get('.item-property-value').contains('Fisher');
        cy.get('.item-property-value').contains('jan.fisher');
    });
    cy.get('.text-primary.item-property-label:visible').contains('Users shown: 5 of 5');
});

then("A list of {string} users is displayed", (nbrOfUsers) => {
    cy.get('.item').should('have.length', nbrOfUsers);
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
        case 'refresh list':
            cy.wait('@refreshListRoute');
            break;
        case '&Speci@l':
            cy.wait('@&Speci@lRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No users are available", () => {
    cy.get('.item').should('have.length', 0);
    cy.contains('No users to display').should('be.visible');
});

then("The first user has the {string} button", (iconName) => {
    cy.get('button .glyphicon-' + iconName).eq(0).should("be.visible");
});

then("The change status modal is displayed for {string}", (userName) => {
    cy.get('.modal').contains('Deactivate ' + userName).should('be.visible');
});

then("The modal is closed",() => {
    cy.get('.modal').should('not.exist');
});

then("The {string} title is displayed", (titleContent) => {
    cy.get('.modal h3').contains(titleContent).should('be.visible');
});

then("The {string} button is displayed", (buttonLabel) => {
    cy.get('.modal button').contains(buttonLabel).should('be.visible');
});

then("I see status code {string} error message", (statusCode) => {
    switch (statusCode) {
        case '500':
            cy.get('.modal').contains('An error has occurred.').should('be.visible');
            break;
        case '403':
            cy.get('.modal').contains('Access denied.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The user has not been').should('be.visible');
});

then("I don't see any error message", () => {
    cy.get('.modal .glyphicon').should('not.exist');
});

then("The create button in modal is disabled", () => {
    cy.get('.modal button').contains('Create').should('be.disabled');
});

then("The create button in modal is enabled", () => {
    cy.get('.modal button').contains('Create').should('be.enabled');
});

then("I see {string} error message", (errorMessage) => {
    cy.get('.modal').contains(errorMessage).should('be.visible');
});

then("I don't see {string} error message", (errorMessage) => {
    cy.get('.modal').contains(errorMessage).should('not.exist');
});

then("All create user modal information is cleared", () => {
    cy.get('.modal input').eq(0).should('have.value', '');
    cy.get('.modal input').eq(1).should('have.value', '');
    cy.get('.modal input').eq(2).should('have.value', '');
});

then("The create modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 5);
    cy.contains('.modal-body', 'Username').should('be.visible');
    cy.contains('.modal-body', 'Password').should('be.visible');
    cy.contains('.modal-body', 'Confirm password').should('be.visible');
    cy.contains('.modal-body', 'First name').should('be.visible');
    cy.contains('.modal-body', 'Last name').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The {string} button in modal is {string}", (buttonName, buttonState) => {
    cy.contains('.modal-footer button', buttonName).should('be.' + buttonState);
});

then("The creation is successful", () => {
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@createUserRoute').then((xhr) => {
        expect(xhr.request.body.userName).to.equal('username');
        expect(xhr.request.body.password).to.equal('password');
        expect(xhr.request.body.password_confirm).to.equal('password');
        expect(xhr.request.body.firstname).to.equal('Firstname');
        expect(xhr.request.body.lastname).to.equal('Lastname');
    });
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
    cy.get('.modal-body input').each((input) => {
        expect(input).to.have.attr('readonly', 'readonly');
    });
});

then("The {string} is successful", (btnName) => {
    cy.contains('.modal-footer button', btnName).should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("The users list is refreshed", () => {
    cy.wait('@refreshListRoute');
});

then("The deactivate modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body h4', 'Warning').should('be.visible');
    cy.contains('.modal-body p', 'If this is the only user able to perform a task, this will cause the interruption of a Process.').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Deactivate').should('be.visible');
    cy.contains('.modal-footer button', 'Activate').should('not.exist');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The activate modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body h4', 'Warning').should('be.visible');
    cy.contains('.modal-body p', 'Are you sure you want to activate this user?').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Activate').should('be.visible');
    cy.contains('.modal-footer button', 'Deactivate').should('not.exist');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});