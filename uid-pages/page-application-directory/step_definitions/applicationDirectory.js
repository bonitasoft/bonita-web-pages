const urlPrefix = 'build/dist/';
const applicationUrl = 'API/living/application';
const session = 'API/system/session/unusedId';
const defaultFilters = '&d=profileId&d=createdBy&d=updatedBy&d=layoutId&f=userId=4';
const defaultRequestUrl = urlPrefix + applicationUrl + '?c=20&p=0' + defaultFilters;
const defaultUserUrl = urlPrefix + 'API/identity/user/4?d=professional_data';
const languageUrl = urlPrefix + 'API/system/i18nlocale*';

given("The response {string} is defined", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, 'applications5Route', 'applications5');
            break;
        case 'session':
            createRouteWithResponse(urlPrefix + session, 'sessionRoute', 'session');
            break;
        case 'technical user':
            createRouteWithResponse(urlPrefix + session, 'sessionTechnicalUserRoute', 'sessionTechnicalUser');
            break;
        case 'session with SSO':
            createRouteWithResponse(urlPrefix + session, 'sessionWithSSORoute', 'sessionWithSSO');
            break;
        case 'guest user':
            createRouteWithResponse(urlPrefix + session, 'sessionGuestUserRoute', 'sessionGuestUser');
            break;
        case 'guest user with sso':
            createRouteWithResponse(urlPrefix + session, 'sessionGuestUserWithSSORoute', 'sessionGuestUserWithSSO');
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
        case 'user':
            createRouteWithResponse(defaultUserUrl, 'userRoute', 'user');
            break;
        case 'default user':
            createRouteWithResponse(defaultUserUrl, 'userDefaultIconRoute', 'userDefaultIcon');
            break;
        case 'no user first name':
            createRouteWithResponse(defaultUserUrl, 'userNoFirstNameRoute', 'userNoFirstName');
            break;
        case 'no user last name':
            createRouteWithResponse(defaultUserUrl, 'userNoLastNameRoute', 'userNoLastName');
            break;
        case 'localization':
            createRouteWithResponse(languageUrl, 'i18localeRoute', 'i18locale');
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

given('The current language in BOS_Locale is {string}', (language) => {
    cy.setCookie('BOS_Locale', language);
});

when("I visit the application directory page", () => {
    cy.visit(urlPrefix + 'resources/index.html');
});

when('I visit the application directory page with a parameter {string} in the URL', (localeParamName) => {
    cy.visit(urlPrefix + 'resources/index.html?' + localeParamName + '=es');
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

when('I click the {string}', (username) => {
    cy.contains('.user-menu-name button', username).click();
});

when('I select {string} in language picker', (languageSelected) => {
    switch (languageSelected) {
    case 'English':
        cy.get('.modal-body .form-control').select('0');
        break;
    case 'Français':
        cy.get('.modal-body .form-control').select('1');
        break;
    case 'Español':
        cy.get('.modal-body .form-control').select('2');
        break;
    case '日本語':
        cy.get('.modal-body .form-control').select('3');
        break;
    }
});

when('I press the button {string}', (buttonName) => {
    cy.contains('.modal-body button', buttonName).click();
});

when('I click the close button', () => {
    cy.contains('.modal-footer button', 'Close').click();
});

when('I click next to the current session modal', () => {
    cy.get('.modal.fade').click('right');
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

then('I see {string} as the user menu icon', (userIcon) => {
    cy.get('.user-menu.image-circle img').should('have.attr', 'src', userIcon);
});

then('I see {string} as the user name', (userName) => {
    cy.get('.text-right > .ng-binding').should('have.text', userName);
});

then('I don\'t see {string} as the user name', (userName) => {
    cy.get('.text-right > .ng-binding').should('not.have.text', userName);
});

then('The login link is displayed', () => {
    cy.get('.text-right > .ng-binding').should('have.text', 'Sign in');
});

then('The login link is hidden', () => {
    cy.contains('.user-menu-name', 'Sign in').should('not.exist');
});

then('I see default user icon as the user menu icon', () => {
    cy.get('.user-menu i.fa').should('exist');
});

then('The current session modal is visible', () => {
    cy.get('.modal').should('be.visible');
});

then('The user first and last name {string} are visible', (firstAndLastName) => {
    cy.contains('.modal-header h3', firstAndLastName);
});

then('The user name {string} is shown', (userName) => {
    cy.contains('.modal-body p', userName);
});

then('The user email {string} is shown', (userEmail) => {
    cy.contains('.modal-body p', userEmail);
});

then('The language select is visible', () => {
    cy.get('.form-control').should('be.visible');
});

then('The logout button is visible', () => {
    cy.get('.btn-danger').eq(0).should('have.text', 'Sign out');
});

then('The logout button has the correct url', () => {
    cy.get('.btn-danger').eq(0).should('have.attr', 'href').and('contains', 'logoutservice?locale=en&redirectUrl=%2F'+urlPrefix.replaceAll('/', '%2F'));
});

then('The apply and close buttons are visible', () => {
    cy.contains('.modal-body button', 'Apply').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then('The logout button is hidden', () => {
    cy.contains('.modal-footer .btn-danger', 'Sign out').should('not.be.visible');
});

then('I see {string} as the user modal icon', (userIcon) => {
    cy.get('.modal-content .image-circle--large img').should('have.attr', 'src', userIcon);
});

then('I see default user icon as the user modal icon', () => {
    cy.get('.modal-content i.fa').should('exist');
});

then('The apply button is disabled', () => {
    cy.contains('.modal-body button', 'Apply').should('be.disabled');
});

then('The apply button is enabled', () => {
    cy.contains('.modal-body button', 'Apply').should('be.enabled');
});

then('The language in BOS_Locale is {string}', (languageSelected) => {
    cy.getCookie('BOS_Locale').should('have.property', 'value', languageSelected);
});

then('Page reloads', () => {
    //necessary when the page reloads to avoid modale opening failure
    cy.reload();
});

then('The parameter {string} is in the URL', (parameterName) => {
    cy.url().should('include', parameterName + '=');
});

then('The parameter {string} is not in the URL', (parameterName) => {
    cy.url().should('not.include', parameterName + '=');
});

then('The current session modal is not visible', () => {
    cy.get('.modal').should('not.exist');
});

then('The current language is {string}', (language) => {
    switch (language) {
    case 'English':
        cy.get('.modal-body select').should('have.value','0');
        break;
    case 'Français':
        cy.get('.modal-body select').should('have.value','1');
        break;
    case 'Español':
        cy.get('.modal-body select').should('have.value','2');
        break;
    case '日本語':
        cy.get('.modal-body select').should('have.value','3');
        break;
    }
});

then('The technical user email is hidden', () => {
    cy.contains('.user-details--break-all p', 'Email').should('not.be.visible');
});