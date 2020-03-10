const urlPrefix = 'build/dist/';
const defaultFilters = '&f=state=ready&d=rootContainerId&d=assigned_id';
const processUrl = urlPrefix + 'API/bpm/process?';
const processFilters = 'c=999&p=0&o=displayName ASC';
const pendingTasksUrl = 'API/bpm/humanTask?';
const defaultRequestUrl = urlPrefix + pendingTasksUrl + 'c=20&p=0' + defaultFilters;

given("The filter response {string} is defined for pending tasks", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '', 'pendingTasks5Route', 'pendingTasks5');
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl,'&f=processId=7623202965572839246', 'newVacationRequestRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl,'&f=processId=8617198282405797017', 'generateRandomCasesRoute', 'generateRandomCases');
            break;
        case 'sort by':
            createRoute('&o=displayName+ASC', 'sortByDisplayNameAscRoute');
            createRoute('&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createRoute('&o=dueDate+ASC', 'sortByDueDateAscRoute');
            createRoute('&o=dueDate+DESC', 'sortByDueDateDescRoute');
            createRoute('&o=priority+ASC', 'sortByPriorityAscRoute');
            createRoute('&o=priority+DESC', 'sortByPriorityDescRoute');
            break;
        case 'search by name':
            createRoute('&s=InvolveUser', 'searchRoute');
            createRouteWithResponse(defaultRequestUrl,'&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'filter by caseId':
            createRoute('&f=caseId=2001', 'filterByCaseId2001Route');
            createRoute('&f=caseId=3001', 'filterByCaseId3001Route');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl,'', 'pendingTasks20Route', 'pendingTasks20');
            createRouteWithResponseAndPagination('', 'pendingTasks10Route', 'pendingTasks10', 2, 10);
            createRouteWithResponseAndPagination('', 'pendingTasks5Route', 'pendingTasks5', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl, '', 'pendingTasks20Route', 'pendingTasks20');
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
        const loadMoreUrl = urlPrefix + pendingTasksUrl + 'c=' + count + '&p=' + page + defaultFilters;
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

when("I click on {string} tab", (tabName) => {
    cy.get("a").contains(tabName).click();
});

when("I put {string} in {string} filter field for pending tasks", (filterValue, filterType) => {
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
            case 'Display name (Asc)':
                cy.get('select:visible').eq(1).select('0');
                break;
            case 'Display name (Desc)':
                cy.get('select:visible').eq(1).select('1');
                break;
            case 'Due date (Closest first)':
                cy.get('select:visible').eq(1).select('2');
                break;
            case 'Due date (Furthest first)':
                cy.get('select:visible').eq(1).select('3');
                break;
            case 'Priority (Lowest - Highest)':
                cy.get('select:visible').eq(1).select('4');
                break;
            case 'Priority (Highest - Lowest)':
                cy.get('select:visible').eq(1).select('5');
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

when("I click on Load more pending tasks button", () => {
    cy.contains('button','Load more tasks').click();
});

then("I see the failed flow nodes page", () => {
    cy.get('.item-value:visible').contains('60002');
});

then("The pending tasks list have the correct information", () => {
    cy.get('.task-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('Priority');
        cy.get('.item-value').contains('Highest');
        cy.get('.item-label').contains('ID');
        cy.get('.item-value').contains('100227');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('InvolveUser');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('InvolveUser');
        cy.get('.item-label').contains('Done on').should("not.exist");
        cy.get('.item-label').contains('Failed on').should("not.exist");
        cy.get('.item-label').contains('Due date');
        cy.get('.item-value').contains('--');
        cy.get('.item-label').contains('Case ID');
        cy.get('.item-value').contains('5049');
        cy.get('.item-label').contains('Process name (version)');
        cy.get('.item-value').contains('VacationRequest (2.0)');
        cy.get('.item-label').contains('Process display name');
        cy.get('.item-value').contains('New vacation request with means of transportation');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View task details')
    });
});

then("The pending tasks list have the correct item shown number", () => {
    cy.get('.text-primary.item-label:visible').contains('Pending tasks shown: 5');
});

then("The api call is made for {string} for pending tasks", (filterValue) => {
    switch (filterValue) {
        case 'generateRandomCases (1.0)':
            cy.wait('@processesRoute');
            break;
        case 'New vacation request with means of transportation (2.0)':
            cy.wait('@newVacationRequestRoute');
            break;
        case 'Display name (Asc)':
            cy.wait('@sortByDisplayNameAscRoute');
            break;
        case 'Display name (Desc)':
            cy.wait('@sortByDisplayNameDescRoute');
            break;
        case 'Due date (Closest first)':
            cy.wait('@sortByDueDateAscRoute');
            break;
        case 'Due date (Furthest first)':
            cy.wait('@sortByDueDateDescRoute');
            break;
        case 'Priority (Lowest - Highest)':
            cy.wait('@sortByPriorityAscRoute');
            break;
        case 'Priority (Highest - Lowest)':
            cy.wait('@sortByPriorityDescRoute');
            break;
        case 'InvolveUser':
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

then("The load more button has the correct text", () => {
    cy.get("button").contains("Load more tasks").should("exist");
    cy.get("button").contains("Load more flow nodes").should("not.be.visible");
});

then("No pending tasks are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.get('h4').contains('No pending tasks to display').should('be.visible');
    cy.get('h4').contains('No failed flow nodes to display').should('not.be.visible');
});

then("{string} items in the list are overdue", (overdueItems) => {
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.length", overdueItems);
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.attr", "title", "This task is overdue");
});

then("I see the pending tasks page", (overdueItems) => {
    cy.get('.item-value:visible').contains('100227');
});

then("The load more pending tasks button is disabled", () => {
    cy.contains('button','Load more tasks').should('be.disabled');
});
