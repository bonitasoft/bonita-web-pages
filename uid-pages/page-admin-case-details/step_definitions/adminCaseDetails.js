import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const urlPrefix = Cypress.env('BUILD_DIR') + '/';
const url = urlPrefix + 'resources/index.html?id=1';
const urlWithoutId = urlPrefix + 'resources/index.html?id=1';
const urlWithEmptyId = urlPrefix + 'resources/index.html?id=';
const caseUrl = 'API/bpm/case/1?';
const defaultFilters = 'd=processDefinitionId&d=started_by&d=startedBySubstitute';
const commentUrl = 'API/bpm/comment';
const archivedCommentUrl = 'API/bpm/archivedComment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const archivedCaseListUrl = 'API/bpm/archivedCase/?p=0&c=1&d=started_by&d=startedBySubstitute&d=processDefinitionId&f=caller=any&f=sourceObjectId=1';
const defaultProcessVariablesUrl = 'API/bpm/caseVariable?';
const processVariableUrl =  defaultProcessVariablesUrl + 'c=10&p=0&f=case_id=1';
const archivedProcessVariableUrl = 'API/bpm/archivedCaseVariable?c=10&p=0&f=case_id=1';
const processVariableUpdateUrl = 'API/bpm/caseVariable/1/';
const caseMonitoringUrl = 'API/bpm/case?c=5&p=0&d=processDefinitionId&o=startDate DESC&f=caller=any&f=rootCaseId=1';
const archivedCaseMonitoringUrl = 'API/bpm/archivedCase?c=5&p=0&d=processDefinitionId&o=archiveDate DESC&f=caller=any&f=rootCaseId=1';
const currentCaseArchivedFlowNodeUrl = 'API/bpm/archivedTask?p=0&c=0&f=parentCaseId=1';
const currentCasePendingFlowNodeUrl = 'API/bpm/flowNode?p=0&c=0&f=state=pending&f=parentCaseId=1';
const currentCaseFailedFlowNodeUrl = 'API/bpm/flowNode?p=0&c=0&f=state=failed&f=parentCaseId=1';
const rootCaseFailuresUrl = 'API/bpm/failure/case/1?c=10';
const childCasesFailuresUrl = 'API/bpm/failure/case/1/childCases?c=10';
const featureListUrl = 'API/system/feature?p=0&c=100';
const flowNodeOfCaseFailureUrl = 'API/bpm/flowNode/20010';
const flowNodeOfChildCaseFailureUrl = 'API/bpm/flowNode/14002';

const getLocaleDateAndTime = (timestamp) => {
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

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given("The response {string} is defined", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default details':
            createRouteWithResponse(caseUrl + defaultFilters, 'caseRoute', 'case');
            break;
        case 'comments':
            createRouteWithResponse(commentUrl + getCommentQueryParameters, 'commentsRoute', 'comments');
            break;
        case 'archived comments':
            createRouteWithResponse(archivedCommentUrl + getCommentQueryParameters, 'commentsRoute', 'comments');
            break;
        case 'default details without search keys':
            createRouteWithResponse(caseUrl + defaultFilters, 'caseWithoutSearchKeysRoute', 'caseWithoutSearchKeys');
            break;
        case 'add new comment':
            createPostRoute(commentUrl, 'addNewCommentRoute');
            createRouteWithResponse(commentUrl + '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=1*', 'commentsRoute', 'newComments');
            break;
        case 'archived case':
            createRouteWithResponse(archivedCaseListUrl, 'archivedCaseRoute', 'archivedCase');
            break;
        case 'available tasks':
            createRouteWithResponse('API/system/session/unusedId', 'sessionRoute', 'session');
            createRouteWithResponse('API/bpm/humanTask?p=0&c=2147483647&f=state=ready&f=user_id=4&f=caseId=1', 'availableTasksRoute', 'availableTasks');
            break;
        case 'process variables':
            createRouteWithResponse(processVariableUrl + '&t=0', 'processVariablesRoute', 'processVariables');
            break;
        case 'process variables with headers':
            createRouteWithResponseAndHeaders(processVariableUrl,'&t=0', 'processVariablesRoute', 'processVariables', {'content-range': '0-6/6'});
            break;
        case 'archived process variables with headers':
                createRouteWithResponseAndHeaders(archivedProcessVariableUrl, '&t=0', 'archivedProcessVariablesRoute', 'processVariables', {'content-range': '0-6/6'});
                break;
        case 'process variable update':
            createRouteWithResponseAndMethod(processVariableUpdateUrl + 'description', 'processVariablesUpdateRoute', 'emptyResult', 'PUT');
            createRouteWithResponse(processVariableUrl + '&t=1*', 'processVariablesRoute', 'processVariablesUpdated');
            break;
        case 'process variable update boolean':
            createRouteWithResponseAndMethod(processVariableUpdateUrl + 'isUrgentRequest', 'processVariablesUpdateRoute', 'emptyResult', 'PUT');
            createRouteWithResponse(processVariableUrl + '&t=1*', 'processVariablesRoute', 'processVariablesUpdated');
            break;
        case '500 error':
            createRouteWithMethodAndStatus(processVariableUpdateUrl + 'description', 'processVariablesUpdateRoute', 'PUT', '500');
            break;
        case 'process variable api is not called':
            cy.route({
                method: "GET",
                url: processVariableUrl + '&t=0',
                onRequest: () => {
                    throw new Error("The process variable api should not have been called");
                }
            });
            break;
        case 'current case monitoring':
            createRouteWithResponse(caseMonitoringUrl, 'openSubCaseMonitoringRoute', 'openSubCaseMonitoring');
            createRouteWithResponse(archivedCaseMonitoringUrl, 'archivedSubCaseMonitoringRoute', 'archivedSubCaseMonitoring');
            createRouteWithResponseAndHeaders(currentCaseArchivedFlowNodeUrl,'', 'currentCaseArchivedRoute', 'emptyResult', {'content-range': '0-0/2'});
            createRouteWithResponseAndHeaders(currentCasePendingFlowNodeUrl,'', 'currentCasePendingRoute', 'emptyResult', {'content-range': '0-0/0'});
            createRouteWithResponseAndHeaders(currentCaseFailedFlowNodeUrl,'', 'currentCaseFailedRoute', 'emptyResult', {'content-range': '0-0/1'});
            break;
        case 'default root case failures':
            createRouteWithResponse(featureListUrl, 'featureListRoute', 'featureList');
            createRouteWithResponse(rootCaseFailuresUrl, 'rootCaseFailuresRoute', 'rootCaseFailures');
            createRouteWithResponse(flowNodeOfCaseFailureUrl, 'flowNodeOfCaseFailureRoute', 'flowNodeOfCaseFailure');
            createRouteWithResponse(childCasesFailuresUrl, 'emptySubCasesFailuresRoute', 'emptyResult');
            break;
        case 'root case failures with histories':
            createRouteWithResponse(featureListUrl, 'featureListRoute', 'featureList');
            createRouteWithResponse(rootCaseFailuresUrl, 'rootCaseFailuresWithHistoriesRoute', 'rootCaseFailuresWithHistories');
            createRouteWithResponse(flowNodeOfCaseFailureUrl, 'flowNodeOfCaseFailureRoute', 'flowNodeOfCaseFailure');
            createRouteWithResponse(childCasesFailuresUrl, 'emptySubCasesFailuresRoute', 'emptyResult');
            break;
        case 'child cases failures':
            createRouteWithResponse(featureListUrl, 'featureListRoute', 'featureList');
            createRouteWithResponse(rootCaseFailuresUrl, 'emptyRootCaseFailuresRoute', 'emptyResult');
            createRouteWithResponse(childCasesFailuresUrl, 'childCasesFailureRoute', 'childCasesFailure');
            createRouteWithResponse(flowNodeOfChildCaseFailureUrl, 'flowNodeOfChildCaseFailureRoute', 'flowNodeOfChildCaseFailure');
            break;
        case 'child cases failures with histories':
            createRouteWithResponse(featureListUrl, 'featureListRoute', 'featureList');
            createRouteWithResponse(rootCaseFailuresUrl, 'emptyRootCaseFailuresWithHistoriesRoute', 'emptyResult');
            createRouteWithResponse(flowNodeOfChildCaseFailureUrl, 'flowNodeOfChildCaseFailureRoute', 'flowNodeOfChildCaseFailure');
            createRouteWithResponse(childCasesFailuresUrl, 'childCasesFailuresWithHistoriesRoute', 'childCasesFailuresWithHistories');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createProcessVariablesRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + defaultProcessVariablesUrl + 'p=' + page + '&c=' + count + '&f=case_id=1';
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

    function createRouteWithResponseAndHeaders(url, queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: urlPrefix + url + queryParameter,
            response: responseValue,
            headers: headers
        }).as(routeName);
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

when("I visit the admin case details page", () => {
    cy.visit(url);
});

when("I visit the admin case details page without an id", () => {
    cy.visit(urlWithoutId);
});

when("I visit the admin case details page with an empty id", () => {
    cy.visit(urlWithEmptyId);
});

when("I click on case overview button", () => {
    cy.get('a').contains('Overview').click();
});

when("I fill in the new comment", () => {
    cy.get('input').type('first comment');
});

when("I click on add comment button", () => {
    cy.get('button').contains('Add comment').click();
});

when("I click on process variables tab", () => {
    cy.get('a').contains('Process variables').click();
});

when("I click on Edit button for process variable {string}", (variableNumber) => {
    cy.get('.glyphicon-pencil').eq(variableNumber - 1).click();
});

when("I modify the value for variable {string}", (variableNumber) => {
    switch (variableNumber) {
        case "1":
            cy.get('.modal pb-input input').eq(1).clear();
            cy.get('.modal pb-input input').eq(1).type('New description about the leave request.');
            break;
        case "2":
            cy.get('.modal input').eq(1).check('true');
            break;
        default:
            throw new Error("Unsupported case");
    }

});

when("I click on {string} button in the modal", (buttonLabel) => {
    cy.get('.modal button').contains(buttonLabel).click();
});

when("I click on the show stacktrace button", () => {
    cy.get('.glyphicon-eye-open').eq(0).click();
});

then("The case details have the correct information", () => {
    // Check that the element exist.
    cy.get('.case-title img').should('have.attr', 'alt', 'Case type');
    cy.contains('.case-title', 'Case of : Pool display name').should('be.visible');
    cy.contains('.w-auto span.label', 'started');
    cy.contains('.text-muted p.text-left', 'ID: 1');
    cy.contains('.item-value', 'This is a display description of Pool.');
    cy.contains('.panel-primary .panel-heading h4', 'General');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt', 'Started by');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd', 'Walter Bates for William Jobs');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Started on');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','12/30/19 4:01 PM');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','State');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','started');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Last updated');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','12/30/19 4:01 PM');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Process name');
    cy.contains('.panel-primary .panel-body .link-height a', 'Pool display name (Pool - 1.0)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=7881320656099632799');
    cy.contains('.panel-primary .panel-body .label-success', 'Search keys');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Search key 1');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','Search value 1');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Search key 2');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','Search value 2');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Search key 3');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','Search value 3');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Search key 4');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','Search value 4');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Search key 5');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','Search value 5');
    cy.get('.panel-footer span.glyphicon-inbox').should('be.visible');
    cy.contains('.panel-footer p','Started on Dec 30, 2019 4:01:56 PM');
    cy.contains('.panel-danger .panel-heading h4', 'Error details').should('not.exist');
});

then("The startedBy information is displayed correctly when startedBySubstitute is undefined", () => {
    // Check that the element exist.
    cy.get('.case-title img').should('have.attr', 'alt', 'Case type');
    cy.contains('.case-title', 'Case of : Pool display name').should('be.visible');
    cy.contains('.w-auto span.label', 'started');
    cy.contains('.text-muted p.text-left', 'ID: 1');
    cy.contains('.item-value', 'No description');
    cy.contains('.panel-primary .panel-heading h4', 'General');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt', 'Started by');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd', 'William Jobs');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Started on');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','12/30/19 4:01 PM');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','State');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','started');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Last updated');
    cy.contains('.panel-primary .panel-body .dl-horizontal dd','12/30/19 4:01 PM');
    cy.contains('.panel-primary .panel-body .dl-horizontal dt','Process name');
    cy.contains('.panel-primary .panel-body .link-height a', 'Pool display name (Pool - 1.0)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=7881320656099632799');
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

then("The monitoring section have the correct information for a root case", (numberOfTasks) => {
    // Check that the element exist.
    cy.contains('.panel-primary .panel-heading h4', 'Monitoring');
    cy.contains('.panel-body h4', 'Case monitoring');
    cy.contains('.well-sm p small', 'Done flow nodes');
    cy.contains('.px-3 a.btn', '2').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list?caseId=1');
    cy.contains('.well-sm p small', 'Pending flow nodes');
    cy.contains('.px-3 a.btn', '0').should('have.css', 'pointer-events', 'none');
    cy.contains('.well-sm p small', 'Failed flow nodes');
    cy.contains('.px-3 a.btn', '2').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list?caseId=1');
    cy.contains('.px-3 h4', 'Child cases monitoring');

    cy.get('ul.nav-tabs').eq(0).within(() => {
        cy.get('li tab-heading').should('have.length', 2);
        cy.get('li tab-heading').eq(0).contains('Open child cases');
        cy.get('li tab-heading').eq(1).contains('Archived child cases');
    });
    cy.get('.tab-content').within(() => {
        cy.contains('.well-sm p small', 'Id');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 a.btn small', '2');
        cy.get('pb-fragment-fragment-child-case-monitoring-v1 a.btn').eq(0).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=2');

        cy.contains('.well-sm p small', 'Process name');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 a.btn small', 'DirectChild');
        cy.get('pb-fragment-fragment-child-case-monitoring-v1 a.btn').eq(1).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=8775543365026706254');

        cy.contains('.well-sm p small', 'Done flow nodes');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 a.btn small', '0');
        cy.get('pb-fragment-fragment-child-case-monitoring-v1 a.btn').eq(2).should('have.css', 'pointer-events', 'none');

        cy.contains('.well-sm p small', 'Pending flow nodes');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 a.btn small', '0');
        cy.get('pb-fragment-fragment-child-case-monitoring-v1 a.btn').eq(3).should('have.css', 'pointer-events', 'none');

        cy.contains('.well-sm p small', 'Failed flow nodes');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 a.btn small', '0');
        cy.get('pb-fragment-fragment-child-case-monitoring-v1 a.btn').eq(4).should('have.css', 'pointer-events', 'none');

        cy.contains('.well-sm p small', 'Start date');
        cy.contains('pb-fragment-fragment-child-case-monitoring-v1 p small', '1/3/25 4:04 PM');
        cy.contains('.well-sm p small', 'End date').should('not.exist');
    });

    cy.contains('.item-label p', 'Child cases shown:');
});

then('The monitoring section have the correct information for no cases', () => {
    cy.contains('pb-fragment-fragment-load-more-v1 h4', 'No child cases for this case');
});

then("There are no search keys", () => {
    // Check that there are no search keys
    cy.get('h5').contains('Search keys').should('not.exist');
});

then("The case overview url is displayed", () => {
    cy.location('pathname').should('be.equal', '/bonita/portal/form/processInstance/1')
});

then("There are no comments", () => {
    cy.get('.comments').should('not.exist');
});

then("There is a new comment", () => {
    cy.get('.comments').should('have.length', 1);
    cy.get('.comments .item-value').contains('first comment')
});

then("The new comment input is empty", () => {
    cy.get("input").should("be.empty");
});

then("The state is {string}", (state) => {
    cy.contains('.panel-footer p', state).should('be.visible');
});

then("The add comment button is {string}", (buttonState) => {
    cy.get('button').contains('Add comment').should('be.' + buttonState);
});

then("{string} is shown at the end of the comments", (text) => {
    cy.get('h5').contains(text)
        .should('exist')
        .scrollIntoView()
        .should('be.visible');
});

then("There is no {string}", (text) => {
    cy.contains('.comments .item-value', text).should('not.exist');
});

then("The input placeholder is {string}", (placeholder) => {
    cy.get('input').should('have.attr', 'placeholder', placeholder);
});

then("The input placeholder is not {string}", (placeholder) => {
    cy.get('input').should('not.have.attr', 'placeholder', placeholder);
});

then("The task list link has correct href", () => {
    cy.get('a').contains('Failed (9), Pending (9), Done (9)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-list?caseId=1');
});

then("The no task message is not visible", () => {
    cy.contains('.item-value', 'No task in the task list for this case.').should('not.exist');
});

then("The task list link is not visible", () => {
    cy.get('a.item-value').should('not.exist');
});

then("The process variables have the correct information", () => {
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Type').should('be.visible');
    cy.contains('.item-label-container p', 'Value').should('be.visible');
    cy.contains('.item-label-container p', 'Edit').should('be.visible');
    // Check that the element exist.
    cy.get('.process-variable-item').eq(0).within(() => {
        cy.get('.item-value').eq(0).contains('description');
        cy.get('.item-value').eq(1).contains('java.lang.String');
        cy.get('.item-value').eq(2).contains('Description about the leave request.');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit description');
    });
    cy.get('.process-variable-item').eq(1).within(() => {
        cy.get('.item-value').eq(0).contains('isUrgentRequest');
        cy.get('.item-value').eq(1).contains('java.lang.Boolean');
        cy.get('.item-value').eq(2).contains('false');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit isUrgentRequest');
    });
    cy.get('.process-variable-item').eq(2).within(() => {
        cy.get('.item-value').eq(1).contains('java.util.Collection');
        cy.get('.item-value').eq(2).contains('[Multiple description, about the leave request.]');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'java.util.Collection variables cannot be edited at runtime.');
    });
    cy.get('.process-variable-item').eq(3).within(() => {
        cy.get('.item-value').eq(1).contains('java.lang.Integer');
        cy.get('.item-value').eq(2).contains('55');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit numberOfDays');
    });
    cy.get('.process-variable-item').eq(4).within(() => {
        cy.get('.item-value').eq(1).contains('java.lang.Double');
        cy.get('.item-value').eq(2).contains('0.0');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit ticketFare');
    });
    cy.get('.process-variable-item').eq(5).within(() => {
        cy.get('.item-value').eq(1).contains('java.lang.Long');
        cy.get('.item-value').eq(2).contains('123456789');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit timeStamp');
    });
    cy.contains('.text-primary.item-label:visible', 'Process variables shown: 6 of 6');
});

then("The archived process variables have the correct information", () => {
    // Check that the element exist.
    cy.get('.process-variable-item').eq(0).within(() => {
        cy.get('.item-label').eq(0).contains('Name');
        cy.get('.item-value').eq(0).contains('description');
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.String');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('Description about the leave request.');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit description');
    });
    cy.get('.process-variable-item').eq(1).within(() => {
        cy.get('.item-label').eq(0).contains('Name');
        cy.get('.item-value').eq(0).contains('isUrgentRequest');
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Boolean');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('false');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit isUrgentRequest');
    });
    cy.get('.process-variable-item').eq(2).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.util.Collection');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('[Multiple description, about the leave request.]');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'java.util.Collection variables cannot be edited at runtime.');
    });
    cy.get('.process-variable-item').eq(3).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Integer');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('55');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit numberOfDays');
    });
    cy.get('.process-variable-item').eq(4).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Double');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('0.0');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit ticketFare');
    });
    cy.get('.process-variable-item').eq(5).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Long');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('123456789');
        cy.get('button').should('be.disabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit timeStamp');
    });
    cy.contains('.text-primary.item-label:visible', 'Process variables shown: 6 of 6');
});

then("Edit modal for variable {string} is displayed", (variableNumber) => {
    var variableName = '';
    switch (variableNumber) {
        case "1":
            variableName = 'description';
            break;
        case "2":
            variableName = 'isUrgentRequest';
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.contains('.modal', 'Edit the value of ' + variableName).should('be.visible');
});

then("The value for variable {string} is displayed correctly in the modal", (variableNumber) => {
    switch (variableNumber) {
        case "1":
            cy.get('.modal pb-input input').eq(1).should('have.value', 'Description about the leave request.');
            break;
        case "2":
            cy.get('[type="radio"]').last().should('be.checked');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("I see the updated successfully message", () => {
    cy.contains('.modal', 'Process variable successfully updated.');
});

then("The modal is closed", () => {
    cy.contains('.modal').should('not.exist');
});

then("I see the value is updated for variable {string}", (variableNumber) => {
    var variableValue = '';
    switch (variableNumber) {
        case "1":
            variableValue = 'New description about the leave request.';
            break;
        case "2":
            variableValue = 'true';
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.process-variable-item').eq(variableNumber - 1).within(() => {
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains(variableValue);
    });
});

then("I see {string} error message", (statusCode) => {
    switch (statusCode) {
        case '500':
            cy.get('.modal').contains('An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case '403':
            cy.get('.modal').contains('Access denied. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The process variable has not been updated.').should('be.visible');
});

then("The value for variable 1 is not changed", () => {
    cy.get('.process-variable-item').eq(0).within(() => {
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('Description about the leave request.');
    });
});

then("I see that {string}", (message) => {
    cy.contains('div', message).should('be.visible');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.process-variable-item').should('have.length', nbrOfItems);
});

then("A list of {int} items is displayed out of {int}", (nbrOfItems, totalItems) => {
    cy.get('.process-variable-item').should('have.length', nbrOfItems);
    cy.get('.text-primary.item-label:visible').contains('Process variables shown: ' + nbrOfItems + ' of ' + totalItems);
});

then("The error details section have the correct information for a root case", () => {
    // Check that the element exist.
    cy.contains('.panel-danger .panel-heading h4', 'Error details');
    cy.get('.panel-danger h4 i.glyphicon-warning-sign');
    cy.contains('.panel-danger h4', 'Case errors');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Failed on');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', getLocaleDateAndTime(1736434346149));
    cy.contains('.panel-danger .panel-body .link-height .dl-horizontal dt','Flow node ID');
    cy.contains('.panel-danger .panel-body .link-height .dl-horizontal dd','20010');
    cy.get('.panel-danger .panel-body .link-height a').eq(0).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20010');
    cy.contains('.panel-danger .panel-body .link-height .dl-horizontal dt','Flow node name');
    cy.contains('.panel-danger .panel-body .link-height .dl-horizontal dd', 'GrandParentFailedTask');
    cy.get('.panel-danger .panel-body .link-height a').eq(1).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20010');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Case').should('not.exist');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Scope');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'Data initialization');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Context');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'expression::init_()');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Error message');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'RuntimeException: Root case failed');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Stacktrace');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'org.bonitasoft.engine.core.process.instance.api.exceptions.SActivityStateExecutionException: PROCESS_DEFINITION_ID=7960869961155104624');
    cy.get('.panel-danger .panel-body p span.glyphicon-hourglass').should('not.exist');
    cy.contains('.panel-danger p', 'Failure history').should('not.exist');
});

then('The error details section have the correct information for a root case with failure histories', () => {
    cy.get('.panel-danger .panel-body p span.glyphicon-hourglass');
    cy.contains('.panel-danger p', 'Failure history');
    cy.contains('.panel-danger .panel-body .item-label p', 'Failed on');
    cy.contains('.panel-danger .panel-body .item-value p', getLocaleDateAndTime(1736434327762));
    cy.contains('.panel-danger .panel-body .item-label p','Flow node');
    cy.contains('.panel-danger .panel-body .item-value a', '20010').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20010');
    cy.contains('.panel-danger .panel-body .item-label p','Case').should('not.exist');
    cy.contains('.panel-danger .panel-body .item-label p', 'Scope');
    cy.contains('.panel-danger .panel-body .item-value p', 'Data initialization');
    cy.contains('.panel-danger .panel-body .item-label p', 'Error message');
    cy.contains('.panel-danger .panel-body .item-value p', 'RuntimeException: Root case failed');
    cy.get('.panel-danger .panel-body i.glyphicon-eye-open').should('have.attr', 'title', 'Show stacktrace');
});

then('The failure details modal displays the information correctly', () => {
    cy.get('.modal-dialog').should('be.visible');
    cy.contains('.modal-header h4', 'Error details');
    cy.contains('.modal-body a dt','Flow node ID');
    cy.contains('.modal-body a', '20010').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20010');
    cy.contains('.modal-body a dt','Flow node name');
    cy.contains('.modal-body a', 'GrandParentFailedTask').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20010');
    cy.contains('.modal-body a dt','Case').should('not.exist');
    cy.contains('.modal-body .form-group label', 'Scope');
    cy.contains('.modal-body .form-group p', 'Data initialization');
    cy.contains('.modal-body .form-group label', 'Context');
    cy.contains('.modal-body .form-group p', 'expression::init_()');
    cy.contains('.modal-body .form-group label', 'Error message');
    cy.contains('.modal-body .form-group p', 'RuntimeException: Root case failed');
    cy.contains('.modal-body .form-group label', 'Stacktrace');
    cy.contains('.modal-body .form-group .overflow-scroll', 'org.bonitasoft.engine.core.process.instance.api.exceptions.SActivityStateExecutionException: PROCESS_DEFINITION_ID=7960869961155104624');
});

then("The error details section have the correct information for a child cases failures", () => {
    cy.contains('.panel-danger .panel-heading h4', 'Error details');
    cy.get('.panel-danger h4 i.glyphicon-warning-sign');
    cy.contains('.panel-danger h4', 'Child cases errors');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Failed on');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', getLocaleDateAndTime(1736762470984));
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Flow node ID');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd','20014');
    cy.get('.panel-danger .panel-body .link-height a').eq(0).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20014');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Flow node name');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd','Step1');
    cy.get('.panel-danger .panel-body .link-height a').eq(1).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=20014');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Case').should('not.exist');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Scope');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'Data initialization');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Context');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'expression::init_()');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt', 'Error message');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'RuntimeException: Toto');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Stacktrace');
    cy.contains('.panel-danger .panel-body .dl-horizontal dd', 'org.bonitasoft.engine.core.process.instance.api.exceptions.SActivityStateExecutionException: PROCESS_DEFINITION_ID=5882600122454068267');
    cy.get('.panel-danger .panel-body p span.glyphicon-hourglass').should('not.exist');
    cy.contains('.panel-danger p', 'Failure history').should('not.exist');
});

then('The error details section have the correct information for child cases with failure histories', () => {
    cy.get('.panel-danger .panel-body p span.glyphicon-hourglass');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Case');
    cy.contains('.panel-danger .panel-body .link-height a', '1').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-details?id=1');
    cy.contains('.panel-danger .panel-body .dl-horizontal dt','Flow node ID').should('not.exist');
    cy.contains('.panel-danger p', 'Failure history');
    cy.contains('.panel-danger .panel-body .item-label p', 'Failed on');
    cy.contains('.panel-danger .panel-body .item-value p', getLocaleDateAndTime(1736429846741));
    cy.contains('.panel-danger .panel-body .item-label p','Case / Flow node');
    cy.contains('.panel-danger .panel-body .item-value a', '14002').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=14002');
    cy.contains('.panel-danger .panel-body .item-label p', 'Scope');
    cy.contains('.panel-danger .panel-body .item-value p', 'Data initialization');
    cy.contains('.panel-danger .panel-body .item-label p', 'Error message');
    cy.contains('.panel-danger .panel-body .item-value p', 'RuntimeException: Toto');
    cy.get('.panel-danger .panel-body i.glyphicon-eye-open').should('have.attr', 'title', 'Show stacktrace');
});

then('The failure details modal displays the information correctly for a child case failure history', () => {
    cy.get('.modal-dialog').should('be.visible');
    cy.contains('.modal-header h4', 'Error details');
    cy.contains('.modal-body .flownode-link a dt','Flow node ID');
    cy.get('.modal-body .flownode-link a').eq(0).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=14002');
    cy.contains('.modal-body .flownode-link a dt','Flow node name');
    cy.contains('.modal-body .flownode-link a dd','Step1');
    cy.get('.modal-body .flownode-link a').eq(1).should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-task-details?id=14002');
    cy.contains('.modal-body .flownode-link  a dt','Case').should('not.exist');
    cy.contains('.modal-body .form-group label', 'Scope');
    cy.contains('.modal-body .form-group p', 'Data initialization');
    cy.contains('.modal-body .form-group label', 'Context');
    cy.contains('.modal-body .form-group p', 'expression::init_()');
    cy.contains('.modal-body .form-group label', 'Error message');
    cy.contains('.modal-body .form-group p', 'RuntimeException: Toto');
    cy.contains('.modal-body .form-group label', 'Stacktrace');
    cy.contains('.modal-body .form-group .overflow-scroll', 'org.bonitasoft.engine.core.process.instance.api.exceptions.SActivityStateExecutionException: PROCESS_DEFINITION_ID=5882600122454068267');
});