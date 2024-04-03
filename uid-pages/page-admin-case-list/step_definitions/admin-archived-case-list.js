import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=processDefinitionId&d=started_by&d=startedBySubstitute';
const processUrl = urlPrefix + 'API/bpm/process';
const processFilters = '?c=20&p=0&o=displayName ASC';
const adminArchivedCaseListUrl = 'API/bpm/archivedCase';
const defaultRequestUrl = urlPrefix + adminArchivedCaseListUrl + '?c=10&p=0' + defaultFilters;
const refreshArchivedCaseUrl = urlPrefix + adminArchivedCaseListUrl + '?c=10&p=0' + defaultFilters + '&t=1*';
const archivedCaseDiagramUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-visu?id=';
const featuresListUrl = urlPrefix + 'API/system/feature?p=0&c=100';

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
})

given("The filter response {string} is defined for archived cases", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'refresh not called':
            cy.route({
                method: "GET",
                url: refreshArchivedCaseUrl,
                onRequest: () => {
                    throw new Error("This should have not been called");
                }
            });
            break;
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'archivedCases5Route', 'archivedCases5');
            createRouteWithResponse(featuresListUrl, '', 'featuresListRoute', 'featuresList');
            break;
        case "default filter without features":
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'archivedCases5Route', 'archivedCases5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('&t=0', 'archivedCases5Route', 'archivedCases5', {'content-range': '0-5/5'});
            createRouteWithResponse(featuresListUrl, '', 'featuresListRoute', 'featuresList');
            break;
        case 'process name':
            createRouteWithResponseAndDelay(processUrl, processFilters + '&s=Process', 'processesRoute', 'processes', 100);
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=7724628355784275506', 'archivedProcess1CasesRoute', 'archivedProcess1Cases');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=4778742813773463488', 'archivedProcess2CasesRoute', 'emptyResult');
            break;
        case 'processId filter':
            createRouteWithResponseAndDelay(processUrl, processFilters + '&s=Process', 'processesRoute', 'processes', 100);
            createRouteWithResponse(processUrl + '/4778742813773463488', '', 'processRoute', 'process');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=7724628355784275506', 'archivedProcess1CasesRoute', 'archivedProcess1Cases');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=4778742813773463488', 'archivedProcess2CasesRoute', 'emptyResult');
            break;
        case 'sort by':
            createRoute('&t=0&o=sourceObjectId+ASC', 'sortByCaseIdAscRoute');
            createRoute('&t=0&o=sourceObjectId+DESC', 'sortByCaseIdDescRoute');
            createRoute('&t=0&o=name+ASC', 'sortByProcessNameAscRoute');
            createRoute('&t=0&o=name+DESC', 'sortByProcessNameDescRoute');
            createRoute('&t=0&o=startDate+DESC', 'sortByStartDateDescRoute');
            createRoute('&t=0&o=startDate+ASC', 'sortByStartDateAscRoute');
            break;
        case 'search by name':
            createRoute('&t=0&s=Process', 'searchRoute');
            createRouteForSpecialCharacter(urlPrefix + adminArchivedCaseListUrl,'&Special', 'archivedCaseNameWithSpecialCharacterRoute');
            createRouteWithResponse(defaultRequestUrl,'&t=0&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'refresh archived case list':
            createRouteWithResponseAndHeaders('&t=0', 'archivedCases10Route', 'archivedCases10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination('&t=0', 'archivedCases10Route', 'archivedCases10', 1, 10);
            createRouteWithResponseAndPagination('&t=0', 'archivedCases10Route', 'archivedCases10', 2, 10);
            createRouteWithResponse(defaultRequestUrl, '&t=1*', 'archivedCases10Route', 'archivedCases10');
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + adminArchivedCaseListUrl + '?c=10&p=0', defaultFilters + '&o=name+DESC&t=0', 'sortProcessNameDescRoute', 'archivedCases10');
            createRouteWithResponse(urlPrefix + adminArchivedCaseListUrl + '?c=10&p=1', defaultFilters + '&o=name+DESC', 'sortProcessNameDescRoute2', 'archivedCases10');
            createRouteWithResponse(urlPrefix + adminArchivedCaseListUrl + '?c=10&p=2', defaultFilters + '&o=name+DESC', 'sortProcessNameDescRoute2', 'archivedCases10');
            break;
        case 'archived case deletion success':
            createRouteWithMethod(adminArchivedCaseListUrl + '/6071', 'archivedCaseDeletionRoute', 'DELETE');
            createRouteWithResponse(refreshArchivedCaseUrl, '', 'refreshArchivedCaseUrlRoute', 'archivedCases4');
            break;
        case '403 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminArchivedCaseListUrl + "/6071", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '403');
            break;
        case '404 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminArchivedCaseListUrl + "/6071", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '404');
            break;
        case '500 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminArchivedCaseListUrl + "/6071", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '500');
            break;
        case "no archived case":
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'emptyResultRoute', 'emptyResult');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRouteForSpecialCharacter(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'd[0]': 'processDefinitionId',
                'd[1]': 'started_by',
                'd[2]': 'startedBySubstitute',
                't': '0',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
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

    function createRouteWithResponse(url, queryParameter, routeName, response) {
        createRouteWithResponseAndDelay(url, queryParameter, routeName, response, 0);
    }

    function createRouteWithResponseAndDelay(url, queryParameter, routeName, response, delay) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: url + queryParameter,
            response: responseValue,
            delay: delay
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + adminArchivedCaseListUrl + '?c=' + count + '&p=' + page + defaultFilters;
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
});

when("I visit the admin archived case list page with processId query parameter", () => {
    cy.visit(url + '?tab=archived&processId=4778742813773463488');
});

when("I put {string} in {string} filter field for archived cases", (filterValue, filterType) => {
    switch (filterType) {
        case 'process name':
            selectFilterProcessNameOption(filterValue);
            break;
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
        case 'caseId':
            filterCaseIdForValue(filterValue);
            break;
        case 'case state':
            caseStateFilterOption(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectFilterProcessNameOption(filterValue) {
        cy.get('.dropdown input').type(filterValue);
        cy.wait('@processesRoute');
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Case ID (Asc)':
                cy.get('.filter-sort select:visible').select('0');
                break;
            case 'Case ID (Desc)':
                cy.get('.filter-sort select:visible').select('1');
                break;
            case 'Process name (Asc)':
                cy.get('.filter-sort select:visible').select('2');
                break;
            case 'Process name (Desc)':
                cy.get('.filter-sort select:visible').select('3');
                break;
            case 'Start date (Newest first)':
                cy.get('.filter-sort select:visible').select('4');
                break;
            case 'Start date (Oldest first)':
                cy.get('.filter-sort select:visible').select('5');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function caseStateFilterOption(filterValue) {
        switch (filterValue) {
            case 'All states':
                cy.get('.filter-state select:visible').select('0');
                break;
            case 'With failures':
                cy.get('.filter-state select:visible').select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('.filter-search input:visible').type(filterValue);
    }

    function filterCaseIdForValue(filterValue) {
        cy.get('.case-input input:visible').eq(0).type(filterValue);
    }
});

when("I click on Load more archived cases button", () => {
    cy.contains('button','Load more cases').click();
});

then("I see an archived case list page", () => {
    cy.get('.item-value:visible').contains('2042');
});

then("The archived case list have the correct information", () => {
    cy.wait('@archivedCases5Route');
    cy.contains('.item-label-container p', 'Case ID (original)')
    cy.contains('.item-label-container p', 'Process name (version)')
    cy.contains('.item-label-container p', 'Started by')
    cy.contains('.item-label-container p', 'Start date')
    cy.contains('.item-label-container p', 'End date')
    cy.contains('.item-label-container p', 'State')
    cy.contains('.item-label-container p', 'Pending flow nodes').should('not.exist');
    cy.contains('.item-label-container p', 'Failed flow nodes').should('not.exist');
    cy.get('.case-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('2042');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('Process display name 1');
        cy.get('.item-value').contains('System for Walter Bates');
        cy.get('.item-value').contains('2/5/21 2:12 PM');
        cy.get('.item-value').contains('2/5/21 4:00 PM');
        cy.get('.item-value').contains('completed');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.case-item:visible').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('2048');
        cy.get('.item-value').contains('Process 2 (1.0)');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-value').contains('2/5/21 2:13 PM');
        cy.get('.item-value').contains('2/5/21 6:10 PM');
        cy.get('.item-value').contains('completed');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.case-item:visible').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('2049');
        cy.get('.item-value').contains('Process 3 (1.0)');
        cy.get('.item-value').contains('System');
        cy.get('.item-value').contains('2/5/21 2:13 PM');
        cy.get('.item-value').contains('2/5/21 6:10 PM');
        cy.get('.item-value').contains('completed');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.case-item:visible').eq(4).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('2060');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('Walter Bates for Helen Kelly');
        cy.get('.item-value').contains('2/5/21 6:13 PM');
        cy.get('.item-value').contains('2/5/21 6:13 PM');
        cy.get('.item-value').contains('completed');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.text-primary.item-label:visible').contains('Cases shown: 5 of 5');
});

then("The api call is made for {string} for archived cases", (filterValue) => {
    switch (filterValue) {
        case 'Process 1 (1.0)':
            cy.wait('@archivedProcess1CasesRoute');
            break;
        case 'Process 2 (1.0)':
            cy.wait('@archivedProcess2CasesRoute');
            break;
        case 'Case ID (Asc)':
            cy.wait('@sortByCaseIdAscRoute');
            break;
        case 'Case ID (Desc)':
            cy.wait('@sortByCaseIdDescRoute');
            break;
        case 'Process name (Asc)':
            cy.wait('@sortByProcessNameAscRoute');
            break;
        case 'Process name (Desc)':
            cy.wait('@sortByProcessNameDescRoute');
            break;
        case 'Start date (Newest first)':
            cy.wait('@sortByStartDateDescRoute');
            break;
        case 'Start date (Oldest first)':
            cy.wait('@sortByStartDateAscRoute');
            break;
        case 'Process':
            cy.wait('@searchRoute');
            break;
        case 'With failures':
            cy.wait('@casesWithFailuresRoute');
            break;
        case '&Special':
            cy.wait('@archivedCaseNameWithSpecialCharacterRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No archived cases are available", () => {
    cy.get('.case-item:visible').should('have.length', 0);
    cy.get('h4').contains('No cases to display').should('be.visible');
});

then("The load more archived cases button is disabled", () => {
    cy.contains('button','Load more cases').should('be.disabled');
});

then("The delete archived case modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted and will not be stored in the archives. Are you sure you want to delete it?').should('not.exist');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted from the archives. Are you sure you want to delete it?').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The archived case list is refreshed", () => {
    cy.wait('@refreshArchivedCaseUrlRoute');
});

then("The view archived case diagram button in the list has correct href with {string}-{string}", (processDefinitionId, sourceObjecId) => {
    cy.get('.btn-link .glyphicon-picture').eq(0).parent().should('have.attr', 'href', archivedCaseDiagramUrl + processDefinitionId + '-' + sourceObjecId);
});

then("The api call is made with processId filter for archived cases", () => {
    cy.wait('@archivedProcess2CasesRoute');
});

then("The api call is made with a different processId for archived cases", () => {
    cy.wait('@archivedProcess1CasesRoute');
});

then("There is no {string} button in the archived case list", () => {
    cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('not.be.visible');
});

then("The archived case item header is displayed correctly", () => {
    cy.contains('.item-label-container p', 'Case ID (original)')
    cy.contains('.item-label-container p', 'Process name (version)')
    cy.contains('.item-label-container p', 'Started by')
    cy.contains('.item-label-container p', 'Start date')
    cy.contains('.item-label-container p', 'End date')
    cy.contains('.item-label-container p', 'State')
    cy.contains('.item-label-container p', 'Pending flow nodes').should('not.exist');
    cy.contains('.item-label-container p', 'Failed flow nodes').should('not.exist');
});

then("The api call is made for default archived cases", () => {
    cy.wait('@archivedCases5Route');
});