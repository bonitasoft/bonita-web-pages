import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&count=100';
const userUrl = 'API/identity/user?';
const defaultRequestUrl = urlPrefix + userUrl + 'c=10&p=0' + defaultFilters;
const enabledFilter = '&f=active=true';
const defaultSortOrder = '&o=defaultValue' + enabledFilter;
const tab1Url = 'tab1Url?c=10&p=0&filters1';
const tab2Url = 'tab2Url?c=10&p=0&filters2';

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
})


given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter with headers":
            createRouteWithResponseAndHeaders(defaultSortOrder, 'userListRoute', 'emptyResult', {'content-range': '0-10/10'});
            break;
        case 'no users':
            createRoute(defaultRequestUrl, '&o=first' + enabledFilter, 'noUserRoute');
            break;
        case 'sort by':
            createRoute(defaultRequestUrl, '&o=first' + enabledFilter, 'sortByFirstRoute');
            createRoute(defaultRequestUrl, '&o=last' + enabledFilter, 'sortByLastRoute');
            break;
        case 'search by':
            createRoute(defaultRequestUrl, '&o=defaultValue&s=Walter' + enabledFilter, 'firstNameRoute');
            createRoute(defaultRequestUrl, '&o=defaultValue&s=Bates' + enabledFilter, 'lastNameRoute');
            createRoute(defaultRequestUrl, '&o=defaultValue&s=walter.bates' + enabledFilter, 'userNameRoute');
            createRouteWithResponse('&o=defaultValue&s=Search term with no match' + enabledFilter, 'emptyResultRoute', 'emptyResult');
            break;
        case 'count':
            createRoute( urlPrefix + userUrl + 'c=10&p=0', '&count=101&o=defaultValue' + enabledFilter, 'countRoute');
            break;
        case 'user search during limitation':
            createRouteWithResponseAndHeaders('&o=defaultValue&s=Walter' + enabledFilter, 'firstNameRoute', 'users10', {'content-range': '0-10/20'});
            createRouteWithResponseAndPagination('&o=defaultValue&s=Walter' + enabledFilter, 'users10LimitationRoute', 'users10', 1, 10);
            break;
        case 'show inactive':
            createRoute(defaultRequestUrl,'&o=defaultValue&f=active=false', 'showInactiveRoute');
            break;
        case 'enable load more':
            createRouteWithResponseAndHeaders(defaultSortOrder, 'users10LoadMoreRoute', 'users10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMoreRoute', 'users10', 1, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMoreRoute', 'users10', 2, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'users5LoadMoreRoute', 'users5', 3, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponseAndHeaders(defaultSortOrder, 'users10LoadMore20Route', 'users10', {'content-range': '0-10/20'});
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMore20Route', 'users10', 1, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'enable 30 load more':
            createRouteWithResponseAndHeaders(defaultSortOrder, 'users10LoadMore30Route', 'users10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMore30Route', 'users10', 1, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMore30Route', 'users10', 2, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'users10LoadMore30Route', 'users5', 3, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'tabs':
            createRoute(tab1Url, '', 'tab1Route');
            createRoute(tab2Url, '', 'tab2Route');
            break;
        case 'delayed tab 1 response':
            cy.fixture('json/users5.json').as("users5Route");
            cy.route({
                method: 'GET',
                url: tab1Url,
                delay: 2000,
                response: '@users5Route'
            }).as('tab1Route');
            break;
        case 'tab 2 response':
            cy.fixture('json/users10.json').as("users10Route");
            cy.route({
                method: 'GET',
                url: tab2Url,
                response: '@users10Route'
            }).as('tab2Route');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(url, queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: url + queryParameter,
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
        case 'count':
            searchForCount(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'First':
                cy.get('select').eq(0).select('0');
                break;
            case 'Last':
                cy.get('select').eq(0).select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input[type="text"]').type(filterValue);
    }

    function searchForCount(filterValue) {
        cy.get('pb-input input[type="number"]').clear();
        cy.get('pb-input input[type="number"]').type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input[type="text"]').clear();
});

when("I filter show inactive users", () => {
    cy.get('input[value=inactive').click();
});

when("I click on Load more users button", () => {
    cy.get('button').contains('Load more users').click();
});

when("I click on {string}", (tabName) => {
    cy.get('tab-heading').contains(tabName).click();
});

then("The no users message is shown correctly", () => {
   cy.contains('pb-fragment-fragment-load-more-v1 h4', 'No users to display').should('be.visible');
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'user list':
            cy.wait('@userListRoute');
            break;
        case 'First':
            cy.wait('@sortByFirstRoute');
            break;
        case 'Last':
            cy.wait('@sortByLastRoute');
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
        case '101':
            cy.wait('@countRoute');
            break;
        case 'show inactive':
            cy.wait('@showInactiveRoute');
            break;
        case 'refresh list':
            cy.wait('@refreshListRoute');
            break;
        case "0 of 20 users":
            cy.wait('@users10LoadMore20Route');
            break;
        case "1 of 20 users":
            cy.wait('@users10LoadMore20Route');
            break;
        case "2 of 20 users":
            cy.wait('@emptyResultRoute');
            break;
        case "0 of 30 users":
            cy.wait('@users10LoadMore30Route');
            break;
        case "1 of 30 users":
            cy.wait('@users10LoadMore30Route');
            break;
        case "2 of 30 users":
            cy.wait('@users10LoadMore30Route');
            break;
        case "3 of 30 users":
            cy.wait('@users10LoadMore30Route');
            break;
        case "4 of 30 users":
            cy.wait('@emptyResultRoute');
            break;
        case "search limitation":
            cy.wait('@users10LimitationRoute');
            break;
        case "tab 1":
            cy.wait('@tab1Route');
            break;
        case "tab 2":
            cy.wait('@tab2Route');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("The api call is made for page {int} out of {int}", (filterValue) => {
    switch (filterValue) {
    case 0:
        cy.wait('@users10LoadMoreRoute');
        break;
    case 1:
        cy.wait('@users10LoadMoreRoute');
        break;
    case 2:
        cy.wait('@users10LoadMoreRoute');
        break;
    case 3:
        cy.wait('@users5LoadMoreRoute');
        break;
    case 4:
        cy.wait('@emptyResultRoute');
        break;
    default:
        throw new Error("Unsupported case");
    }
});

then("The Load more users button is disabled", () => {
    cy.get('button').contains('Load more users').should('be.disabled');
});

then("The {int} of {int} users shown message displayed correctly", (usersShown, totalUsers) => {
    cy.get('.text-primary p').contains('Users shown: ' + usersShown + ' of ' + totalUsers);
});

then("The second tab is disabled", () => {
    cy.contains('li.disabled', 'Tab 2').should('be.visible');
});

then("There is a loader displayed", () => {
    cy.get('.glyphicon.glyphicon-cog').should('be.visible');
});

then("The second tab is not disabled", () => {
    cy.contains('li.disabled', 'Tab 2').should('not.exist');
});

then("There is no loader", () => {
    cy.get('.glyphicon.glyphicon-cog').should('not.exist');
});

then("Then content is for Tab 2", () => {
    cy.wait('@tab2Route');
    cy.get('.tab1Item').should('not.exist');
    cy.get('.tab2Item').should('have.length', 10);
})