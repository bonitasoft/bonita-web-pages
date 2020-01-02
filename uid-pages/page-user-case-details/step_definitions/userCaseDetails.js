const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html?id=1';
const caseUrl = 'API/bpm/case/1?';
const defaultFilters = 'd=processDefinitionId&d=started_by&n=activeFlowNodes&n=failedFlowNodes';
const commentUrl = 'API/bpm/comment';
const commentQueryParameters = '?p=0&c=10&o=postDate DESC&f=processInstanceId=1&d=userId&t=0';
const caseListUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/caseList';

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
            createRouteWithResponse(commentUrl + '?p=0&c=10&o=postDate DESC&f=processInstanceId=1&d=userId&t=1*', 'commentsRoute', 'newComments');
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

when("I visit the user case details page", () => {
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
    cy.get('h5.text-left').contains('Case Id: 1').should('be.visible');
    cy.get('.item-label').contains('Process name (version)');
    cy.get('.item-value').contains('Pool (1.0)');
    cy.get('.item-label').contains('State');
    cy.get('.item-value').contains('started');
    cy.get('.item-label').contains('Started by');
    cy.get('.item-value').contains('William Jobs');
    cy.get('.item-label').contains('Started on');
    cy.get('.item-value').contains('12/30/19 4:01 PM');
    cy.get('.item-label').contains('Last updated');
    cy.get('.item-value').contains('12/30/19 4:01 PM');
    cy.get('.item-label').contains('Tasks');
    cy.get('.item-value').contains('1');
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
    cy.get('.glyphicon-user').should('have.length', 4);
    cy.get('.item-value').contains('comment no. 1');
    cy.get('.item-value').contains('William Jobs');
    cy.get('.item-value').contains('comment no. 2');
    cy.get('.item-value').contains('helen.kelly');
    cy.get('.item-value').contains('comment no. 3');
    cy.get('.item-value').contains('walter.bates');
    cy.get('.item-value').contains('comment no. 4');
    cy.get('.item-value').contains('anthony.nichols');
});

then("There are no search keys", () => {
    // Check that there are no search keys
    cy.get('h5').contains('Search keys').should('not.exist');
});

then("The back button has correct href", () => {
    cy.get('.glyphicon-chevron-left').parent('a').should('have.attr', 'href', caseListUrl);
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