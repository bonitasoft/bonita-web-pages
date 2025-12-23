import { Given as given, Then as then, When as when } from "@badeball/cypress-cucumber-preprocessor";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const defaultFilters = '&f=state=pending&d=rootContainerId&d=assigned_id';
const pendingTasksUrl = 'API/bpm/flowNode?';
const defaultRequestUrl = urlPrefix + pendingTasksUrl + 'c=10&p=0' + defaultFilters;

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given("The filter response {string} is defined for pending tasks", (filterType) => {
    switch (filterType) {
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '&t=0', 'pendingTasks5Route', 'pendingTasks5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('&t=0', 'pendingTasks5Route', 'pendingTasks5', {'content-range': '0-5/5'});
            break;
        case 'process name':
            createProcessRouteWithQueryMatcher('processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processId=7623202965572839246', 'newVacationRequestRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl,'&t=0&f=processId=8617198282405797017', 'generateRandomCasesRoute', 'generateRandomCases');
            break;
        case 'sort by':
            createRouteWithQueryMatcher({'o': 'displayName ASC', 't': '0'}, 'sortByDisplayNameAscRoute');
            createRouteWithQueryMatcher({'o': 'displayName DESC', 't': '0'}, 'sortByDisplayNameDescRoute');
            createRouteWithQueryMatcher({'o': 'dueDate ASC', 't': '0'}, 'sortByDueDateAscRoute');
            createRouteWithQueryMatcher({'o': 'dueDate DESC', 't': '0'}, 'sortByDueDateDescRoute');
            createRouteWithQueryMatcher({'o': 'priority ASC', 't': '0'}, 'sortByPriorityAscRoute');
            createRouteWithQueryMatcher({'o': 'priority DESC', 't': '0'}, 'sortByPriorityDescRoute');
            break;
        case 'search by name':
            createRoute('&t=0&s=InvolveUser', 'searchRoute');
            createRouteForSpecialCharacter(urlPrefix + 'API/bpm/flowNode', '&Special', 'filterByTaskNameWithSpecialCharacterRoute')
            createRouteWithResponse(defaultRequestUrl,'&t=0&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'filter by caseId':
            createRoute('&t=0&f=rootCaseId=2001', 'filterByCaseId2001Route');
            createRoute('&t=0&f=rootCaseId=3001', 'filterByCaseId3001Route');
            break;
        case 'filter by parentCaseId':
            createRoute('&t=0&f=parentCaseId=2001', 'filterByParentCaseId2001Route');
            createRoute('&t=0&f=parentCaseId=3001', 'filterByParentCaseId3001Route');
            break;
        case 'refresh pending tasks list':
            createRouteWithResponseAndHeaders('&t=0', 'pendingTasks10Route', 'pendingTasks10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination('&t=0', 'pendingTasks10Route', 'pendingTasks10', 1, 10);
            createRouteWithResponseAndPagination('&t=0', 'pendingTasks10Route', 'pendingTasks10', 2, 10);
            createRouteWithResponse(defaultRequestUrl, '&t=1*', 'pendingTasks10Route', 'pendingTasks10');
            break;
        case "no pending task":
            createRouteWithResponse(defaultRequestUrl + defaultFilters, '&t=0', 'emptyResultRoute', 'emptyResult');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(queryParameter, routeName) {
        cy.intercept('GET', defaultRequestUrl + queryParameter).as(routeName);
    }

    function createRouteForSpecialCharacter(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'f': 'state=pending',
                'd[0]': 'rootContainerId',
                'd[1]': 'assign_id',
                't': '0',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRouteWithResponse(url, queryParameter, routeName, response) {
        cy.intercept('GET', url + queryParameter, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }

    function createRouteWithResponseAndHeaders(queryParameter, routeName, response, headers) {
        cy.intercept('GET', defaultRequestUrl + queryParameter, {
            fixture: 'json/' + response + '.json',
            headers: headers
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + pendingTasksUrl + 'c=' + count + '&p=' + page + defaultFilters;
        cy.intercept('GET', loadMoreUrl + queryParameter, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }

    function createRouteWithQueryMatcher(query, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + urlPrefix + pendingTasksUrl.replace('?', ''),
            query: {
                'c': '10',
                'p': '0',
                'f': 'state=ready',
                ...query
            }
        }).as(routeName);
    }

    function createProcessRouteWithQueryMatcher(routeName, response) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + urlPrefix + 'API/bpm/process',
            query: {
                'c': '999',
                'p': '0',
                'o': 'displayName ASC'
            }
        }, {
            fixture: 'json/' + response + '.json'
        }).as(routeName);
    }
});

when("I click on {string} tab", (tabName) => {
    cy.contains("a", tabName).click();
});

when("I click on {string} radio button", (radioLabel) => {
    cy.get('.case-filter-mode label').filter(':contains('+ radioLabel + ')').children('input').eq(0).click();
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
    cy.contains('.item-value:visible', '60002');
});

then("The pending tasks list have the correct information", () => {
    cy.contains('.item-label-container p', 'Priority').should('be.visible');
    cy.contains('.item-label-container p', 'ID').should('be.visible');
    cy.contains('.item-label-container p', 'Display name').should('be.visible');
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Type').should('be.visible');
    cy.contains('.item-label-container p', 'Due date').should('be.visible');
    cy.contains('.item-label-container p', 'Done on').should('not.exist');
    cy.contains('.item-label-container p', 'Failed on').should('not.exist');
    cy.contains('.item-label-container p', 'View details').should('be.visible');
    cy.get('.task-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'Highest');
        cy.contains('.item-value', '100227');
        cy.contains('.item-value', 'InvolveUser');
        cy.contains('.item-value', 'InvolveUser');
        cy.contains('.item-value', '--');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '5049');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'VacationRequest (2.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'New vacation request with means of transportation');
        cy.contains('.item-label', 'Description');
        cy.contains('.item-value', 'This is a pending task description.');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });

    cy.get('.task-item:visible').eq(1).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', '--');
        cy.contains('.item-value', '100229');
        cy.contains('.item-value', 'InvolveUser');
        cy.contains('.item-value', 'InvolveUser');
        cy.contains('.item-value', '1/22/20 5:51 PM');
        cy.get('.item-value i.glyphicon-alert').should('have.attr', 'title', 'This task is overdue');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '5050');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'VacationRequest (2.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'New vacation request with means of transportation');
        cy.contains('.item-label', 'Description');
        cy.contains('.item-value', 'No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details')
    });
});

then("The pending tasks list have the correct item shown number", () => {
    cy.contains('.text-primary.item-label:visible', 'Pending tasks shown: 5 of 5');
});

then("A list of {string} pending tasks is displayed out of {string}", (nbrOfItems, totalItems) => {
    cy.get('.task-item:visible').should('have.length', nbrOfItems);
cy.contains('.text-primary.item-label:visible', 'Pending tasks shown: ' + nbrOfItems + ' of ' + totalItems);
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
        case 'parent 2001':
            cy.wait('@filterByParentCaseId2001Route');
            break;
        case 'parent 3001':
            cy.wait('@filterByParentCaseId3001Route');
            break;
        case '&Special':
            cy.wait('@filterByTaskNameWithSpecialCharacterRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No pending tasks are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.contains('h4', 'No pending tasks to display').should('be.visible');
    cy.contains('h4', 'No failed flow nodes to display').should('not.exist');
});

then("{string} items in the list are overdue", (overdueItems) => {
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.length", overdueItems);
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.attr", "title", "This task is overdue");
});

then("I see the pending tasks page", (overdueItems) => {
    cy.contains('.item-value:visible', '100227');
});