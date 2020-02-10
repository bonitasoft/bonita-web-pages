const urlPrefix = 'build/dist/';
const defaultFilters = '&f=state=ready&d=rootContainerId&d=assigned_id';
const pendingTasksUrl = 'API/bpm/humanTask?';
const defaultRequestUrl = urlPrefix + pendingTasksUrl + 'c=20&p=0' + defaultFilters;

given("The filter response {string} is defined for pending tasks", (filterType) => {
    cy.server();
    switch (filterType) {
        case "default filter":
            createRouteWithResponse(defaultRequestUrl, '', 'pendingTasks5Route', 'pendingTasks5');
            break;
        case 'sort by':
            createRoute('&o=displayName+ASC', 'sortByDisplayNameAscRoute');
            createRoute('&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createRoute('&o=dueDate+ASC', 'sortByDueDateAscRoute');
            createRoute('&o=dueDate+DESC', 'sortByDueDateDescRoute');
            createRoute('&o=priority+ASC', 'sortByPriorityAscRoute');
            createRoute('&o=priority+DESC', 'sortByPriorityDescRoute');
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
});

when("I click on {string} tab", (tabName) => {
    cy.get("a").contains(tabName).click();
});

when("I put {string} in {string} filter field for pending tasks", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
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
        cy.get('pb-input input:visible').type(filterValue);
    }
});

then("I see the failed flow nodes page", () => {
    cy.wait(3000);
    cy.get('.item-value:visible').contains('60002');
});

then("The pending tasks list have the correct information", () => {
    cy.get('.task-item:visible').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('ID');
        cy.get('.item-value').contains('100227');
        cy.get('.item-label').contains('Failed on').should("not.exist");
        cy.get('.item-label').contains('Due date');
        cy.get('.item-value').contains('--');
    });
});

then("The pending tasks list have the correct item shown number", () => {
    cy.get('.text-primary.item-label:visible').contains('Pending tasks shown: 5');
});

then("The api call is made for {string} for pending tasks", (filterValue) => {
    switch (filterValue) {
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
        default:
            throw new Error("Unsupported case");
    }
});

then("The load more button has the correct text", () => {
    cy.get("button").contains("Load more tasks").should("exist");
    cy.get("button").contains("Load more flow nodes").should("not.be.visible");
});

then("No pending tasks are available", () => {
    cy.get('.task-item').should('have.length', 0);
    cy.get('h4').contains('No pending tasks to display').should('be.visible');
    cy.get('h4').contains('No failed flow nodes to display').should('not.be.visible');
});

then("{string} items in the list are overdue", (overdueItems) => {
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.length", overdueItems);
    cy.get(".glyphicon.glyphicon-alert.text-danger:visible").should("have.attr", "title", "This task is overdue");
});