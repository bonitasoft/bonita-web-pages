const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=3';
const doneTaskUrl = 'API/bpm/archivedFlowNode/3?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const archivedCommentUrl = 'API/bpm/archivedComment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';

given("The response {string} is defined for done tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default details':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'doneTaskDetailsRoute', 'doneTaskDetails');
            break;
        case 'archived comments':
            createRouteWithResponse(archivedCommentUrl + getCommentQueryParameters, 'commentsRoute', 'comments');
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

when("I visit the admin done task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

then("The done task details have the correct information", () => {
    cy.get('h3').contains('InvolveUser (3)');
    cy.get('h4').contains('Original Id: 81358');
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
    cy.wait('@failedConnectorRoute');
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