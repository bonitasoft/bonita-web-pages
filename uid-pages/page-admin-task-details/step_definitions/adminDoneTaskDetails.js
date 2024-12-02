import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html?id=81358';
const doneTaskUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=81358';
const defaultFilters = '&f=isTerminal=true&d=processId&d=executedBy&d=assigned_id&d=rootContainerId&d=parentTaskId&d=executedBySubstitute&time=0';
const adminTaskListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list';
const archivedCommentUrl = 'API/bpm/archivedComment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=4288&d=userId&t=0';
const connectorUrl = 'API/bpm/connectorInstance?p=0&c=999&f=containerId=1';
const archivedConnectorUrl = 'API/bpm/archivedConnectorInstance?p=0&c=999&f=containerId=81358';
const archivedCaseUrl = 'API/bpm/archivedCase?p=0&c=1&d=started_by&d=startedBySubstitute&d=processDefinitionId&f=sourceObjectId=4288'
const archivedSkippedFlowNodeUrl = 'API/bpm/archivedFlowNode?c=1&p=0&f=sourceObjectId=81358';
const archivedFailureFlowNodeUrl = 'API/bpm/archivedFailure/flowNode/81358?c=5';
const featureListUrl = 'API/system/feature?p=0&c=100';

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given("The response {string} is defined for done tasks", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default details':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'doneTaskDetailsRoute', 'doneTaskDetails');
            break;
        case 'skipped failed flow node':
            createRouteWithResponse(archivedSkippedFlowNodeUrl + defaultFilters, 'archivedSkippedFlowNodeRoute', 'archivedSkippedFlowNode');
            createRouteWithResponse(featureListUrl, 'featureListRoute', 'featureList');
            createRouteWithResponse(archivedFailureFlowNodeUrl, 'archivedFailureFlowNodeRoute', 'archivedFailureFlowNode');
            break;
        case 'default details without executedBySubstitute':
            createRouteWithResponse(doneTaskUrl + defaultFilters, 'doneTaskDetailsNoSubstituteRoute', 'doneTaskDetailsNoSubstitute');
            break;
        case 'archived comments':
            createRouteWithResponse(archivedCaseUrl, 'archivedCaseRoute', 'archivedCase');
            createRouteWithResponse(archivedCommentUrl + getCommentQueryParameters, 'archivedCommentsRoute', 'archivedComments');
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
});

when("I click on the {string} button", (btnName) => {
    cy.contains('.btn-show-hide-errors button', btnName).click();
});

then("The done task details have the correct information", () => {
    cy.get('.task-title img').should('have.attr', 'alt', 'flow node image');
    cy.contains('.task-title h3', 'InvolveUser');
    cy.contains('.w-auto span.label', 'completed');
    cy.contains('.text-muted p.text-left', 'ID: 81358');
    cy.contains('.item-value', 'This is a task display description.');
    cy.contains('.panel-primary .panel-heading h4', 'General');
    cy.contains('.panel-primary .dl-horizontal dt', 'Name');
    cy.contains('.panel-primary .dl-horizontal dd', 'InvolveUser');
    cy.contains('.panel-primary .dl-horizontal dt','Type');
    cy.contains('.panel-primary .dl-horizontal dd','USER_TASK');
    cy.contains('.panel-primary .dl-horizontal dt','Priority');
    cy.contains('.panel-primary .dl-horizontal dd','normal');
    cy.contains('.panel-primary .dl-horizontal dt','Due date');
    cy.contains('.panel-primary .dl-horizontal dd','--');
    cy.contains('.panel-primary .dl-horizontal dt','Assigned on');
    cy.contains('.panel-primary .dl-horizontal dd','4/30/20 9:22');
    cy.contains('.panel-primary .dl-horizontal dt','Assigned to');
    cy.contains('.panel-primary .dl-horizontal dd','Walter Bates');
    cy.contains('.panel-primary .dl-horizontal dt','Process name');
    cy.contains('.panel-primary .link-height a', 'Publish daily meal by mail for all the team (PublishDailyMeal - 1.0)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=5637856552961874995');
    cy.contains('.panel-primary .dl-horizontal dt','Case Id');
    cy.contains('.panel-primary .link-height a', '4289').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=4289');
    cy.contains('.panel-primary .dl-horizontal dt','Root process name');
    cy.contains('.panel-primary .link-height a', 'Root process display name (RootProcessName - 1.0)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=5637856552961874994');
    cy.contains('.panel-primary .dl-horizontal dt','Root case id');
    cy.contains('.panel-primary .link-height a', '4288').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=4288');
    cy.get('.panel-footer span.glyphicon-ok').should('be.visible');
    cy.contains('.panel-footer p','Completed on Apr 30, 2020 9:22:25 AM by');
    cy.get('.panel-footer span.glyphicon-user').should('be.visible');
    cy.contains('.panel-footer p','Daniela Angelo for Walter Bates');
    cy.contains('.panel-danger .panel-heading h4', 'Error details').should('not.exist');
});

then("The executedBy information is displayed correctly when executedBySubstitute is undefined", () => {
    cy.get('.task-title img').should('have.attr', 'alt', 'flow node image');
    cy.contains('.task-title h3', 'New task without executedBySubstitute');
    cy.contains('.w-auto span.label', 'completed');
    cy.contains('.text-muted p.text-left', 'ID: 81358');
    cy.contains('.item-value', 'This is a task display description without executedBySubstitute.');
    cy.contains('.panel-primary h4', 'General');
    cy.contains('.panel-primary .dl-horizontal dt', 'Name');
    cy.contains('.panel-primary .dl-horizontal dd', 'New task without executedBySubstitute');
    cy.contains('.panel-primary .dl-horizontal dt','Type');
    cy.contains('.panel-primary .dl-horizontal dd','USER_TASK');
    cy.contains('.panel-primary .dl-horizontal dt','Priority');
    cy.contains('.panel-primary .dl-horizontal dd','normal');
    cy.contains('.panel-primary .dl-horizontal dt','Due date');
    cy.contains('.panel-primary .dl-horizontal dd','--');
    cy.contains('.panel-primary .dl-horizontal dt','Assigned on');
    cy.contains('.panel-primary .dl-horizontal dd','4/30/21 9:22');
    cy.contains('.panel-primary .dl-horizontal dt','Assigned to');
    cy.contains('.panel-primary .dl-horizontal dd','Walter Bates');
    cy.contains('.panel-primary .dl-horizontal dt','Process name');
    cy.contains('.panel-primary .link-height a', 'Publish daily meal by mail for all the team (PublishDailyMeal - 1.0)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=5637856552961874994');
    cy.contains('.panel-primary .dl-horizontal dt','Case Id');
    cy.contains('.panel-primary .link-height a', '4290').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=4290');
    cy.contains('.panel-primary .dl-horizontal dt','Root case id').should('not.exist');
    cy.contains('.panel-primary .dl-horizontal dt','Root process name').should('not.exist');
    cy.contains('.panel-primary .dl-horizontal dt','Root process display name').should('not.exist');
    cy.get('.panel-footer span.glyphicon-ok').should('be.visible');
    cy.contains('.panel-footer p','Completed on Apr 30, 2021 9:22:25 AM by');
    cy.get('.panel-footer span.glyphicon-user').should('be.visible');
    cy.contains('.panel-footer p','Walter Bates');
    cy.contains('.panel-primary h4', 'Error Details').should('not.exist');
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
    cy.contains('.w-auto span', state);
});

then("The input placeholder is {string}", (placeholder) => {
    cy.get('input').should('have.attr', 'placeholder', placeholder);
});

then("The input placeholder is not {string}", (placeholder) => {
    cy.get('input').should('not.have.attr', 'placeholder', placeholder);
});

then("The comments have the correct information for done tasks", () => {
    // Check that the element be.visible.
    cy.wait('@archivedCommentsRoute');
    cy.get('.item-value').contains('comment no. 1');
    cy.get('.item-value').contains('Walter Bates');
    cy.get('.item-value').contains('comment no. 2');
    cy.get('.item-value').contains('Helen Kelly');
    cy.get('.item-value').contains('comment no. 3');
    cy.get('.item-value').contains('Walter Bates');
    cy.get('.item-value').contains('comment no. 4');
    cy.get('.item-value').contains('anthony.nichols');
});

then("The done task details show the connectors correctly", () => {
    cy.wait('@archivedConnectorRoute');
    cy.get('h4').eq(1).contains('Connectors');
    cy.get('h5').eq(0).contains('Failed');
    cy.get('.btn-link').contains('failedConnectorName').should('not.exist');
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

then("The error notification with show error button is displayed correctly and have the default state", () => {
    cy.contains('.btn-show-hide-errors button', 'click here to view the details').should('be.enabled');
    cy.contains('.btn-show-hide-errors button', 'click here to hide the details').should('not.exist');
    cy.get('.panel .panel-danger').should('not.exist');
});

then("The archived failure errors are displayed correctly", () => {
    function getLocaleDateAndTime(timestamp) {
        const failureDate = new Date(timestamp);
        const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        };

        const date = failureDate.toLocaleDateString( 'en-US', options);
        const time = failureDate.toLocaleTimeString('en-US');
        return `${date} ${time}`;
    }

    cy.wait('@archivedFailureFlowNodeRoute')
    cy.contains('.panel-danger .panel-heading h4', 'Error details');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Failed on');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', getLocaleDateAndTime(1732786618732));
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Scope');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'Data initialization');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Context');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'expression::init_()');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Error message');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'RuntimeException:');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Stacktrace');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'org.bonitasoft.engine.core.process.instance.api.exceptions.SActivityStateExecutionException: PROCESS_DEFINITION_ID=4788284921598448795');
    cy.get('.panel-danger .panel-body h5 span.glyphicon-hourglass').should('be.visible');
    cy.contains('.panel-danger .panel-body .item-label p','Failed on');
    cy.contains('.panel-danger .panel-body .item-label P', 'Scope');
    cy.contains('.panel-danger .panel-body .item-label P','Error message');
    cy.get('.glyphicon-eye-open').should('be.visible');
});

then('The Failure flow node error panel is displayed', () => {
    cy.contains('.panel-danger .panel-heading h4', 'Error details');
})

then('The Failure flow node error panel is not displayed', () => {
    cy.contains('.panel-danger .panel-heading h4', 'Error details').should('not.exist');
})