const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=1';
const urlWithoutId = urlPrefix + 'resources/index.html?id=1';
const urlWithEmptyId = urlPrefix + 'resources/index.html?id=';
const caseUrl = 'API/bpm/case/1?';
const defaultFilters = 'd=processDefinitionId&d=started_by';
const commentUrl = 'API/bpm/comment';
const archivedCommentUrl = 'API/bpm/archivedComment';
const getCommentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const caseListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-case-list';
const archivedCaseListUrl = 'API/bpm/archivedCase/?p=0&c=1&d=started_by&d=startedBySubstitute&d=processDefinitionId&f=sourceObjectId=1';
const defaultProcessVariablesUrl = 'API/bpm/caseVariable?';
const processVariableUrl =  defaultProcessVariablesUrl + 'c=10&p=0&f=case_id=1';
const processVariableUpdateUrl = 'API/bpm/caseVariable/1/';


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
        case 'monitor 9 tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '9FlowNodeRoute', '9Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '9HumanTask', '9Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '9TasksRoute', '9Tasks');
            break;
        case 'monitor 10 tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '10FlowNodeRoute', '10Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '10HumanTask', '10Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '10TasksRoute', '10Tasks');
            break;
        case 'monitor 10+ tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '10+FlowNodeRoute', '10+Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '10+HumanTask', '10+Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '10+TasksRoute', '10+Tasks');
            break;
        case 'monitor 0 tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '0FlowNodeRoute', '0Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '0HumanTask', '0Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '0TasksRoute', '0Tasks');
            break;
        case 'process variables':
            createRouteWithResponse(processVariableUrl + '&t=0', 'processVariablesRoute', 'processVariables');
            break;
        case 'process variables with headers':
            createRouteWithResponseAndHeaders('&t=0', 'processVariablesRoute', 'processVariables', {'content-range': '0-6/6'});
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

    function createRouteWithResponseAndHeaders(queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: urlPrefix + processVariableUrl + queryParameter,
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

then("The case details have the correct information", () => {
    // Check that the element exist.
    cy.get('h3.text-left').contains('Case ID: 1').should('be.visible');
    cy.get('.item-label').contains('Process name');
    cy.get('.item-value').contains('Pool');
    cy.get('.item-label').contains('Process display name');
    cy.get('.item-value').contains('Pool display name');
    cy.get('.item-label').contains('Version');
    cy.get('.item-value').contains('1.0');
    cy.get('.item-label').contains('State');
    cy.get('.item-value').contains('started');
    cy.get('.item-label').contains('Started by');
    cy.get('.item-value').contains('William Jobs');
    cy.get('.item-label').contains('Started on');
    cy.get('.item-value').contains('12/30/19 4:01 PM');
    cy.get('.item-label').contains('Last updated');
    cy.get('.item-value').contains('12/30/19 4:01 PM');
    cy.get('.item-label').contains('Search key 1');
    cy.get('.item-value').contains('Search value 1');
    cy.get('.item-label').contains('Search key 2');
    cy.get('.item-value').contains('Search value 2');
    cy.get('.item-label').contains('Search key 3');
    cy.get('.item-value').contains('Search value 3');
    cy.get('.item-label').contains('Search key 4');
    cy.get('.item-value').contains('Search value 4');
    cy.get('.item-label').contains('Search key 5');
    cy.get('.item-value').contains('Search value 5');
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

then("The monitoring have the correct information for {string} tasks", (numberOfTasks) => {
    // Check that the element exist.
    switch (numberOfTasks) {
        case "9":
            cy.wait(['@9TasksRoute', '@9FlowNodeRoute', '@9HumanTask']);
            cy.get('.item-value').contains('Failed (9), Pending (9), Done (9)');
            break;
        case "10":
            cy.wait(['@10TasksRoute', '@10FlowNodeRoute', '@10HumanTask']);
            cy.get('.item-value').contains('Failed (10), Pending (10), Done (10)');
            break;
        case "11":
            cy.wait(['@10+TasksRoute', '@10+FlowNodeRoute', '@10+HumanTask']);
            cy.get('.item-value').contains('Failed (10+), Pending (10+), Done (10+)');
            break;
        case "0":
            cy.wait(['@0TasksRoute', '@0FlowNodeRoute', '@0HumanTask']);
            cy.get('.item-value').contains('No task in the task list for this case.');
            break;
    }
});

then("There are no search keys", () => {
    // Check that there are no search keys
    cy.get('h5').contains('Search keys').should('not.exist');
});

then("The back button has correct href", () => {
    cy.get('a').contains('Back').should('have.attr', 'href', caseListUrl);
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
    cy.get('.item-value p').contains(state).should('be.visible');
});

then("The add comment button is {string}", (buttonState) => {
    cy.get('button').contains('Add comment').should('be.' + buttonState);
});

then("{string} is shown at the end of the comments", (text) => {
    cy.get('h5').contains(text).should('be.visible');
});

then("There is no {string}", (text) => {
    cy.get('.comments .item-value').contains(text).should('not.be.visible');
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
    cy.get('.item-value').contains('No task in the task list for this case.').should('not.visible');
});

then("The task list link is not visible", () => {
    cy.get('a.item-value').should('not.visible');
});

then("The process variables have the correct information", () => {
    // Check that the element exist.
    cy.get('.process-variable-item').eq(0).within(() => {
        cy.get('.item-label').eq(0).contains('Name');
        cy.get('.item-value').eq(0).contains('description');
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.String');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('Description about the leave request.');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit description');
    });
    cy.get('.process-variable-item').eq(1).within(() => {
        cy.get('.item-label').eq(0).contains('Name');
        cy.get('.item-value').eq(0).contains('isUrgentRequest');
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Boolean');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('false');
        cy.get('button').should('be.enabled');
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
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit numberOfDays');
    });
    cy.get('.process-variable-item').eq(4).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Double');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('0.0');
        cy.get('button').should('be.enabled');
        cy.get('.glyphicon-pencil').should('have.attr', 'title', 'Edit ticketFare');
    });
    cy.get('.process-variable-item').eq(5).within(() => {
        cy.get('.item-label').eq(1).contains('Type');
        cy.get('.item-value').eq(1).contains('java.lang.Long');
        cy.get('.item-label').eq(2).contains('Value');
        cy.get('.item-value').eq(2).contains('123456789');
        cy.get('button').should('be.enabled');
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
    cy.contains('.modal').should('not.be.visible');
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