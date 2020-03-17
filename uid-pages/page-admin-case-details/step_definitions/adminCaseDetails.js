const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=1';
const caseUrl = 'API/bpm/case/1?';
const defaultFilters = 'd=processDefinitionId&d=started_by';
const commentUrl = 'API/bpm/comment';
const commentQueryParameters = '?p=0&c=999&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const caseListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/caseList';
const archivedCaseListUrl = 'API/bpm/archivedCase/?p=0&c=1&d=started_by&d=startedBySubstitute&d=processDefinitionId&f=sourceObjectId=1';

given("The response {string} is defined", (responseType) => {
    cy.server();
    switch (responseType) {
        case 'default details':
            createRouteWithResponse(caseUrl + defaultFilters, 'caseRoute', 'case');
            break;
        case 'comments':
            createRouteWithResponse(commentUrl + commentQueryParameters, 'commentsRoute', 'comments');
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
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '9TasksRoute', '9Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '9TasksRoute', '9Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '9TasksRoute', '9Tasks');
            break;
        case 'monitor 10 tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '10TasksRoute', '10Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '10TasksRoute', '10Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '10TasksRoute', '10Tasks');
            break;
        case 'monitor 10+ tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '10+TasksRoute', '10+Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '10+TasksRoute', '10+Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '10+TasksRoute', '10+Tasks');
            break;
        case 'monitor 0 tasks':
            createRouteWithResponse("API/bpm/flowNode?p=0&c=11&f=caseId=1&f=state=failed", '0TasksRoute', '0Tasks');
            createRouteWithResponse("API/bpm/humanTask?p=0&c=11&f=caseId=1&f=state=ready", '0TasksRoute', '0Tasks');
            createRouteWithResponse("API/bpm/archivedTask?p=0&c=11&f=caseId=1", '0TasksRoute', '0Tasks');
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
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix,
            response: '@' + response
        }).as(routeName);
    }
});

when("I visit the admin case details page", () => {
    cy.visit(url);
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

then("The case details have the correct information", () => {
    // Check that the element exist.
    cy.get('h3.text-left').contains('Case ID : 1').should('be.visible');
    cy.get('.item-label').contains('Process name');
    cy.get('.item-value').contains('Pool');
    cy.get('.item-label').contains('Display name');
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
           cy.wait('@9TasksRoute');
           cy.get('.item-value').contains('Failed (9), Pending (9), Done (9)');
           break;
       case "10":
           cy.wait('@10TasksRoute');
           cy.get('.item-value').contains('Failed (10), Pending (10), Done (10)');
           break;
       case "11":
           cy.wait('@10+TasksRoute');
           cy.get('.item-value').contains('Failed (10+), Pending (10+), Done (10+)');
           break;
       case "0":
           cy.wait('@0TasksRoute');
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
    cy.get('a').contains('Failed (9), Pending (9), Done (9)').should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/taskList?caseId=1');
});

then("The no task message is not visible", () =>{
   cy.get('.item-value').contains('No task in the task list for this case.').should('not.visible');
});

then("The task list link is not visible", () =>{
   cy.get('a.item-value').should('not.visible');
});