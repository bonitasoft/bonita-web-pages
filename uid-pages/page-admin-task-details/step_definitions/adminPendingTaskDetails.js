const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=2';
const pendingTaskUrl = 'API/bpm/flowNode/2?';
const defaultFilters = 'd=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1&f=state=';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=2&f=isTerminal=true&';

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

            break;
        case 'refresh task not called':
            cy.route({
                method: "GET",
                url: pendingTaskUrl + defaultFilters,
                onRequest: () => {
                    throw new Error("This should have not been called");
                }
            });
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

when("I visit the admin pending task details page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on assign button", () => {
    cy.contains('button', 'Assign').click();
});

then("The pending task details have the correct information", () => {
    cy.get('h3').contains('Close (2)');
    cy.get('h4').contains('Original Id:').should('not.exist');
    cy.get('h4').contains('General');
    cy.get('.item-label').contains('Display name');
    cy.get('.item-value').contains('Close');
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

then("The assign modal is open and has a default state", () => {

});
