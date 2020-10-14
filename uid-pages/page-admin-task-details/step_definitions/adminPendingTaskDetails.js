const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=2';
const pendingTaskUrl = 'API/bpm/flowNode/2?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=2&f=isTerminal=true&';
const userSearchUrl = 'API/identity/user?p=0&c=20&o=firstname,lastname&f=enabled=true&f=task_id=2&s=';
const assignTaskUrl = 'API/bpm/humanTask/';
const refreshUrl = pendingTaskUrl + 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=1*';
const formMappingUrl = "API/form/mapping?c=10&p=0&f=processDefinitionId=8835222915848848756&f=task=request_vacation";
const session = "API/system/session/unusedId";
const identity = "API/identity/user/4";
const taskWithoutFormExecution = "API/bpm/userTask/2/execution";

given("The response {string} is defined for pending tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'empty done task':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'emptyDoneTaskRoute', 'emptyResult');
            break;
        case 'default details':
            createRouteWithResponse(pendingTaskUrl + defaultFilters, 'pendingTaskDetailsRoute', 'pendingTaskDetails');
            break;
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
        case 'unassign and refresh task':
            createRouteWithResponseAndMethod(assignTaskUrl + '2', 'unassignTaskRoute', 'emptyResult', 'PUT');
            createRouteWithResponse(refreshUrl, 'pendingUnassignedTaskDetailsRoute', 'pendingUnassignedTaskDetails');
            break;
        case 'user list with 20 elements':
            createRouteWithResponse(userSearchUrl + 'U', 'userListWith20ElementsRoute', 'userListWith20Elements');
            createRouteWithResponse(userSearchUrl + 'Us', 'userListRoute', 'userList');
            break;
        case 'task with form':
            createRouteWithResponse(formMappingUrl, 'formMappingRoute', 'formMappingWithForm');
            createRouteWithResponse(session, 'sessionRoute', 'session');
            createRouteWithResponse(identity, 'identityRoute', 'identity');
            break;
        case 'task without form':
            createRouteWithResponse(formMappingUrl, 'formMappingRoute', 'formMappingWithoutForm');
            createRouteWithResponse(session, 'sessionRoute', 'session');
            createRouteWithResponse(identity, 'identityRoute', 'identity');
            createRouteWithResponseAndMethod(taskWithoutFormExecution, 'taskWithoutFormRoute', 'emptyResult', 'POST');
            break;
        default:
            throw new Error("Unsupported case");
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
});

given("The assign status code {int} is defined for pending tasks", (statusCode) => {
    cy.route({
        method: 'PUT',
        url: urlPrefix + assignTaskUrl + '2',
        status: statusCode,
        response: ''
    }).as("assignRoute");
});

given("The do for response unassigned error status code 500 is defined for pending tasks", () => {
    cy.fixture('json/unassignedDoForErrorResponse.json').as('unassignedDoForErrorResponse');
    cy.route({
        method: 'POST',
        url: urlPrefix + taskWithoutFormExecution,
        status: 500,
        response: '@unassignedDoForErrorResponse'
    }).as("unassignedDoForErrorRoute");
});

given("The do for status code {int} is defined for pending tasks", (errorCode) => {
    cy.route({
        method: 'POST',
        url: urlPrefix + taskWithoutFormExecution,
        status: errorCode,
        response: ''
    }).as("doForErrorRoute");
});

when("I visit the admin pending task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on assign button", () => {
    cy.contains('button', 'Assign').click();
});

when("I click on unassign button", () => {
    cy.contains('button', 'Unassign').click();
});

when("I click on the cancel button", () => {
    cy.contains('.modal button', 'Cancel').click();
});

when("I type {string} in the user input", (userName) => {
    cy.get('.modal .form-group input').type(userName);
});

when("I click on {string} in the list", (userName) => {
    cy.contains('.modal-content .dropdown-menu button', 'Helen Kelly').click();
});

when("I click on assign button in the modal", () => {
    cy.contains('.modal-footer button', 'Assign').click();
});

when("I click on unassign button in the modal", () => {
    cy.contains('.modal-footer button', 'Unassign').click();
});

when("I click on the close button", () => {
    cy.contains('.modal-footer button', 'Close').click();
});

when("I click on do for button", () => {
    cy.contains('button', 'Do for').click();
});

when("I click on do task link", () => {
    cy.contains('.modal-footer a', 'Do the task').click();
});

when("I click on submit button", () => {
    cy.contains('.modal-footer button', 'Submit').click();
});

when("I fill in the comment field", () => {
    cy.get('.modal-body input').type('comment');
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
    cy.contains('h4','Connectors').should('be.visible');
    cy.contains('h5','Failed').should('be.visible');
    cy.contains('.item-value','No failed connector').should('be.visible');
    cy.contains('h5','To be executed').should('be.visible');
    cy.contains('.item-value','No connector to be executed').should('be.visible');
    cy.contains('h5','Executed').should('be.visible');
    cy.contains('.item-value','No executed connector').should('be.visible');
    cy.contains('h5','Skipped').should('be.visible');
    cy.contains('.item-value','No skipped connector').should('be.visible');
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
    cy.contains('.modal-content p.text-left', 'Start typing the first name, last name, user name, or job title of the user to assign the task to, and then select among the options.');
    cy.contains('.form-group label', 'User');
    cy.get('.modal-content .form-group input').should('be.empty');
    cy.get('.modal-content .dropdown-menu').should('not.be.visible');
    cy.contains('.modal-footer button', 'Cancel');
});

then("The modal is closed", () => {
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

then("I see {string} error message for {string}", (statusCode, taskType) => {
    switch (statusCode) {
        case '500':
            cy.contains('.modal', 'An internal error occurred. Try again later. You can also check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal', 'The task has already been done. It cannot be ' + taskType + ' anymore. Refresh the page to see the new task status.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The task has not been ' + taskType + '.').should('be.visible');
});

then("I don't see any error message", () => {
    cy.get('.modal .glyphicon').should('not.exist');
});

then("The unassign modal is open and has a default state for {string}", (taskName) => {
    cy.contains('.modal-header h3', 'Unassign ' + taskName).should('be.visible');
    cy.contains('.modal-content p.text-left', 'Do you want to unassign the task from Helen Kelly?');
    cy.contains('.modal-footer button', 'Cancel');
});

then("The unassign api call has the correct user id", () => {
    cy.wait('@unassignTaskRoute').then((xhr) => {
        expect(xhr.request.body.assigned_id).to.equal("");
    });
});

then('The unassigned page is refreshed', () => {
    cy.wait('@pendingUnassignedTaskDetailsRoute');
});

then("The unassign button is not displayed", () => {
    cy.contains('button', 'Unassign').should('not.be.visible');
});

then("The assign button is displayed", () => {
    cy.contains('button', 'Assign').should('be.visible');
});

then("There is a confirmation for task being successfully assigned", () => {
    cy.contains('.modal', 'The task has been successfully assigned to Helen Kelly.').should('be.visible');
});

then("There is a confirmation for task being successfully unassigned", () => {
    cy.contains('.modal', 'The task has been successfully unassigned.').should('be.visible');
});

then("The cancel button is not displayed", () => {
    cy.contains('.modal-footer button', 'Cancel').should('not.be.visible');
});

then("There is no confirmation message for unassign", () => {
    cy.contains('.modal-content p.text-left', 'Do you want to unassign the task from Helen Kelly?').should('not.be.visible');
});

then("The type more message is displayed and disabled", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').scrollIntoView();
    cy.get('.dropdown-menu button').eq(20).contains('Or type more...');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.visible');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.disabled');
});

then("The type more message is not displayed", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').should('not.be.visible');
});

then("The do for button is disabled", () => {
    cy.contains('button', 'Do for').should('be.disabled')
        .get('span').should('have.attr', 'title', 'In order to do the task for the assignee, you need to assign the task first.');
});

then("The do for button is enabled", () => {
    cy.contains('button', 'Do for').should('be.enabled')
        .get('span').should('have.attr', 'title', 'Do the task for the assignee.');
});

then("The do for modal is open and has a default state", () => {
    cy.contains('.modal', 'Do Request Vacation for Helen Kelly').should('be.visible');
    cy.contains('.modal-content p.text-left', 'You are about to perform the task for the current assignee.');
    cy.contains('.modal-content p.text-left', 'It will be recorded as "Done by Walter Bates for Helen Kelly"');
    cy.contains('.modal-footer button', 'Cancel');
    cy.contains('.modal-footer a', 'Do the task');
    cy.contains('.modal-footer', 'Comment').should('not.exist');
});

then("The form is displayed", (modalTitle) => {
    cy.url().should('include', 'bonita/portal/form/taskInstance/2');
});

then("The do for modal is open and has a default state without form", () => {
    cy.contains('.modal', 'Do Request Vacation for Helen Kelly').should('be.visible');
    cy.contains('.modal-content p.text-left', 'You are about to perform the task for the current assignee.');
    cy.contains('.modal-content p.text-left', 'It will be recorded as "Done by Walter Bates for Helen Kelly"');
    cy.contains('.modal-content p.text-left', 'This task does not require a form to fill, but a comment to explain the action you have performed.');
    cy.contains('.modal-footer button', 'Cancel');
    cy.contains('.modal-footer a', 'Do the task').should('not.exist');
    cy.contains('.modal-footer button', 'Submit').should('be.visible');
    cy.contains('.modal-body', 'Comment').should('be.visible');
});

then("The task is submitted and has correct payload", () => {
    cy.wait('@taskWithoutFormRoute').then((xhr) => {
        expect(xhr.request.body.ticket_comment).to.eq("comment");
    });
});

then("The unassigned error message is displayed", () => {
    cy.contains('.modal-body p.text-left', 'This task is not assigned anymore. Assign it and try again.').should('be.visible');
    cy.contains('.modal-body p.text-left', 'The task has not been done.').should('be.visible');
});

then("The {int} error message is displayed for do for", (statusCode) => {
    switch (statusCode) {
        case 500:
            cy.contains('.modal', 'An internal error occurred. Try again later. You can also check the log file.').should('be.visible');
            break;
        case 404:
            cy.contains('.modal', 'The task has already been done. It cannot be done anymore. Refresh the page to see the new task status.').should('be.visible');
            break;
        case 403:
            cy.contains('.modal', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The task has not been done.').should('be.visible');
});
