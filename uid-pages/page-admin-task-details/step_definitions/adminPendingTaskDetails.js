const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=2';
const pendingTaskUrl = 'API/bpm/flowNode/2?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&f=state=';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=2&f=isTerminal=true&';
const userSearchUrl = 'API/identity/user?p=0&c=20&o=firstname,lastname&f=enabled=true&f=task_id=2&s=';
const assignTaskUrl = 'API/bpm/humanTask/';
const refreshUrl = pendingTaskUrl + 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=1*';

given("The response {string} is defined for pending tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'empty done task':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'emptyDoneTaskRoute', 'emptyResult');
            break;
        case 'default details':
            createRouteWithResponse(pendingTaskUrl + defaultFilters, 'pendingTaskDetailsRoute', 'pendingTaskDetails');
            break;
        /// add default unassigned details
        case 'default unassigned details':
            createRouteWithResponse(pendingTaskUrl + defaultFilters, 'pendingUnassignedTaskDetailsRoute', 'pendingUnassignedTaskDetails');
            break;
        case 'refresh task not called':
            cy.route({
                method: "GET",
                url: refreshUrl,
                onRequest: () => {
                    throw new Error("This should have not been called");
                }
            });
            break;
        case 'user list':
            createRouteWithResponse(userSearchUrl + 'H', 'userListRoute', 'userList');
            break;
        case 'assign and refresh task':
            createRouteWithResponseAndMethod(assignTaskUrl + '2', 'assignTaskRoute', 'emptyResult', 'PUT');
            createRouteWithResponse(refreshUrl, 'pendingTaskDetailsRoute', 'pendingTaskDetails');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(urlSuffix, routeName) {
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix,
        }).as(routeName);
    }

    function createPostRoute(urlSuffix, routeName) {
        cy.route({
            method: 'POST',
            url: urlPrefix + urlSuffix,
            response: ""
        }).as(routeName);
    }

    function createRouteWithResponse(urlSuffix, routeName, response) {
        createRouteWithResponseAndMethod(urlSuffix, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(urlSuffix, routeName, response, method) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            response: '@' + response
        }).as(routeName);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            status: status,
            response: ''
        }).as(routeName);
    }
});

given("The assign status code {int} is defined for pending tasks", (statusCode) => {
    cy.route({
        method: 'PUT',
        url: urlPrefix + assignTaskUrl + '2',
        status: statusCode,
        response: ''
    }).as("assignRoute");
});

when("I visit the admin pending task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on assign button", () => {
    cy.contains('button', 'Assign').click();
});

when("I click on the cancel button", () => {
    cy.contains('.modal button', 'Cancel').click();
});

when("I type {string} in the user input", (userName) => {
    cy.get('.modal .form-group input').type('H');
});

when("I click on {string} in the list", (userName) => {
    cy.contains('.modal-content .dropdown-menu button', 'Helen Kelly').click();
});

when("I click on assign button in the modal", () => {
    cy.contains('.modal-footer button', 'Assign').click();
});

then("The pending task details have the correct information", () => {
    cy.get('h3').contains('Request Vacation (2)');
    cy.get('h4').contains('Original Id:').should('not.exist');
    cy.get('h4').contains('General');
    cy.get('.item-label').contains('Display name');
    cy.get('.item-value').contains('Request Vacation');
    cy.get('.item-label').contains('Type');
    cy.get('.item-value').contains('USER_TASK');
    cy.get('.item-label').contains('Priority');
    cy.get('.item-value').contains('normal');
    cy.get('.item-label').contains('Due date');
    cy.get('.item-value').contains('4/30/20 9:22 AM');
    cy.get('.item-label').contains('Case Id');
    cy.get('.item-value a.btn-link').should('have.attr', 'href', '../../admin-case-details/content/?id=4277');
    cy.get('.item-label').contains('Process name (version)');
    cy.get('.item-value').contains('VacationRequest (3.0)');
    cy.get('.item-label').contains('Process display name');
    cy.get('.item-value').contains('New vacation request with transportation');
    cy.get('.item-label').contains('State');
    cy.get('.item-value').contains('ready');
    cy.get('.item-label').contains('Failed on').should('not.exist');
    cy.get('.item-label').contains('Done on').should('not.exist');
    cy.get('.item-label').contains('Assigned to');
    cy.get('.item-value').contains('Helen Kelly');
    cy.get('.item-label').contains('Assigned on');
    cy.get('.item-value').contains('4/30/20 2:37');
});

then("The back button has correct href", () => {
    cy.get('a').contains('Back').should('have.attr', 'href', adminTaskListUrl);
});

then("The connectors section have the correct information for pending tasks", () => {
    cy.get('h4').contains('Connectors');
    cy.get('h5').contains('Failed');
    cy.get('.item-value').contains('No failed connector');
    cy.get('h5').contains('To be executed');
    cy.get('.item-value').contains('No pending connector');
    cy.get('h5').contains('Executed');
    cy.get('.item-value').contains('No executed connector');
});

then("The unassign button is not displayed", () => {
    cy.contains('button', 'Unassign').should('not.be.visible');
});

then("The unassign button is displayed", () => {
    cy.contains('button', 'Unassign').should('be.visible');
});

then("The assign button is not displayed", () => {
    cy.contains('button', 'Assign').should('not.be.visible');
});

then("The assign modal is open and has a default state for {string}", (taskName) => {
    cy.contains('.modal-header h3', 'Assign ' + taskName).should('be.visible');
    cy.contains('.modal-content p.text-left', 'Start typing the first name, last name, or user name of the user to assign the task to, and then select among the options.');
    cy.contains('.form-group label', 'User');
    cy.get('.modal-content .form-group input').should('be.empty');
    cy.get('.modal-content .dropdown-menu').should('not.be.visible');
});

then("The assign modal is closed", () => {
    cy.get('.modal').should('not.visible');
});

then("The assign button in the modal is disabled", () => {
    cy.contains('.modal-footer button', 'Assign').should('be.disabled');
});

then("The user list is displayed", () => {
    cy.get('.modal-content .dropdown-menu').should('be.visible');
});

then("The user list is not displayed", () => {
    cy.get('.modal-content .dropdown-menu').should('not.be.visible');
});

then("The user input is filled with {string}", (userName) => {
    cy.get('.modal-content .form-group input').should('have.value', userName);
});

then("The api call has the correct user id", () => {
    cy.wait('@assignTaskRoute').then((xhr) => {
        expect(xhr.request.body.assigned_id).to.equal("3");
    });
});

then('The page is refreshed', () => {
    cy.wait('@pendingTaskDetailsRoute');
});

then("I see {string} error message", (statusCode) => {
    switch (statusCode) {
        case '500':
            cy.contains('.modal', 'An internal error occurred.  Try again later. You can also check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal', 'The task has already been done. It cannot be assigned anymore. Refresh the page to see the new tasks status.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The task has not been assigned.').should('be.visible');
});

then("I don't see any error message", () => {
    cy.get('.modal .glyphicon').should('not.exist');
});