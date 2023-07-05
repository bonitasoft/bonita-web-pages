import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=rootContainerId&d=assigned_id';
const doneTasksUrl = 'API/bpm/archivedTask?';
const defaultRequestUrl = urlPrefix + doneTasksUrl + 'c=10&p=0';
const processUrl = urlPrefix + 'API/bpm/process?';
const processFilters = 'c=999&p=0&o=displayName ASC';
const defaultSortOrder = '&o=reached_state_date+DESC';
const doneTaskDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=';

given("The filter response {string} is defined for done tasks", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter":
            createRouteWithResponse(defaultRequestUrl + defaultFilters, '&t=0' + defaultSortOrder, 'doneTasks5Route', 'doneTasks5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders('&t=0' + defaultSortOrder, 'doneTasks5Route', 'doneTasks5', {'content-range': '0-5/5'});
            break;
        case 'process name':
            createRouteWithResponse(processUrl, processFilters, 'processesRoute', 'processes');
            createRouteWithResponse(defaultRequestUrl + defaultFilters,'&t=0&f=processId=7623202965572839246' + defaultSortOrder, 'newVacationRequestRoute', 'emptyResult');
            createRouteWithResponse(defaultRequestUrl + defaultFilters,'&t=0&f=processId=8617198282405797017' + defaultSortOrder, 'generateRandomCasesRoute', 'generateRandomCases');
            break;
        case 'sort by':
            createRoute('&t=0&o=sourceObjectId+ASC', 'sortByOriginalIdAscRoute');
            createRoute('&t=0&o=sourceObjectId+DESC', 'sortByOriginalIdDescRoute');
            createRoute('&t=0&o=priority+ASC', 'sortByPriorityAscRoute');
            createRoute('&t=0&o=priority+DESC', 'sortByPriorityDescRoute');
            createRoute('&t=0&o=displayName+ASC', 'sortByDisplayNameAscRoute');
            createRoute('&t=0&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createRoute('&t=0&o=reached_state_date+ASC', 'sortByDoneOnAscRoute');
            createRoute('&t=0&o=caseId+ASC', 'sortByCaseIdAscRoute');
            createRoute('&t=0&o=caseId+DESC', 'sortByCaseIdDescRoute');
            break;
        case 'search by name':
            createRoute('&t=0' + defaultSortOrder + '&s=Alowscenario', 'searchRoute');
            createRouteWithResponse(defaultRequestUrl + defaultFilters + '&t=0' + defaultSortOrder,'&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'filter by caseId':
            createRoute('&t=0&f=caseId=2001' + defaultSortOrder, 'filterByCaseId2001Route');
            createRoute('&t=0&f=caseId=3001' + defaultSortOrder, 'filterByCaseId3001Route');
            break;
        case 'refresh done tasks list':
            createRouteWithResponseAndHeaders('&t=0' + defaultSortOrder, 'doneTasks10Route', 'doneTasks10', {'content-range': '0-10/35'});
            createRouteWithResponseAndPagination('&t=0' + defaultSortOrder, 'doneTasks10Route', 'doneTasks10', 1, 10);
            createRouteWithResponseAndPagination('&t=0' + defaultSortOrder, 'doneTasks10Route', 'doneTasks10', 2, 10);
            createRouteWithResponse(defaultRequestUrl + defaultFilters, '&t=1*' + defaultSortOrder, 'doneTasks10Route', 'doneTasks10');
            break;
        case "no done task":
            createRouteWithResponse(defaultRequestUrl + defaultFilters, '&t=0' + defaultSortOrder, 'emptyResultRoute', 'emptyResult');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + defaultFilters + queryParameter,
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
            url: defaultRequestUrl + defaultFilters + queryParameter,
            response: responseValue,
            headers: headers
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + doneTasksUrl + 'c=' + count + '&p=' + page + defaultFilters;
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
    cy.contains('.item-label-container p', 'Priority').should('be.visible');
    cy.contains('.item-label-container p', 'ID (original)').should('be.visible');
    cy.contains('.item-label-container p', 'Display name').should('be.visible');
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Type').should('be.visible');
    cy.contains('.item-label-container p', 'Done on').should('be.visible');
    cy.contains('.item-label-container p', 'Failed on').should('not.exist');
    cy.contains('.item-label-container p', 'Due date').should('not.exist');
    cy.contains('.item-label-container p', 'View details').should('be.visible');

    cy.get('.task-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.contains('.item-value', 'Lowest');
        cy.contains('.item-value', '140081');
        cy.contains('.item-value', 'InvolveUser');
        cy.contains('.item-value', 'InvolveUserDisplayName');
        cy.contains('.item-value', '2/5/20 4:00 PM');
        cy.contains('.item-label', 'Case ID');
        cy.contains('.item-value', '7024');
        cy.contains('.item-label', 'Process name (version)');
        cy.contains('.item-value', 'PublishDailyMeal (1.0)');
        cy.contains('.item-label', 'Process display name');
        cy.contains('.item-value', 'Publish daily meal by mail for all the team');
        cy.contains('.item-label', 'Description');
        cy.contains('.item-value', 'This is a done task description.');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View task details');
    });
});

then("The done tasks list have the correct item shown number", () => {
    cy.contains('.text-primary.item-label:visible', 'Done tasks shown: 5 of 5');
});

then("A list of {string} done tasks is displayed out of {string}", (nbrOfItems, totalItems) => {
    cy.get('.task-item:visible').should('have.length', nbrOfItems);
    cy.contains('.text-primary.item-label:visible', 'Done tasks shown: ' + nbrOfItems + ' of ' + totalItems);
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
    cy.contains('.item-value:visible', '140081');
});

then("No done tasks are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.contains('h4:visible', 'No done tasks to display').should('be.visible');
    cy.contains('h4:visible', 'No failed flow nodes to display').should('not.exist');
});

then("The more button has correct href with {string} for done tasks", (doneTaskId) => {
    cy.get('a .glyphicon-eye-open:visible').parent().should('have.attr', 'href', doneTaskDetailsUrl + doneTaskId);
});