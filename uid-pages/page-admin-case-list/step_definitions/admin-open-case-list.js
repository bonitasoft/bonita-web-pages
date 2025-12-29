import { Given as given, Then as then, When as when } from "@badeball/cypress-cucumber-preprocessor";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=processDefinitionId&d=started_by&d=startedBySubstitute';
const flowNodeCounters = '&n=pendingFlowNodes&n=failedFlowNodes';
const processUrl = urlPrefix + 'API/bpm/process';
const adminOpenCaseListUrl = 'API/bpm/case';
const defaultRequestUrl = urlPrefix + adminOpenCaseListUrl + '?c=10&p=0' + defaultFilters + '&t=0' + flowNodeCounters;
const caseDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=';
const refreshOpenCaseUrl = urlPrefix + adminOpenCaseListUrl + '?c=10&p=0' + defaultFilters + '&t=1*';
const openCaseDiagramUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-visu?id=';
const featuresListUrl = urlPrefix + 'API/system/feature?p=0&c=100';

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
})


given("The filter response {string} is defined for open cases", (filterType) => {
    switch (filterType) {
        case 'refresh not called':
            cy.intercept('GET', refreshOpenCaseUrl, (req) => {
                throw new Error("This should have not been called");
            });
            break;
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '', 'openCases5Route', 'openCases5');
            createRouteWithResponse(featuresListUrl, '', 'featuresListRoute', 'featuresList');
            break;
        case "default filter with all cases":
            createRouteWithResponse(defaultRequestUrl, '&f=caller%3Dany', 'openCasesWithSubProcessRoute', 'openCasesWithSubProcess');
            break;
        case "default filter without features":
            createRouteWithResponse(defaultRequestUrl, '', 'openCases5Route', 'openCases5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('', 'openCases5Route', 'openCases5', {'content-range': '0-5/5'});
            createRouteWithResponse(featuresListUrl, '', 'featuresListRoute', 'featuresList');
            break;
        case 'process name':
            createProcessRouteWithQueryMatcher('Process', 'processesRoute', 'processes', 100);
            createCaseRouteWithQueryMatcher('process1CasesRoute', 'process1Cases', {'f': 'processDefinitionId=7724628355784275506'});
            createCaseRouteWithQueryMatcher('process2CasesRoute', 'emptyResult', {'f': 'processDefinitionId=4778742813773463488'});
            break;
        case 'processId filter':
            createProcessRouteWithQueryMatcher('Process', 'processesRoute', 'processes', 100);
            createRouteWithResponse(processUrl + '/4778742813773463488', '', 'processRoute', 'process');
            createCaseRouteWithQueryMatcher('process1CasesRoute', 'process1Cases', {'f': 'processDefinitionId=7724628355784275506'});
            createCaseRouteWithQueryMatcher('process2CasesRoute', 'emptyResult', {'f': 'processDefinitionId=4778742813773463488'});
            break;
        case 'sort by':
            createCaseRouteWithQueryMatcherNoResponse('sortByCaseIdAscRoute', {'o': 'id ASC'});
            createCaseRouteWithQueryMatcherNoResponse('sortByCaseIdDescRoute', {'o': 'id DESC'});
            createCaseRouteWithQueryMatcherNoResponse('sortByProcessNameAscRoute', {'o': 'name ASC'});
            createCaseRouteWithQueryMatcherNoResponse('sortByProcessNameDescRoute', {'o': 'name DESC'});
            createCaseRouteWithQueryMatcherNoResponse('sortByStartDateDescRoute', {'o': 'startDate DESC'});
            createCaseRouteWithQueryMatcherNoResponse('sortByStartDateAscRoute', {'o': 'startDate ASC'});
            break;
        case 'search by name':
            createRoute('&s=Process', 'searchRoute');
            createRouteForSpecialCharacter(urlPrefix + adminOpenCaseListUrl,'&Special', 'caseNameWithSpecialCharacterRoute')
            createRouteWithResponse(defaultRequestUrl,'&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'case state':
            createCaseRouteWithQueryMatcher('casesWithFailuresRoute', 'casesWithFailures', {'f': 'state=error'});
            createCaseRouteWithQueryMatcher('openCases5Route', 'openCases5', {'f': 'state=allStates'});
            break;
        case 'refresh open case list':
            createRouteWithResponseAndHeaders('', 'openCases10Route', 'openCases10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination('', 'openCases10Route', 'openCases10', 1, 10);
            createRouteWithResponseAndPagination('', 'openCases10Route', 'openCases10', 2, 10);
            createRouteWithResponse(urlPrefix + adminOpenCaseListUrl + '?c=10&p=0' + defaultFilters, '&t=1*' + flowNodeCounters, 'openCases10Route', 'openCases10');
            break;
        case 'sort during limitation':
            createCaseRouteWithQueryMatcherAndResponse('sortProcessNameDescRoute', 'openCases10', {'c': '10', 'p': '0', 'o': 'name DESC'});
            createCaseRouteWithQueryMatcherAndResponse('sortProcessNameDescRoute2', 'openCases10', {'c': '10', 'p': '1', 'o': 'name DESC'});
            createCaseRouteWithQueryMatcherAndResponse('sortProcessNameDescRoute2', 'openCases10', {'c': '10', 'p': '2', 'o': 'name DESC'});
            break;
        case 'open case deletion success':
            createRouteWithMethod(adminOpenCaseListUrl + '/3001', 'openCaseDeletionRoute', 'DELETE');
            createRouteWithResponse(refreshOpenCaseUrl, '', 'refreshOpenCaseUrlRoute', 'openCases4');
            break;
        case '403 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminOpenCaseListUrl + "/3001", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '403');
            break;
        case '404 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminOpenCaseListUrl + "/3001", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '404');
            break;
        case '500 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + adminOpenCaseListUrl + "/3001", 'unauthorizedDeleteCaseRoute', 'emptyResult', 'DELETE', '500');
            break;
        case 'no open cases':
            createRouteWithResponse(defaultRequestUrl, '', 'noOpenCasesRoute', 'emptyResult');
            break;
        case 'open cases with errors':
            createCaseRouteWithQueryMatcher('casesWithErrorCaseStateFilterRoute', 'emptyResult', {'f': 'state=error'});
            break;
        case 'case list with all filters':
            createCaseRouteWithQueryMatcher('casesWithAllFiltersRoute', 'emptyResult', {
                'f[0]': 'state=error',
                'f[1]': 'processDefinitionId=4778742813773463488',
                'o': 'id ASC',
                's': 'Pool'
            });
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
                'n[0]': 'pendingFlowNodes',
                'n[1]': 'failedFlowNodes',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createCaseRouteWithQueryMatcher(routeName, response, additionalQuery) {
        const query = {
            'c': '10',
            'p': '0',
            'd[0]': 'processDefinitionId',
            'd[1]': 'started_by',
            'd[2]': 'startedBySubstitute',
            't': '0',
            'n[0]': 'activeFlowNodes',
            'n[1]': 'failedFlowNodes',
            ...additionalQuery
        };
        cy.intercept({
            method: 'GET',
            pathname: '/' + urlPrefix + adminOpenCaseListUrl,
            query: query
        }, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }

    function createProcessRouteWithQueryMatcher(searchValue, routeName, response, delay) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + processUrl,
            query: {
                'c': '20',
                'p': '0',
                'o': 'displayName ASC',
                's': searchValue
            }
        }, {
            fixture: 'json/' + response + '.json',
            delay: delay
        }).as(routeName);
    }

    function createRoute(queryParameter, routeName) {
        cy.intercept('GET', defaultRequestUrl + queryParameter).as(routeName);
    }

    function createRouteWithMethod(urlSuffix, routeName, method) {
        createRouteWithMethodAndStatus(urlSuffix, routeName, method, 200);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.intercept(method, urlPrefix + urlSuffix, {
            body: "",
            statusCode: typeof status === 'string' ? parseInt(status, 10) : status
        }).as(routeName);
    }

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        cy.intercept(method, url, {
            fixture: 'json/' + response + '.json',
            statusCode: parseInt(status, 10)
        }).as(routeName);
    }

    function createRouteWithResponse(url, queryParameter, routeName, response) {
        createRouteWithResponseAndDelay(url, queryParameter, routeName, response, 0);
    }

    function createRouteWithResponseAndDelay(url, queryParameter, routeName, response, delay) {
        cy.intercept('GET', url + queryParameter, {
            fixture: 'json/' + response + '.json',
            delay: delay
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + adminOpenCaseListUrl + '?c=' + count + '&p=' + page + defaultFilters + '&t=0' + flowNodeCounters;
        cy.intercept('GET', loadMoreUrl + queryParameter, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }

    function createRouteWithResponseAndHeaders(queryParameter, routeName, response, headers) {
        cy.intercept('GET', defaultRequestUrl + queryParameter, {
            fixture: 'json/' + response + '.json',
            headers: headers
        }).as(routeName);
    }

    function createCaseRouteWithQueryMatcherNoResponse(routeName, additionalQuery) {
        const query = {
            'c': '10',
            'p': '0',
            'd[0]': 'processDefinitionId',
            'd[1]': 'started_by',
            'd[2]': 'startedBySubstitute',
            't': '0',
            'n[0]': 'activeFlowNodes',
            'n[1]': 'failedFlowNodes',
            ...additionalQuery
        };
        cy.intercept({
            method: 'GET',
            pathname: '/' + urlPrefix + adminOpenCaseListUrl,
            query: query
        }).as(routeName);
    }

    function createCaseRouteWithQueryMatcherAndResponse(routeName, response, query) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + urlPrefix + adminOpenCaseListUrl,
            query: query
        }, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }
});

given("The viewport is bigger than usual", () => {
    cy.viewport(1366, 1500);
});

when("I visit the admin case list page", () => {
    cy.visit(url);
});

when("I visit the admin case list page with the following url parameters", (urlParams) => {
    const searchParams = new URLSearchParams();
    for(let [name, value] of Object.entries(urlParams.rowsHash())){
        searchParams.set(name, value);
    }
    cy.visit(url + '?' + searchParams.toString());
});

when("I click on {string} tab", (tabName) => {
    cy.get("a").contains(tabName).click();
});

when("I click on {string} radio button", (radioLabel) => {
    cy.get('.view-mode label').filter(':contains('+ radioLabel + ')').children('input').eq(0).click();
});

when("I put {string} in {string} filter field for open cases", (filterValue, filterType) => {
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

when("I erase the search filter", () => {
    cy.get('.filter-search input:visible').clear();
});

when("I click on Load more open cases button", () => {
    cy.contains('button','Load more cases').click();
});

when("I click on refresh", ()=>{
    cy.get('button i.glyphicon-repeat:visible').click();
});

when("I search {string} in caseId input", (searchValue)=>{
    cy.get('pb-input input:visible').eq(0).type(searchValue);
});

when("I click on delete button for first case", () => {
    cy.get('.glyphicon.glyphicon-trash').eq(0).parent().click();
});

when("I click on the {string} button in modal footer", (buttonName) => {
    cy.contains('.modal-footer button', buttonName).click();
});

when("I wait for no open cases api call", () => {
    cy.wait('@noOpenCasesRoute');
});

when("I click on {string} in process dropdown", (processName) => {
    cy.contains('.dropdown button', processName).click();
});

when("I clear the process name filter", () => {
    cy.get('.dropdown input').clear();
});

then("The open case list have the correct information", () => {
    cy.wait('@openCases5Route');
    cy.contains('.item-label-container p', 'Case ID').should('be.visible');
    cy.contains('.item-label-container p', 'Process name (version)').should('be.visible');
    cy.contains('.item-label-container p', 'Started by').should('be.visible');
    cy.contains('.item-label-container p', 'Start date').should('be.visible');
    cy.contains('.item-label-container p', 'End date').should("not.exist");
    cy.contains('.item-label-container p', 'Failed flow nodes').should('be.visible');
    cy.get('.item-label-container i.glyphicon-info-sign').should('have.attr', 'title', 'Aggregates tasks in states ready, waiting, executing, completing, and initializing.');
    cy.contains('.item-label-container p', 'Pending flow nodes').should('be.visible');
    cy.contains('.item-label-container p', 'Actions').should('be.visible');
    cy.get('.case-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('3001');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('Process display name 1');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-value').contains('2/8/21 10:41 AM');
        cy.get('.item-value').contains('16');
        cy.get('.item-value').contains('0');
        cy.get('.item-label').contains('Key 1');
        cy.get('.item-value').contains('Value 1');
        cy.get('.item-label').contains('Key 2');
        cy.get('.item-value').contains('Value 2');
        cy.get('.item-label').contains('Key 3');
        cy.get('.item-value').contains('Value 3');
        cy.get('.item-label').contains('Key 4');
        cy.get('.item-value').contains('Value 4');
        cy.get('.item-label').contains('Key 5');
        cy.get('.item-value').contains('Value 5');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.case-item:visible').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('3003');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('System for Walter Bates');
        cy.get('.item-value').contains('2/8/21 10:41 AM');
        cy.get('.item-value').contains('16');
        cy.get('.item-value').contains('0');
        cy.get('.item-label').contains('Key 1');
        cy.get('.item-value').contains('Value 1');
        cy.get('.item-label').contains('Key 2');
        cy.get('.item-value').contains('Value 2');
        cy.get('.item-label').contains('Key 3');
        cy.get('.item-value').contains('Value 3');
        cy.get('.item-label').contains('Key 4');
        cy.get('.item-value').contains('Value 4');
        cy.get('.item-label').contains('Key 5');
        cy.get('.item-value').contains('Value 5');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.case-item:visible').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('3004');
        cy.get('.item-value').contains('Process 2 (1.0)');
        cy.get('.item-value').contains('Helen Kelly for Walter Bates');
        cy.get('.item-value').contains('2/8/21 10:43 AM');
        cy.get('.item-value').contains('16');
        cy.get('.item-value').contains('0');
        cy.get('.item-label').contains('Key 1');
        cy.get('.item-value').contains('Value 1');
        cy.get('.item-label').contains('Key 2');
        cy.get('.item-value').contains('Value 2');
        cy.get('.item-label').contains('Key 3');
        cy.get('.item-value').contains('Value 3');
        cy.get('.item-label').contains('Key 4');
        cy.get('.item-value').contains('Value 4');
        cy.get('.item-label').contains('Key 5');
        cy.get('.item-value').contains('Value 5');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.contains('.text-primary.item-label:visible', 'Cases shown: ').scrollIntoView();
    cy.get('.case-item:visible').eq(4).within(() => {
        // Check that the element exist.
        cy.get('.item-value').contains('3005');
        cy.get('.item-value').contains('Process 3 (1.0)');
        cy.get('.item-value').contains('System');
        cy.get('.item-value').contains('2/8/21 10:41 AM');
        cy.get('.item-value').contains('16');
        cy.get('.item-value').contains('0');
        cy.get('.item-label').contains('Key 1');
        cy.get('.item-value').contains('Value 1');
        cy.get('.item-label').contains('Key 2');
        cy.get('.item-value').contains('Value 2');
        cy.get('.item-label').contains('Key 3');
        cy.get('.item-value').contains('Value 3');
        cy.get('.item-label').contains('Key 4');
        cy.get('.item-value').contains('Value 4');
        cy.get('.item-label').contains('Key 5');
        cy.get('.item-value').contains('Value 5');
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('be.visible');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View case details').should('be.visible');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case').should('be.visible');
    });
    cy.get('.text-primary.item-label:visible').contains('Cases shown: 5 of 5');
});

then("I see an open case list page", () => {
    cy.get('.item-value:visible').contains('3001');
});

then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.contains('.text-primary.item-label:visible', 'Cases shown: ').scrollIntoView();
    cy.get('.case-item').should('have.length', nbrOfItems);
});

then("A list of {string} items is displayed out of {string}", (nbrOfItems, totalItems) => {
    cy.contains('.text-primary.item-label:visible', 'Cases shown: ').scrollIntoView();
    cy.get('.case-item:visible').should('have.length', nbrOfItems);
    cy.get('.text-primary.item-label:visible').contains('Cases shown: ' + nbrOfItems + ' of ' + totalItems);
});

then("The api call is made for {string} for open cases", (filterValue) => {
    switch (filterValue) {
        case 'Process 1 (1.0)':
            cy.wait('@process1CasesRoute');
            break;
        case 'Process 2 (1.0)':
            cy.wait('@process2CasesRoute');
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
            cy.wait('@caseNameWithSpecialCharacterRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No open cases are available", () => {
    cy.get('.case-item:visible').should('have.length', 0);
    cy.get('h4').contains('No cases to display').should('be.visible');
});

then("The load more open cases button is disabled", () => {
    cy.contains('button','Load more cases').should('be.disabled');
});

then("The more button has correct href with {string}", (caseId) => {
    cy.get('a .glyphicon-option-horizontal').parent().should('have.attr', 'href', caseDetailsUrl + caseId);
});

then("The go to case details button is disabled", () => {
    cy.get('.isDisabled a').should('have.css', 'pointer-events', 'none');
});

then("The go to case details button is enabled", () => {
    cy.get('.isDisabled').should('not.exist');
});

then("The view case details button at top has correct href with {string}", (caseId) => {
    cy.get('.btn-primary .glyphicon-eye-open').parent().should('have.attr', 'href', caseDetailsUrl + caseId);
});

then("The view case details button in the list has correct href with {string}", (caseId) => {
    cy.get('.btn-link .glyphicon-eye-open').eq(0).parent().should('have.attr', 'href', caseDetailsUrl + caseId);
});

then("The delete open case modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted and will not be stored in the archives. Are you sure you want to delete it?').should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted from the archives. Are you sure you want to delete it?').should('not.exist');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.exist');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.exist');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.exist');
});

then("The deletion is successful", () => {
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
    cy.contains('.modal-body', 'The case has been successfully deleted.').should('be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.disabled');
});

then("The open case list is refreshed", () => {
    cy.wait('@refreshOpenCaseUrlRoute');
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The case does not exist. Reload the page to see the new list of cases.').should('be.visible');
            break;
        case 'not exists during delete':
            cy.contains('.modal-body', 'The case does not exist. Reload the page to see the new list of case.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The case has not been ' + action + '.').should('be.visible');
});

then("The view open case diagram button in the list has correct href with {string}-{string}", (processDefinitionId, caseId) => {
    cy.get('.btn-link .glyphicon-picture').eq(0).parent().should('have.attr', 'href', openCaseDiagramUrl + processDefinitionId + '-' + caseId);
});

then("The api call is made with processId filter", () => {
    cy.wait('@process2CasesRoute');
});

then("The process filter contains the name of the process from url", () => {
    // Value 2 is the one for Process 2
    cy.get('.dropdown input').should('have.value', 'Process 2');
});

then("The api call is made with a different processId", () => {
    cy.wait('@process1CasesRoute');
});

then("There is no {string} button in the open case list", () => {
    cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram').should('not.be.visible');
});

then("The open case item header is displayed correctly", () => {
    cy.contains('.item-label-container p', 'Case ID').should('be.visible');
    cy.contains('.item-label-container p', 'Process name (version)').should('be.visible');
    cy.contains('.item-label-container p', 'Started by').should('be.visible');
    cy.contains('.item-label-container p', 'Start date').should('be.visible');
    cy.contains('.item-label-container p', 'End date').should("not.exist");
    cy.contains('.item-label-container p', 'Failed flow nodes').should('be.visible');
    cy.get('.item-label-container i.glyphicon-info-sign').should('have.attr', 'title', 'Aggregates tasks in states ready, waiting, executing, completing, and initializing.');
    cy.contains('.item-label-container p', 'Pending flow nodes').should('be.visible');
    cy.contains('.item-label-container p', 'Actions').should('be.visible');
});

then("The api call is made for open cases with errors", () => {
    cy.wait('@casesWithErrorCaseStateFilterRoute');
});

then("The api call is made for the default request", () => {
    cy.wait('@openCases5Route');
});

then("{string} url parameter is set to {string}", (name, value) => {
    cy.url().should('include', `${name}=${value}`);
});

then("{string} url parameter is absent or empty", (name) => {
    cy.url().should('satisfy', (urlString) => {
        const url = new URL(urlString);
        return !url.searchParams.has(name) || url.searchParams.get(name) === ''
                    || url.searchParams.get(name) === undefined;
    });
});

then("The process name filter is set to {string}", (processName) => {
    cy.get('.dropdown input').should('have.value', processName);
});

then("The sort filter is set to {string}", (sortValue) => {
    cy.get('.filter-sort option:selected')
        .invoke("text")
        .should("eq", sortValue);
});

then("The search filter is set to {string}", (searchValue) => {
    cy.get('.filter-search input').should('have.value', searchValue);
});

then("The case state filter is set to {string}", (state) => {
    cy.get('.filter-state option:selected')
        .invoke("text")
        .should("eq", state);
});

then("The API call is made with all filters", () => {
    cy.wait('@casesWithAllFiltersRoute');
});

then("The long process name is displayed correctly", () => {
    cy.get('.dropdown-menu button').should('have.css', 'white-space', 'normal');
});
