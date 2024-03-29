import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&f=state=failed&d=rootContainerId&d=assigned_id';
const failedFlowNodesUrl = 'API/bpm/flowNode?';
const defaultRequestUrl = urlPrefix + failedFlowNodesUrl + 'c=10&p=0' + defaultFilters;
const processUrl = urlPrefix + 'API/bpm/process?';
const processFilters = 'c=999&p=0&o=displayName ASC';
const defaultSortOrder = '&o=lastUpdateDate+DESC';
const failedFlowNodeDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=';
const pendingTaskRequestUrl = urlPrefix + 'API/bpm/humanTask?c=10&p=0' + defaultFilters;
const doneTaskRequestUrl = urlPrefix + 'API/bpm/archivedTask?c=10&p=0' + defaultFilters;

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'failedFlowNodes5Route', 'failedFlowNodes5');
            break;
        case 'default filter with headers':
            createRouteWithResponseAndHeaders('&t=0', 'failedFlowNodes5Route', 'failedFlowNodes5', {'content-range': '0-5/5'});
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl, '&t=0&f=processId=7623202965572839246', 'newVacationRequestRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl, '&t=0&f=processId=8617198282405797017', 'generateRandomCasesRoute', 'generateRandomCases');
            break;
        case 'sort by':
            createRoute('&t=0&o=name+ASC', 'sortByNameAscRoute');
            createRoute('&t=0&o=name+DESC', 'sortByNameDescRoute');
            createRoute('&t=0&o=lastUpdateDate+ASC', 'sortByUpdateDateAscRoute');
            createRoute('&t=0' + defaultSortOrder, 'sortByUpdateDateDescRoute');
            break;
        case 'search by name':
            createRoute('&t=0&s=Alowscenario', 'searchRoute');
            createRouteForSpecialCharacter(urlPrefix + 'API/bpm/flowNode', '&Special', 'filterByTaskNameWithSpecialCharacterRoute')
            createRouteWithResponse(defaultRequestUrl, '&t=0&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'filter by caseId':
            createRoute('&t=0&f=caseId=2001', 'filterByCaseId2001Route');
            createRoute('&t=0&f=caseId=3001', 'filterByCaseId3001Route');
            break;
        case 'refresh failed flow nodes list':
            createRouteWithResponseAndHeaders('&t=0', 'failedFlowNodes10Route', 'failedFlowNodes10', {'content-range': '0-10/35'})
            createRouteWithResponseAndPagination('&t=0', 'failedFlowNodes10Route', 'failedFlowNodes10', 1, 10);
            createRouteWithResponseAndPagination('&t=0', 'failedFlowNodes10Route', 'failedFlowNodes10', 2, 10);
            createRouteWithResponse(defaultRequestUrl, '&t=1*', 'failedFlowNodes10Route', 'failedFlowNodes10');
            break;
        case 'empty default filter':
            createRouteWithResponse(defaultRequestUrl, '', 'emptyResultRoute', 'emptyResult');
            break;
        case 'empty process list':
            createRouteWithResponse(processUrl, processFilters, 'emptyResultRoute', 'emptyResult');
            break;
        case 'only failed flow node api call':
            cy.route({
                method: "GET",
                url: pendingTaskRequestUrl + defaultSortOrder,
                onRequest: () => {
                    throw new Error("The pending task api should have not been called");
                }
            });

            cy.route({
                method: "GET",
                url: doneTaskRequestUrl + defaultSortOrder,
                onRequest: () => {
                    throw new Error("The done task api should have not been called");
                }
            });
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

    function createRouteForSpecialCharacter(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f': 'state=failed',
                'd[0]': 'rootContainerId',
                'd[1]': 'assigned_id',
                't': '0',
                's': searchParameter
            }
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
        const loadMoreUrl = urlPrefix + failedFlowNodesUrl + 'c=' + count + '&p=' + page + defaultFilters;
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

when("I visit admin task list page", () => {
    cy.visit(url);
});

when("I visit admin task list page with caseId {string} in URL parameter", (caseId) => {
    cy.visit(url + "?caseId=" + caseId);
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
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
        default:
            throw new Error("Unsupported case");
    }

    function selectFilterProcessNameOption(filterValue) {
        switch (filterValue) {
            case 'All processes (all versions)':
                cy.get('select').eq(0).select('0');
                cy.wait('@generateRandomCasesRoute');
                break;
            case 'generateRandomCases (1.0)':
                cy.get('select').eq(0).select('1');
                break;
            case 'New vacation request with means of transportation (2.0)':
                cy.get('select').eq(0).select('2');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Flow node name (Asc)':
                cy.get('select').eq(1).select('0');
                break;
            case 'Flow node name (Desc)':
                cy.get('select').eq(1).select('1');
                break;
            case 'Failed on (Newest first)':
                cy.get('select').eq(1).select('2');
                break;
            case 'Failed on (Oldest first)':
                cy.get('select').eq(1).select('3');
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

when("I erase the caseId filter", () => {
    cy.get('pb-input input:visible').eq(0).clear();
});

when("I click on Load more flow nodes button", () => {
    cy.contains('button', 'Load more flow nodes').click();
});

when("I click on refresh", ()=>{
    cy.get('button i.glyphicon-repeat:visible').click();
});

then("The failed flow nodes list have the correct information", () => {
    cy.contains('.item-label-container p', 'Priority').should('be.visible');
    cy.contains('.item-label-container p', 'ID').should('be.visible');
    cy.contains('.item-label-container p', 'Display name').should('be.visible');
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Type').should('be.visible');
    cy.contains('.item-label-container p', 'Failed on').should('be.visible');
    cy.contains('.item-label-container p', 'Done on').should('not.exist');
    cy.contains('.item-label-container p', 'Due date').should('not.exist');
    cy.contains('.item-label-container p', 'View details').should('be.visible');
    cy.get('.task-item').eq(0).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', '--');
        cy.contains('.item-value', '60002');
        cy.contains('.item-value', 'ALowScenario');
        cy.contains('.item-value', 'ALowScenario display name');
        cy.contains('.item-value', 'User task');
        cy.contains('.item-value', '1/16/20 10:13 AM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '3001');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'generateRandomCases (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'generateRandomCases display name');
        cy.contains('.item-label', 'Description');
        cy.contains('.item-value', 'This is a failed flow node description.');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
    cy.get('.task-item').eq(1).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'Lowest');
        cy.contains('.item-value', '60003');
        cy.contains('.item-value', 'A Lowest Scenario');
        cy.contains('.item-value', 'A Lowest Scenario display name');
        cy.contains('.item-value', 'User task');
        cy.contains('.item-value', '1/16/20 10:13 AM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '4001');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'generateCases (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'generateCases display name');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
    cy.get('.task-item').eq(2).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'Highest');
        cy.contains('.item-value', '60004');
        cy.contains('.item-value', 'A Highest Scenario');
        cy.contains('.item-value', 'A Highest Scenario display name');
        cy.contains('.item-value', 'User task');
        cy.contains('.item-value', '1/16/20 10:13 AM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '5001');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'cases (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'Cases display name');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
    cy.get('.task-item').eq(3).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'High');
        cy.contains('.item-value', '60005');
        cy.contains('.item-value', 'A High Scenario');
        cy.contains('.item-value', 'A High Scenario display name');
        cy.contains('.item-value', 'User task');
        cy.contains('.item-value', '1/16/20 10:13 AM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '6001');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'donotgenerateRandomCases (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'Do not generateRandomCases display name');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
    cy.get('.task-item').eq(4).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'Normal');
        cy.contains('.item-value', '60006');
        cy.contains('.item-value', 'A Normal Scenario');
        cy.contains('.item-value', 'A Normal Scenario display name');
        cy.contains('.item-value', 'User task');
        cy.contains('.item-value', '1/16/20 10:13 AM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '7001');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'donotgenerateCases (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'Do not generateCases display name');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
});

then("The failed flow nodes list have the correct item shown number", () => {
    cy.contains('.text-primary.item-label:visible', 'Failed flow nodes shown: 5 of 5');
});

then("A list of {string} failed flow nodes is displayed out of {string}", (nbrOfItems, totalItems) => {
    cy.get('.task-item:visible').should('have.length', nbrOfItems);
cy.contains('.text-primary.item-label:visible', 'Failed flow nodes shown: ' + nbrOfItems + ' of ' + totalItems);
});


then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.get('.task-item:visible').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'generateRandomCases (1.0)':
            cy.wait('@processesRoute');
            break;
        case 'New vacation request with means of transportation (2.0)':
            cy.wait('@newVacationRequestRoute');
            break;
        case 'Flow node name (Asc)':
            cy.wait('@sortByNameAscRoute');
            break;
        case 'Flow node name (Desc)':
            cy.wait('@sortByNameDescRoute');
            break;
        case 'Failed on (Newest first)':
            cy.wait('@sortByUpdateDateDescRoute');
            break;
        case 'Failed on (Oldest first)':
            cy.wait('@sortByUpdateDateAscRoute');
            break;
        case 'Alowscenario':
            cy.wait('@searchRoute');
            break;
        case '2001':
            cy.wait('@filterByCaseId2001Route');
            break;
        case '3001':
            cy.wait('@filterByCaseId3001Route');
            break;
        case '&Special':
            cy.wait('@filterByTaskNameWithSpecialCharacterRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No failed flow nodes are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.contains('No failed flow nodes to display').should('be.visible');
});

then("The more button has correct href with {string}", (flowNodeId) => {
    cy.get('a .glyphicon-eye-open').parent().should('have.attr', 'href', failedFlowNodeDetailsUrl + flowNodeId);
});

then("Only the no failed flow node is displayed", () => {
    cy.contains('h4:visible', 'No failed flow nodes to display').should('be.visible');
    cy.contains('h4:visible', 'No done tasks to display').should('not.exist');
    cy.contains('h4:visible', 'No pending tasks to display').should('not.exist');
});

then("The filter by process is disabled", () => {
    cy.get('select:visible').eq(0).should('be.disabled');
});