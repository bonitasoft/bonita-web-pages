const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=processDefinitionId&d=started_by&d=startedBySubstitute&n=activeFlowNodes&n=failedFlowNodes';
const processUrl = urlPrefix + 'API/bpm/process';
const processFilters = '?c=9999&p=0&o=displayName ASC';
const adminOpenCaseListUrl = 'API/bpm/case';
const adminArchivedCaseListUrl = 'API/bpm/archivedCase';
const defaultRequestUrl = urlPrefix + adminOpenCaseListUrl + '?c=20&p=0' + defaultFilters;
const archivedCasesRequestUrl = urlPrefix + adminArchivedCaseListUrl + '?c=20&p=0' + defaultFilters;
const caseDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=';
const refreshOpenCaseUrl = urlPrefix + adminOpenCaseListUrl + '?c=20&p=0' + defaultFilters + '&t=1*';
const openCaseDiagramUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-visu?id=';

given("The filter response {string} is defined for open cases", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'refresh not called':
            cy.route({
                method: "GET",
                url: refreshOpenCaseUrl,
                onRequest: () => {
                    throw new Error("This should have not been called");
                }
            });
            break;
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'openCases5Route', 'openCases5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('&t=0', 'openCases5Route', 'openCases5', {'content-range': '0-5/5'});
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=4778742813773463488', 'process2CasesRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processDefinitionId=7724628355784275506', 'process1CasesRoute', 'process1Cases');
            break;
        case 'sort by':
            createRoute('&t=0&o=id+ASC', 'sortByCaseIdAscRoute');
            createRoute('&t=0&o=id+DESC', 'sortByCaseIdDescRoute');
            createRoute('&t=0&o=name+ASC', 'sortByProcessNameAscRoute');
            createRoute('&t=0&o=name+DESC', 'sortByProcessNameDescRoute');
            createRoute('&t=0&o=startDate+DESC', 'sortByStartDateDescRoute');
            createRoute('&t=0&o=startDate+ASC', 'sortByStartDateAscRoute');
            break;
        case 'search by name':
            createRoute('&t=0&s=Process', 'searchRoute');
            createRouteWithResponse(defaultRequestUrl,'&t=0&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'case state':
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=state=error', 'casesWithFailuresRoute', 'casesWithFailures');
            break;
        case 'refresh open case list':
            createRouteWithResponseAndHeaders('&t=0', 'openCases20Route', 'openCases20', {'content-range': '0-20/35'});
            createRouteWithResponseAndPagination('&t=0', 'openCases10Route', 'openCases10', 2, 10);
            createRouteWithResponse(defaultRequestUrl, '&t=1*', 'openCases20Route', 'openCases20');
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + adminOpenCaseListUrl + '?c=20&p=0', defaultFilters + '&o=name+DESC&t=0', 'sortProcessNameDescRoute', 'openCases20');
            createRouteWithResponse(urlPrefix + adminOpenCaseListUrl + '?c=10&p=2', defaultFilters + '&o=name+DESC', 'sortProcessNameDescRoute2', 'openCases10');
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
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
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

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: url,
            status: status,
            response: '@' + response
        }).as(routeName);
    }

    function createRouteWithResponse(url, queryParameter, routeName, response) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: url + queryParameter,
            response: responseValue
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + adminOpenCaseListUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

when("I visit the admin case list page", () => {
    cy.visit(url);
});

when("I visit the admin case list page with {string} tab query parameter", (tabQueryParameterValue) => {
    cy.visit(url + "?tab=" + tabQueryParameterValue);
});

when("I click on {string} tab", (tabName) => {
    cy.get("a").contains(tabName).click();
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
        switch (filterValue) {
            case 'All processes (all versions)':
                cy.get('select:visible').eq(0).select('0');
                cy.wait('@process1CasesRoute');
                break;
            case 'Process 1 (1.0)':
                cy.get('select:visible').eq(0).select('1');
                break;
            case 'Process 2 (1.0)':
                cy.get('select:visible').eq(0).select('2');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Case ID (Asc)':
                cy.get('select:visible').eq(1).select('0');
                break;
            case 'Case ID (Desc)':
                cy.get('select:visible').eq(1).select('1');
                break;
            case 'Process name (Asc)':
                cy.get('select:visible').eq(1).select('2');
                break;
            case 'Process name (Desc)':
                cy.get('select:visible').eq(1).select('3');
                break;
            case 'Start date (Newest first)':
                cy.get('select:visible').eq(1).select('4');
                break;
            case 'Start date (Oldest first)':
                cy.get('select:visible').eq(1).select('5');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function caseStateFilterOption(filterValue) {
        switch (filterValue) {
            case 'All states':
                cy.get('select:visible').eq(2).select('0');
                break;
            case 'With failures':
                cy.get('select:visible').eq(2).select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input:visible').eq(1).type(filterValue);
    }

    function filterCaseIdForValue(filterValue) {
        cy.get('pb-input input:visible').eq(0).type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input:visible').eq(1).clear();
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

then("The open case list have the correct information", () => {
    cy.get('.case-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('Case ID');
        cy.get('.item-value').contains('3001');
        cy.get('.item-label').contains('Process name (version)');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('Process display name 1');
        cy.get('.item-label').contains('Started by');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-label').contains('Start date');
        cy.get('.item-value').contains('2/8/21 10:41 AM');
        cy.get('.item-label').contains('End date').should("not.exist");
        cy.get('.item-label').contains('Pending tasks');
        cy.get('.item-value').contains('16');
        cy.get('.item-label').contains('Failed Flow Nodes');
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
        cy.get('.glyphicon-picture').should('have.attr', 'title', 'View diagram');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View case details');
        cy.get('.glyphicon-trash').should('have.attr', 'title', 'Delete case');
    });
    cy.get('.text-primary.item-label:visible').contains('Cases shown: 5 of 5');
});

then("I see an open case list page", () => {
    cy.get('.item-value:visible').contains('3001');
});

then("I see an archived case list page", () => {
    cy.get('.item-value:visible').contains('2042');
});

then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.get('.case-item:visible').should('have.length', nbrOfItems);
});

then("A list of {string} items is displayed out of {string}", (nbrOfItems, totalItems) => {
    cy.get('.case-item:visible').should('have.length', nbrOfItems);
    cy.get('.text-primary.item-label:visible').contains('Cases shown: ' + nbrOfItems + ' of ' + totalItems);
});

then("The api call is made for {string} for open cases", (filterValue) => {
    switch (filterValue) {
        case 'Process 1 (1.0)':
            cy.wait('@processesRoute');
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
    cy.get('.btn-primary .glyphicon-option-horizontal').parent().should('have.attr', 'href', caseDetailsUrl + caseId);
});

then("The view case details button in the list has correct href with {string}", (caseId) => {
    cy.get('.btn-link .glyphicon-option-horizontal').eq(0).parent().should('have.attr', 'href', caseDetailsUrl + caseId);
});

then("The delete open case modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted and will not be stored in the archives. Are you sure you want to delete it?').should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted from the archives. Are you sure you want to delete it?').should('not.exist');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.visible');
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