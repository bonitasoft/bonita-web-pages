const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=81358';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=81358';
const defaultFilters = '&f=isTerminal=true&d=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const archivedCommentUrl = 'API/bpm/archivedComment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&time=0';
const archivedConnectorUrl= 'API/bpm/archivedConnectorInstance?p=0&c=999&f=containerId=81358&time=0';

given("The response {string} is defined for done tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default details':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'doneTaskDetailsRoute', 'doneTaskDetails');
            break;
        case 'archived comments':
            createRouteWithResponse(archivedCommentUrl + getCommentQueryParameters, 'commentsRoute', 'comments');
            break;
        case 'empty connectors':
            createRouteWithResponse(connectorUrl, 'connectorRoute', 'emptyResult');
            break;
        case 'archived connectors':
            createRouteWithResponse(archivedConnectorUrl, 'archivedConnectorRoute', 'connectors');
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

when("I visit the admin done task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

then("The done task details have the correct information", () => {
    cy.get('h3').contains('InvolveUser (81358)');
    cy.get('h4').contains('General');
    cy.get('.item-label').contains('Display name');
    cy.get('.item-value').contains('InvolveUser');
    cy.get('.item-label').contains('Type');
    cy.get('.item-value').contains('USER_TASK');
    cy.get('.item-label').contains('Priority');
    cy.get('.item-value').contains('normal');
    cy.get('.item-label').contains('Due date');
    cy.get('.item-value').contains('--');
    cy.get('.item-label').contains('Case Id');
    cy.get('.item-value a.btn-link').should('have.attr', 'href', '../../admin-case-details/content/?id=4288');
    cy.get('.item-label').contains('Process name (version)');
    cy.get('.item-value').contains('PublishDailyMeal (1.0)');
    cy.get('.item-label').contains('Process display name');
    cy.get('.item-value').contains('Publish daily meal by mail for all the team');
    cy.get('.item-label').contains('State');
    cy.get('.item-value').contains('completed');
    cy.get('.item-label').contains('Failed on').should('not.exist');
    cy.get('.item-label').contains('Done on');
    cy.get('.item-value').contains('4/30/20 9:22 AM');
    cy.get('.item-label').contains('Assigned to');
    cy.get('.item-value').contains('Walter Bates');
    cy.get('.item-label').contains('Assigned on');
    cy.get('.item-value').contains('4/30/20 9:22');
});

then("The back button has correct href", () => {
    cy.get('a').contains('Back').should('have.attr', 'href', adminTaskListUrl);
});

then("The connectors have the correct information", () => {
    // Check that the element exist.
    cy.wait('@connectorRoute');
    cy.get('.item-label').contains('Failed');
    cy.get('.item-value').contains('throwNewException');
    cy.get('.item-label').contains('comment no. 2');
    cy.get('.item-value').contains('helen.kelly');
});

then("The state is {string}", (state) => {
    cy.get('.item-value p').contains(state).should('be.visible');
});

then("The input placeholder is {string}", (placeholder) => {
    cy.get('input').should('have.attr', 'placeholder', placeholder);
});

then("The input placeholder is not {string}", (placeholder) => {
    cy.get('input').should('not.have.attr', 'placeholder', placeholder);
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

then("The done task details show the connectors correctly", () => {
    cy.wait('@archivedConnectorRoute');
    cy.get('h4').eq(1).contains('Connectors');
    cy.get('h5').eq(0).contains('Failed');
    cy.get('.btn-link').contains('failedConnectorName').should('not.be.visible');
    cy.get('.item-value').contains('failedConnectorName').should('be.visible');
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
