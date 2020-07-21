const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const rolesUrl = 'API/identity/role';
const defaultFilters = '&o=displayName ASC';
const defaultRequestUrl = urlPrefix + rolesUrl + '?c=20&p=0' + defaultFilters;
const refreshUrl = urlPrefix + rolesUrl + '?c=20&p=0' + defaultFilters + '&t=1*';

given("The response {string} is defined", (responseType) => {
    cy.viewport(1366, 768);
    cy.server();
    switch (responseType) {
        case 'refresh not called':
            cy.route({
                method: "GET",
                url: refreshUrl,
                onRequest: () => {
                throw new Error("This should have not been called");
                }
            });
            break;
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'roles8Route', 'roles8');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0','roles20Route', 'roles20');
            createRouteWithResponseAndPagination('', 'roles10Route', 'roles10', 2, 10);
            createRouteWithResponseAndPagination('', 'roles8Route', 'roles8', 3, 10);
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'roles20Route', 'roles20');
            createRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'sort by':
            createRoute(rolesUrl + '?c=20&p=0&o=displayName+DESC&t=0', 'sortDisplayNameDescRoute');
            createRoute(rolesUrl + '?c=20&p=0&o=name+ASC&t=0', 'sortNameAscRoute');
            createRoute(rolesUrl + '?c=20&p=0&o=name+DESC&t=0', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Member&t=0', 'searchMemberRoute', 'roles1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match&t=0 ', 'emptyResultRoute', 'emptyResult');
            break;
        case 'role creation success':
            createPostRoute(rolesUrl, 'roleCreationRoute');
            break;
        case 'refresh list after create':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'roles9');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + rolesUrl, 'createRoleAlreadyExistsRoute', 'createRoleAlreadyExists', 'POST', '403');
            break;
        case '403 during creation':
            createPostRouteWithStatus(rolesUrl, 'unauthorizedCreateRoleRoute', '403');
            break;
        case '500 during creation':
            createPostRouteWithStatus(rolesUrl, 'unauthorizedCreateRoleRoute', '500');
            break;
        case 'role deletion success':
            createRouteWithResponseAndMethod(urlPrefix + rolesUrl + "/1", 'deleteSuccessRoute', 'emptyResult', 'DELETE');
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'roles7');
            break;
        case '403 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + rolesUrl + "/1", 'unauthorizedCreateRoleRoute', 'emptyResult', 'DELETE', '403');
            break;
        case 'not exists during delete':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + rolesUrl + "/1", 'unauthorizedCreateRoleRoute', 'deleteRoleDoesNotExist', 'DELETE', '500');
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'roles8');
            break;
        case '500 during deletion':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + rolesUrl + "/1", 'unauthorizedCreateRoleRoute', 'emptyResult', 'DELETE', '500');
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(urlSuffix, routeName) {
        cy.route({
            method: 'GET',
            url: urlPrefix + urlSuffix
        }).as(routeName);
    }

    function createPostRoute(urlSuffix, routeName) {
        createPostRouteWithStatus(urlSuffix, routeName, 200);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
    }

    function createPostRouteWithStatus(urlSuffix, routeName, status) {
        cy.route({
            method: 'POST',
            url: urlPrefix + urlSuffix,
            response: "",
            status: status
        }).as(routeName);
    }

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        cy.fixture('json/' + response + '.json').as(response);
        cy.route({
            method: method,
            url: url,
            status: status,
            response: '@' + response
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + rolesUrl + '?c=' + count + '&p=' + page + defaultFilters;
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
});

when("I visit the admin roles page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on Load more roles button", () => {
    cy.get('button').contains('Load more roles').click();
});

when("I put {string} in {string} filter field", (filterValue, filterType) => {
    switch (filterType) {
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Display name (Asc)':
                cy.get('select:visible').select('0');
                break;
            case 'Display name (Desc)':
                cy.get('select:visible').select('1');
                break;
            case 'Name (Asc)':
                cy.get('select:visible').select('2');
                break;
            case 'Name (Desc)':
                cy.get('select:visible').select('3');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input:visible').type(filterValue);
    }
});

when("I fill in the information", () => {
    cy.get('.modal-body input').eq(0).type('Role name');
    cy.get('.modal-body input').eq(1).type('Role display name');
    cy.get('.modal-body input').eq(2).type('Role description');
});

when("I erase the search filter", () => {
    cy.get('pb-input input:visible').clear();
});

when("I click on create button", () => {
cy.contains('button', 'Create').click();
});

when("I click on the {string} button in modal", (buttonName) => {
    cy.contains('.modal button', buttonName).click();
});

when("I fill in the name", () => {
    cy.get('.modal-body input').eq(0).type('Role name');
});

when("I clear the name", () => {
    cy.get('.modal-body input').eq(0).clear();
});

when("I click on delete button for first role", () => {
    cy.get('.glyphicon.glyphicon-trash').eq(0).parent().click();
});

then("The roles page have the correct information", () => {
    cy.contains('h3', 'Roles');
    cy.get('.role-item').should('have.length', 8);
    cy.get('.role-item').eq(0).contains('.item-label', 'Name');
    cy.get('.role-item').eq(0).contains('.item-value', 'member');
    cy.get('.role-item').eq(0).contains('.item-label', 'Display name');
    cy.get('.role-item').eq(0).contains('.item-value', 'Member');
    cy.get('.role-item').eq(0).contains('.item-label', 'Created on');
    cy.get('.role-item').eq(0).contains('.item-value', '3/20/20 8:58 AM');
    cy.get('.role-item').eq(0).contains('.item-label', 'Updated on');
    cy.get('.role-item').eq(0).contains('.item-value', '7/15/20 3:05 PM');
    cy.get('.role-item').eq(0).contains('.item-label', 'This is a description.');
    cy.get('.role-item').eq(0).get('.btn.btn-link .glyphicon-pencil');
    cy.get('.role-item').eq(0).get('.btn.btn-link .glyphicon-trash');
});

then("A list of {int} roles is displayed", (nbrOfItems) => {
    cy.get('.role-item:visible').should('have.length', nbrOfItems);
});

then("The load more roles button is disabled", () => {
    cy.get('button').contains('Load more roles').should('be.disabled');
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Display name (Asc)':
            cy.wait('@roles8Route');
            break;
        case 'Display name (Desc)':
            cy.wait('@sortDisplayNameDescRoute');
            break;
        case 'Name (Asc)':
            cy.wait('@sortNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortNameDescRoute');
            break;
        case 'Member':
            cy.wait('@searchMemberRoute');
        break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No roles are available", () => {
    cy.get('.task-item:visible').should('have.length', 0);
    cy.contains('No roles to display').should('be.visible');
});

then("The create modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 3);
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Display name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The delete modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Delete').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
    cy.contains('.modal-content p.text-left', 'DOES NOT WORK YET SINCE WE NEED THE TEXT FROM NATH').should('be.visible');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.visible');
});

then("The creation is successful", () => {
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@roleCreationRoute').then((xhr) => {
        expect(xhr.request.body.name).to.equal('Role name');
        expect(xhr.request.body.displayName).to.equal('Role display name');
        expect(xhr.request.body.description).to.equal('Role description');
    });
    cy.get('.modal-body input').each((input) => {
        expect(input).to.have.attr('readonly', 'readonly');
    });
});

then("The roles list is refreshed", () => {
    cy.wait('@refreshUrlRoute');
});

then("There is a error message about name being required", () => {
    cy.contains('This field is required').should('be.visible');
});

then("The create button in modal is enabled", () => {
    cy.contains('.modal-footer button', 'Create').should('be.enabled');
});

then("The create button in modal is disabled", () => {
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case 'already exists':
            cy.contains('.modal-body', 'A role with the same name already exists.').should('be.visible');
            break;
        case 'not exists during delete':
            cy.contains('.modal-body', 'THIS NEEDS TO BE CHANGED BY NATH.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The role has not been ' + action + '.').should('be.visible');
});

then("The deletion is successful", () => {
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
    cy.contains('.modal-body', 'The role has been successfully deleted.').should('be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.disabled');
});
