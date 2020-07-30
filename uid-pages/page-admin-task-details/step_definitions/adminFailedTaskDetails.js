const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=1';
const failedTaskUrl = 'API/bpm/flowNode/1?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const commentUrl = 'API/bpm/comment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&time=0';
const refreshConnectorsUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&time=1*';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=1&f=isTerminal=true&';
const failureConnector = 'API/bpm/connectorFailure/';
const skipTaskUrl = 'API/bpm/activity/';
const replayTaskUrl = 'API/bpm/flowNode/1/replay';
const refreshUrl = doneTaskUrl + 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=1*';

given("The response {string} is defined for failed tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'empty done task':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'emptyDoneTaskRoute', 'emptyResult');
            break;
        case 'default details':
            createRouteWithResponse(failedTaskUrl + defaultFilters, 'failedTaskDetailsRoute', 'failedTaskDetails');
            break;
        case 'comments':
            createRouteWithResponse(commentUrl + getCommentQueryParameters, 'commentsRoute', 'comments');
            break;
        case 'add new comment':
            createPostRoute(commentUrl, 'addNewCommentRoute');
            createRouteWithResponse(commentUrl + '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=1*', 'commentsRoute', 'newComments');
            break;
        case 'connectors':
            createRouteWithResponse(connectorUrl, 'connectorRoute', 'connectors');
            break;
        case 'failure connector':
            createRouteWithResponse(failureConnector + '80004', 'failureConnectorRoute', 'failureConnector');
            break;
        case 'skip and refresh task':
            createRouteWithResponseAndMethod(skipTaskUrl + '1', 'skipTaskRoute', 'emptyResult', 'PUT');
            createRouteWithResponse(refreshUrl, 'skippedTaskRoute', 'skippedTaskDetails');
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
        case '500':
            createRouteWithMethodAndStatus(skipTaskUrl + '1', 'skipTaskRoute', 'PUT', '500');
            break;
        case '403':
            createRouteWithMethodAndStatus(skipTaskUrl + '1', 'skipTaskRoute', 'PUT', '403');
            break;
        case '404':
            createRouteWithMethodAndStatus(skipTaskUrl + '1', 'skipTaskRoute', 'PUT', '404');
            break;
        case 'replay success':
            createRouteWithMethodAndStatus(replayTaskUrl, 'replayTaskRoute', 'PUT', '200');
            createRouteWithResponse(refreshConnectorsUrl, 'refreshConnectorsRoute', 'connectors');
            break;
        case 'less connectors after replay':
            createRouteWithMethodAndStatus(replayTaskUrl, 'replayTaskRoute', 'PUT', '200');
            createRouteWithResponse(refreshConnectorsUrl, 'refreshConnectorsRoute', 'refreshedConnectors');
            break;
        case '500 during replay':
            createRouteWithMethodAndStatus(replayTaskUrl, 'replayTaskRoute', 'PUT', '500');
            break;
        case '403 during replay':
            createRouteWithMethodAndStatus(replayTaskUrl, 'replayTaskRoute', 'PUT', '403');
            break;
        case '404 during replay':
            createRouteWithMethodAndStatus(replayTaskUrl, 'replayTaskRoute', 'PUT', '404');
            break;
        default:
            throw new Error("Unsupported case");
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
            response: "",
            status: status
        }).as(routeName);
    }
});

when("I visit the admin failed task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I fill in the new comment", () => {
    cy.get('input').type('first comment');
});

when("I click on failed connector button", () => {
    cy.get('button').contains('failedConnectorName').click();
});

when("I click on second failed connector button", () => {
    cy.get('button').contains('secondFailedConnector').click();
});

when("I click on {string} button", (buttonLabel) => {
    cy.contains('button', buttonLabel).click();
});

when("I click on {string} button in the modal", (buttonLabel) => {
    cy.contains('.modal button', buttonLabel).click();
});

when("I select two connectors", (buttonLabel) => {
    cy.get('.modal-body').within(() => {
        cy.contains('failedConnectorName').parent().within(() => {
            cy.get('input[type="checkbox"]').check();
        });
        cy.contains('skippedConnector').parent().within(() => {
            cy.get('input[type="checkbox"]').check();
        });
    });
});

when("I deselect two connectors", (buttonLabel) => {
    cy.contains('.modal-body', 'failedConnectorName').parent().get('input[type="checkbox"]').uncheck();
    cy.contains('.modal-body', 'skippedConnector').parent().get('input[type="checkbox"]').uncheck();
});

then("The failed task details have the correct information", () => {
    cy.get('h3').contains('1 failed task (1)');
    cy.get('h4').contains('General');
    cy.get('.item-label').contains('Display name');
    cy.get('.item-value').contains('1 failed task');
    cy.get('.item-label').contains('Type');
    cy.get('.item-value').contains('USER_TASK');
    cy.get('.item-label').contains('Priority');
    cy.get('.item-value').contains('normal');
    cy.get('.item-label').contains('Due date');
    cy.get('.item-value').contains('--');
    cy.get('.item-label').contains('Case Id');
    cy.get('.item-value a.btn-link').should('have.attr', 'href', '../../admin-case-details/content/?id=1');
    cy.get('.item-label').contains('Process name (version)');
    cy.get('.item-value').contains('VacationRequest (4.0)');
    cy.get('.item-label').contains('Process display name');
    cy.get('.item-value').contains('Failed vacation request');
    cy.get('.item-label').contains('State');
    cy.get('.item-value').contains('Failed');
    cy.get('.item-label').contains('Done on').should('not.exist');
    cy.get('.item-label').contains('Failed on');
    cy.get('.item-value').contains('4/30/20 9:22 AM');
    cy.get('.item-label').contains('Assigned to');
    cy.get('.item-value').contains('Anthony Nichols');
    cy.get('.item-label').contains('Assigned on');
    cy.get('.item-value').contains('4/30/20 10:44');
});

then("The back button has correct href", () => {
    cy.get('a').contains('Back').should('have.attr', 'href', adminTaskListUrl);
});

then("The comments have the correct information", () => {
    // Check that the element exist.
    cy.wait('@commentsRoute');
    cy.get('.item-value').contains('comment no. 1');
    cy.get('.item-value').contains('William Jobs');
    cy.get('.item-value').contains('comment no. 2');
    cy.get('.item-value').contains('helen.kelly');
    cy.get('.item-value').contains('comment no. 3');
    cy.get('.item-value').contains('walter.bates');
    cy.get('.item-value').contains('comment no. 4');
    cy.get('.item-value').contains('anthony.nichols');
});

then("{string} is shown at the end of the comments", (text) => {
    cy.get('h5').contains(text).should('be.visible');
});

then("There is no {string}", (text) => {
    cy.get('.comments .item-value').contains(text).should('not.be.visible');
});

then("There are no comments", () => {
    cy.get('.comments').should('not.exist');
});

then("The add comment button is {string}", (buttonState) => {
    cy.get('button').contains('Add comment').should('be.' + buttonState);
});

then("There is a new comment", () => {
    cy.get('.comments').should('have.length', 5);
    cy.get('.comments .item-value').contains('New comment');
});

then("The new comment input is empty", () => {
    cy.get("input").should("be.empty");
});

then("The connectors section have the correct information", () => {
    cy.wait('@connectorRoute');
    cy.get('h4').eq(1).contains('Connectors');
    cy.get('h5').eq(0).contains('Failed');
    cy.get('button.btn-link').contains('failedConnectorName').should('be.visible');
    cy.get('.item-value').contains('failedConnectorName').should('not.be.visible');
    cy.get('h5').eq(1).contains('To be executed');
    cy.get('.item-value').contains('throwException');
    cy.get('.item-value').contains('throwNewException1');
    cy.get('.item-value').contains('throwNewException2');
    cy.get('.item-value').contains('throwNewException3');
    cy.get('h5').eq(2).contains('Executed');
    cy.get('.item-value').contains('throwNewException6');
    cy.get('h5').eq(3).contains('Skipped');
    cy.get('.item-value').contains('skippedConnector');
});

then("The connectors section is empty", () => {
    cy.get('.connectors button').should('not.be.visible');
    cy.contains('h4','Connectors').should('be.visible');
    cy.contains('h5','Failed').should('be.visible');
    cy.contains('.item-value','No failed connector').should('be.visible');
    cy.contains('h5','To be executed').should('be.visible');
    cy.contains('.item-value','No pending connector').should('be.visible');
    cy.contains('h5','Executed').should('be.visible');
    cy.contains('.item-value','No executed connector').should('be.visible');
    cy.contains('h5','Skipped').should('be.visible');
    cy.contains('.item-value','No skipped connector').should('be.visible');
});

then("The failed connector modal is opened for {string}", (connectorName) => {
    cy.get('.modal h3').contains('Failure details for connector ' + connectorName).should('be.visible');
});

then("The modal has the correct information", () => {
    cy.get('.modal-header h3').contains('Failure details for connector failedConnectorName').should('be.visible');
    cy.get('.modal-body h4').contains('Error message').should('be.visible');
    cy.get('p.text-left').contains('Human Failed task').should('be.visible');
    cy.get('.modal-body h4').contains('Stack trace').should('be.visible');
    cy.get('textarea').should('have.value', 'org.bonitasoft.engine.commons.exceptions.SBonitaRuntimeException: java.lang.Exception: Human Failed task');
});

then("The skip modal is open and has a default state for {string}", (taskName) => {
    cy.contains('.modal-header h3', 'Skip ' + taskName).should('be.visible');
    cy.contains('.modal-content p.text-left', 'The task will remain failed: while connectors in execution results will be kept, operations and connectors out will not be executed. The process will go on to the next step.').should('be.visible');
    cy.contains('.modal-content p.text-left', 'Are you sure you want to skip the task?').should('be.visible');
    cy.contains('.modal-footer button', 'Skip').should('be.visible');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
});

then("The replay modal is open and has a default state for {string}", (taskName) => {
    cy.contains('.modal-header h3', 'Replay ' + taskName).should('be.visible');
    cy.contains('.modal-content p.text-left', 'At least part of the task failure is due to failed connector(s). You may need to fix them first, then select the failed connectors you want to reset (checked) or skip (unchecked) before replaying the task.').should('be.visible');
    cy.contains('.modal-body button', 'Select all').should('be.visible');
    cy.contains('.modal-body button', 'Reset').should('be.visible');
    cy.get('.modal-body input[type="checkbox"]').should('have.length', 3);
    cy.contains('.modal-body', 'failedConnectorName').should('be.visible');
    cy.contains('.modal-body', 'secondFailedConnector').should('be.visible');
    cy.contains('.modal-body', 'skippedConnector').should('be.visible');
    cy.contains('.modal-footer button', 'Replay').should('be.visible');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The replay modal is open and has one less connector for {string}", (taskName) => {
    cy.contains('.modal-header h3', 'Replay ' + taskName).should('be.visible');
    cy.contains('.modal-content p.text-left', 'At least part of the task failure is due to failed connector(s). You may need to fix them first, then select the failed connectors you want to reset (checked) or skip (unchecked) before replaying the task.').should('be.visible');
    cy.contains('.modal-body button', 'Select all').should('be.visible');
    cy.contains('.modal-body button', 'Reset').should('be.visible');
    cy.get('.modal-body input[type="checkbox"]').should('have.length', 2);
    cy.contains('.modal-body', 'secondFailedConnector').should('be.visible');
    cy.contains('.modal-body', 'skippedConnector').should('be.visible');
    cy.contains('.modal-footer button', 'Replay').should('be.visible');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.visible');
});

then("There is a confirmation for task being successfully skipped", () => {
    cy.contains('.modal', 'The task has been successfully skipped.').should('be.visible');
});

then("There is a confirmation for task being successfully replayed", () => {
    cy.wait('@replayTaskRoute').then(xhr => xhr.request.body).then((body) => {
        expect(body[0].id).to.equal("80004");
        expect(body[0].state).to.equal("toReExecute");
        expect(body[1].id).to.equal("800035");
        expect(body[1].state).to.equal("skipped");
        expect(body[2].id).to.equal("80025");
        expect(body[2].state).to.equal("toReExecute");
    });
    cy.contains('.modal', 'The task has been replayed successfully. Close this window to check its new status.').should('be.visible');
    cy.contains('.modal-footer button', 'Replay').should('be.visible');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body input[type="checkbox"]').should('have.length', 3);
    cy.get('.modal-body input[type="checkbox"]').each((checkbox) => {
        cy.wrap(checkbox).should('be.disabled');
    });
});

then("The skipped failed task details page is refreshed", () => {
    cy.wait('@skippedTaskRoute');
});

then("The failed task details page is refreshed", () => {
    cy.wait('@refreshConnectorsRoute');
});

then("The task is skipped", () => {
    cy.contains('.item-value', 'skipped');
});

then("All connectors are selected", () => {
    cy.get('.modal-body input[type="checkbox"]').should('have.length', 3);
    cy.get('.modal-body input[type="checkbox"]').each((checkbox) => {
        cy.wrap(checkbox).should('be.checked');
    });
});

then("No connector is selected", () => {
    cy.get('.modal-body input[type="checkbox"]').should('have.length', 3);
    cy.get('.modal-body input[type="checkbox"]').each((checkbox) => {
        cy.wrap(checkbox).should('not.be.checked');
    });
});

then("I see 404 error message when replaying task", () => {
    cy.contains('.modal', 'The status of one or more connectors has changed. Refresh and try again.').should('be.visible');
    cy.get('.modal').contains('The task has not been replayed.').should('be.visible');
});

