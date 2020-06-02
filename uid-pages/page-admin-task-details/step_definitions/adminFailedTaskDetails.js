const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=1';
const failedTaskUrl = 'API/bpm/flowNode/1?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const commentUrl = 'API/bpm/comment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&f=state=';

given("The response {string} is defined for failed tasks", (responseType) => {
    cy.server();
    switch (responseType) {
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
            createRouteWithResponse(connectorUrl + 'FAILED', 'failedConnectorRoute', 'failedConnector');
            createRouteWithResponse(connectorUrl + 'TO_BE_EXECUTED', 'toBeExecutedConnectorRoute', 'toBeExecutedConnector');
            createRouteWithResponse(connectorUrl + 'DONE', 'executedConnectorRoute', 'emptyResult');
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

when("I visit the admin failed task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I fill in the new comment", () => {
    cy.get('input').type('first comment');
});

when("I click on add comment button", () => {
    cy.get('button').contains('Add comment').click();
});

then("The failed task details have the correct information", () => {
    cy.get('h3').contains('1 failed task (1)');
    cy.get('h4').contains('Original Id:').should('not.exist');
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
    cy.get('.comments .item-value').contains('New comment')
});

then("The new comment input is empty", () => {
    cy.get("input").should("be.empty");
});

then("The connectors section have the correct information", () => {
    cy.get('h4').contains('Connectors');
    cy.get('h5').contains('Failed');
    cy.get('button.btn-link').contains('throwNewException');
    cy.get('h5').contains('To be executed');
    cy.get('.item-value').contains('throwException');
    cy.get('.item-value').contains('throwNewException1');
    cy.get('.item-value').contains('throwNewException2');
    cy.get('.item-value').contains('throwNewException3');
    cy.get('h5').contains('Executed');
    cy.get('.item-value').contains('No executed connector');
});
