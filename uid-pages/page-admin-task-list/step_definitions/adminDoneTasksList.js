const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=rootContainerId&d=assigned_id';
const doneTasksUrl = 'API/bpm/archivedTask?';
const defaultRequestUrl = urlPrefix + doneTasksUrl + 'c=20&p=0' + defaultFilters;
const processUrl = urlPrefix + 'API/bpm/process?';
const processFilters = 'c=999&p=0&o=displayName ASC';
const defaultSortOrder = '&o=reached_state_date+DESC';
const doneTaskDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/adminFlowNodeDetails?id=';

given("The filter response {string} is defined for done tasks", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter":
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'doneTasks5Route', 'doneTasks5');
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl,'&f=processId=7623202965572839246' + defaultSortOrder, 'newVacationRequestRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl,'&f=processId=8617198282405797017' + defaultSortOrder, 'generateRandomCasesRoute', 'generateRandomCases');
            break;
        case 'sort by':
            createRoute('&o=sourceObjectId+ASC', 'sortByOriginalIdAscRoute');
            createRoute('&o=sourceObjectId+DESC', 'sortByOriginalIdDescRoute');
            createRoute('&o=priority+ASC', 'sortByPriorityAscRoute');
            createRoute('&o=priority+DESC', 'sortByPriorityDescRoute');
            createRoute('&o=displayName+ASC', 'sortByDisplayNameAscRoute');
            createRoute('&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createRoute('&o=reached_state_date+ASC', 'sortByDoneOnAscRoute');
            createRoute('&o=caseId+ASC', 'sortByCaseIdAscRoute');
            createRoute('&o=caseId+DESC', 'sortByCaseIdDescRoute');
            break;
        case 'search by name':
            createRoute(defaultSortOrder + '&s=Alowscenario', 'searchRoute');
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder,'&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'filter by caseId':
            createRoute('&f=caseId=2001' + defaultSortOrder, 'filterByCaseId2001Route');
            createRoute('&f=caseId=3001' + defaultSortOrder, 'filterByCaseId3001Route');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder,'', 'failedFlowNodes20Route', 'failedFlowNodes20');
            createRouteWithResponseAndPagination('', 'failedFlowNodes10Route', 'failedFlowNodes10', 2, 10);
            createRouteWithResponseAndPagination('', 'failedFlowNodes5Route', 'failedFlowNodes5', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'failedFlowNodes20Route', 'failedFlowNodes20');
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
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
        const loadMoreUrl = urlPrefix + doneTasksUrl + 'c=' + count + '&p=' + page + defaultFilters + defaultSortOrder;
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

when("I put {string} in {string} filter field for done tasks", (filterValue, filterType) => {
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
                cy.get('select:visible').eq(0).select('0');
                cy.wait('@generateRandomCasesRoute');
                break;
            case 'generateRandomCases (1.0)':
                cy.get('select:visible').eq(0).select('1');
                break;
            case 'New vacation request with means of transportation (2.0)':
                cy.get('select:visible').eq(0).select('2');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Original ID (Asc)':
                cy.get('select:visible').eq(1).select('0');
                break;
            case 'Original ID (Desc)':
                cy.get('select:visible').eq(1).select('1');
                break;
            case 'Priority (Lowest - Highest)':
                cy.get('select:visible').eq(1).select('2');
                break;
            case 'Priority (Highest - Lowest)':
                cy.get('select:visible').eq(1).select('3');
                break;
            case 'Display name (Asc)':
                cy.get('select:visible').eq(1).select('4');
                break;
            case 'Display name (Desc)':
                cy.get('select:visible').eq(1).select('5');
                break;
            case 'Done on (Newest first)':
                cy.get('select:visible').eq(1).select('6');
                break;
            case 'Done on (Oldest first)':
                cy.get('select:visible').eq(1).select('7');
                break;
            case 'Case ID (Asc)':
                cy.get('select:visible').eq(1).select('8');
                break;
            case 'Case ID (Desc)':
                cy.get('select:visible').eq(1).select('9');
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

when("I click on Load more tasks button", () => {
    cy.contains('button','Load more tasks').click();
});

then("The done tasks list have the correct information", () => {
    cy.get('.task-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('Priority');
        cy.get('.item-value').contains('Lowest');
        cy.get('.item-label').contains('ID (original)');
        cy.get('.item-value').contains('140081');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('InvolveUser');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('InvolveUserDisplayName');
        cy.get('.item-label').contains('Failed on').should("not.exist");
        cy.get('.item-label').contains('Due date').should("not.exist");
        cy.get('.item-label').contains('Done on');
        cy.get('.item-value').contains('2/5/20 4:00 PM');
        cy.get('.item-label').contains('Case ID');
        cy.get('.item-value').contains('7024');
        cy.get('.item-label').contains('Process name (version)');
        cy.get('.item-value').contains('PublishDailyMeal (1.0)');
        cy.get('.item-label').contains('Process display name');
        cy.get('.item-value').contains('Publish daily meal by mail for all the team');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View task details');
    });
});

then("The done tasks list have the correct item shown number", () => {
    cy.get('.text-primary.item-label:visible').contains('Done tasks shown: 5');
});

then("The api call is made for {string} for done tasks", (filterValue) => {
    switch (filterValue) {
        case 'generateRandomCases (1.0)':
            cy.wait('@processesRoute');
            break;
        case 'New vacation request with means of transportation (2.0)':
            cy.wait('@newVacationRequestRoute');
            break;
        case 'Original ID (Asc)':
            cy.wait('@sortByOriginalIdAscRoute');
            break;
        case 'Original ID (Desc)':
            cy.wait('@sortByOriginalIdDescRoute');
            break;
        case 'Priority (Lowest - Highest)':
            cy.wait('@sortByPriorityAscRoute');
            break;
        case 'Priority (Highest - Lowest)':
            cy.wait('@sortByPriorityDescRoute');
            break;
        case 'Display name (Asc)':
            cy.wait('@sortByDisplayNameAscRoute');
            break;
        case 'Display name (Desc)':
            cy.wait('@sortByDisplayNameDescRoute');
            break;
        case 'Done on (Newest first)':
            cy.wait('@doneTasks5Route');
            break;
        case 'Done on (Oldest first)':
            cy.wait('@sortByDoneOnAscRoute');
            break;
        case 'Case ID (Asc)':
            cy.wait('@sortByCaseIdAscRoute');
            break;
        case 'Case ID (Desc)':
            cy.wait('@sortByCaseIdDescRoute');
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
        default:
            throw new Error("Unsupported case");
    }
});

then("I see the done tasks page", () => {
    cy.get('.item-value:visible').contains('140081');
});

then("The load more button has the correct text", () => {
    cy.get("button").contains("Load more tasks").should("exist");
    cy.get("button").contains("Load more flow nodes").should("not.be.visible");
});

then("No done tasks are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.get('h4:visible').contains('No done tasks to display').should('be.visible');
    cy.get('h4:visible').contains('No failed flow nodes to display').should('not.be.visible');
});

then("The more button has correct href with {string} for done tasks", (doneTaskId) => {
    cy.get('a .glyphicon-option-horizontal:visible').parent().should('have.attr', 'href', doneTaskDetailsUrl + doneTaskId);
});

then("The load more tasks button is disabled", () => {
    cy.contains('button','Load more tasks').should('be.disabled');
});
