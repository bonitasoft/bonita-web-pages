const urlPrefix = 'build/dist/';
const defaultFilters = '&d=processDefinitionId&d=started_by&d=startedBySubstitute';
const processUrl = urlPrefix + 'API/bpm/process';
const processFilters = '?c=9999&p=0&o=displayName ASC';
const adminArchivedCaseListUrl = 'API/bpm/archivedCase';
const defaultRequestUrl = urlPrefix + adminArchivedCaseListUrl + '?c=20&p=0' + defaultFilters;
const openCasesRequestUrl = urlPrefix + 'API/bpm/case' + '?c=20&p=0' + defaultFilters + '&n=activeFlowNodes&n=failedFlowNodes&t=0';
const refreshArchivedCaseUrl = urlPrefix + adminArchivedCaseListUrl + '?c=20&p=0' + defaultFilters + '&t=1*';
const archivedCaseDiagramUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-visu?id=';

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
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('&t=0', 'archivedCases5Route', 'archivedCases5', {'content-range': '0-5/5'});
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl,'&f=processDefinitionId=4778742813773463488&t=0', 'process2CasesRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl,'&f=processDefinitionId=7724628355784275506&t=0', 'archivedProcess1CasesRoute', 'archivedProcess1Cases');
            break;
        case 'sort by':
            createRoute('&o=sourceObjectId+ASC&t=0', 'sortByCaseIdAscRoute');
            createRoute('&o=sourceObjectId+DESC&t=0', 'sortByCaseIdDescRoute');
            createRoute('&o=name+ASC&t=0', 'sortByProcessNameAscRoute');
            createRoute('&o=name+DESC&t=0', 'sortByProcessNameDescRoute');
            createRoute('&o=startDate+DESC&t=0', 'sortByStartDateDescRoute');
            createRoute('&o=startDate+ASC&t=0', 'sortByStartDateAscRoute');
            break;
        case 'search by name':
            createRoute('&s=Process&t=0', 'searchRoute');
            createRouteWithResponse(defaultRequestUrl,'&s=Search term with no match&t=0', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponseAndHeaders('&t=0', 'archivedCases20Route', 'archivedCases20', {'content-range': '0-20/35'});
            createRouteWithResponseAndPagination('', 'archivedCases10Route', 'archivedCases10', 2, 10);
            createRouteWithResponseAndPagination('', 'archivedCases5Route', 'archivedCases5', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'archivedCases20Route', 'archivedCases20');
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'enable 30 load more':
            createRouteWithResponseAndHeaders('&t=0', 'archivedCases20Route', 'archivedCases20', {'content-range': '0-20/35'});
            createRouteWithResponseAndPagination('', 'archivedCases10Route', 'archivedCases10', 2, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + adminArchivedCaseListUrl + '?c=20&p=0', defaultFilters + '&o=name+DESC&t=0', 'sortProcessNameDescRoute', 'archivedCases20');
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

given("No api call is made for open cases", () => {
    cy.route({
        method: "GET",
        url: openCasesRequestUrl,
        onRequest: () => {
            throw new Error("This should have not been called");
        }
    });
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
        switch (filterValue) {
            case 'All processes (all versions)':
                cy.get('select:visible').eq(0).select('0');
                cy.wait('@archivedProcess1CasesRoute');
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

when("I click on Load more archived cases button", () => {
    cy.contains('button','Load more cases').click();
});

then("The archived case list have the correct information", () => {
    cy.get('.case-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('Case ID (original)');
        cy.get('.item-value').contains('2042');
        cy.get('.item-label').contains('Process name (version)');
        cy.get('.item-value').contains('Process 1 (1.0)');
        cy.get('.item-value').contains('Process display name 1');
        cy.get('.item-label').contains('Started by');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-label').contains('Start date');
        cy.get('.item-value').contains('2/5/21 2:12 PM');
        cy.get('.item-label').contains('End date');
        cy.get('.item-value').contains('2/5/21 4:00 PM');
        cy.get('.item-label').contains('State');
        cy.get('.item-value').contains('completed');
        cy.get('.item-label').contains('Pending tasks').should('not.exist');
        cy.get('.item-label').contains('Failed Flow Nodes').should('not.exist');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View case details');
    });
    cy.get('.text-primary.item-label:visible').contains('Cases shown: 5 of 5');
});

then("The api call is made for {string} for archived cases", (filterValue) => {
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

then("No archived cases are available", () => {
    cy.get('.case-item:visible').should('have.length', 0);
    cy.get('h4').contains('No open cases to display').should('not.be.visible');
    cy.get('h4').contains('No archived cases to display').should('be.visible');
});

then("The load more archived cases button is disabled", () => {
    cy.contains('button','Load more cases').should('be.disabled');
});

then("The delete archived case modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted and will not be stored in the archives. Are you sure you want to delete it?').should('not.exist');
    cy.contains('.modal-body p', 'The deleted case will be permanently deleted from the archives. Are you sure you want to delete it?').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The archived case list is refreshed", () => {
    cy.wait('@refreshArchivedCaseUrlRoute');
});

then("The view archived case diagram button in the list has correct href with {string}-{string}", (processDefinitionId, caseId) => {
    cy.get('.btn-link .glyphicon-picture').eq(0).parent().should('have.attr', 'href', archivedCaseDiagramUrl + processDefinitionId + '-' + caseId);
});