const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const rolesUrl = 'API/identity/role';
const defaultFilters = '&o=displayName ASC';
const defaultRequestUrl = urlPrefix + rolesUrl + '?c=20&p=0&t=0' + defaultFilters;
const refreshUrl = urlPrefix + rolesUrl + '?c=20&p=0&t=1*' + defaultFilters;
const userUrl = 'API/identity/user';
const defaultUserUrl = urlPrefix + userUrl + '?c=20&p=0&f=enabled=true&f=role_id=';

given("The response {string} is defined", (responseType) => {
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
        case 'default filter with headers':
            createRouteWithResponseAndHeaders(defaultRequestUrl,'', 'roles8Route', 'roles8', {'content-range': '0-8/8'});
            break;
        case 'sort by':
            createRoute(rolesUrl + '?c=20&p=0&t=0&o=displayName+DESC', 'sortDisplayNameDescRoute');
            createRoute(rolesUrl + '?c=20&p=0&t=0&o=name+ASC', 'sortNameAscRoute');
            createRoute(rolesUrl + '?c=20&p=0&t=0&o=name+DESC', 'sortNameDescRoute');
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + rolesUrl + '?c=20&p=0&t=0&o=displayName+DESC', 'sortDisplayNameDescRoute', 'roles20');
            createRouteWithResponse(urlPrefix + rolesUrl + '?c=10&p=2&o=displayName+DESC', 'sortDisplayNameDescRoute2', 'roles10');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Member', 'searchMemberRoute', 'roles1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'role creation success':
            createRouteWithMethod(rolesUrl, 'roleCreationRoute', 'POST');
            break;
        case 'refresh list after create':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'roles9');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + rolesUrl, 'createRoleAlreadyExistsRoute', 'createRoleAlreadyExists', 'POST', '403');
            break;
        case '403 during creation':
            createRouteWithMethodAndStatus(rolesUrl, 'unauthorizedCreateRoleRoute', 'POST', '403');
            break;
        case '500 during creation':
            createRouteWithMethodAndStatus(rolesUrl, 'unauthorizedCreateRoleRoute', 'POST', '500');
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
        case 'empty user list':
            createRouteWithResponse(defaultUserUrl + "1", 'userUrlRoute', 'emptyResult');
            break;
        case 'user list':
            createRouteWithResponseAndHeaders(defaultUserUrl, '1', 'userUrlRoute', 'users5', {'content-range': '0-5/5'});
            break;
        case 'user list search':
            createRouteWithResponse(defaultUserUrl + "1", 'userUrlRoute', 'users5');
            createRouteWithResponse(defaultUserUrl + "1&s=Virginie", 'oneUserRoute', 'users1');
            createRouteWithResponse(defaultUserUrl + "1&s=Search term with no match", 'noMatchRoute', 'emptyResult');
            createRouteWithResponse(defaultUserUrl + "116", 'userUrlRoute', 'emptyResult');
            break;
        case 'user search during limitation':
            createRouteWithResponse(defaultUserUrl + "1&s=Virginie", 'users20Route', 'users20');
            createRouteWithResponse(urlPrefix + userUrl + '?c=10&p=2&f=enabled=true&f=role_id=1&s=Virginie', 'emptyResultRoute', 'emptyResult');
            break;
        case 'user list for two roles':
            createRouteWithResponse(defaultUserUrl + "1", 'emptyResultRoute', 'emptyResult');
            createRouteWithResponse(defaultUserUrl + "116", 'userUrlRoute', 'users5');
            break;
        case 'role edition success':
            createRouteWithMethod(rolesUrl + "/1", 'roleEditionRoute', 'PUT');
            break;
        case 'refresh list after edit':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'roles8Modified');
            break;
        case '403 during edition':
            createRouteWithMethodAndStatus(rolesUrl + "/1", 'unauthorizedEditRoleRoute', 'PUT', '403');
            break;
        case '404 during edition':
            createRouteWithMethodAndStatus(rolesUrl + "/1", 'unauthorizedEditRoleRoute', 'PUT', '404');
            break;
        case '500 during edition':
            createRouteWithMethodAndStatus(rolesUrl + "/1", 'unauthorizedEditRoleRoute', 'PUT', '500');
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

    function createRouteWithMethod(urlSuffix, routeName, method) {
        createRouteWithMethodAndStatus(urlSuffix, routeName, method, 200);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndHeaders(url, queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: url + queryParameter,
            response: responseValue,
            headers: headers
        }).as(routeName);
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
    }

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
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

    function createRolesRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
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

    function createUserRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + userUrl + '?c=' + count + '&p=' + page;
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

when("I put {string} in user list search filter field", (filterValue) => {
    cy.get('.modal-body pb-input input').scrollIntoView().type(filterValue);
});

when("I fill in the information", () => {
    cy.get('.modal-body input').eq(0).type('Role name');
    cy.get('.modal-body input').eq(1).type('Role display name');
    cy.get('.modal-body textarea').type('Role description');
});

when("I erase the search filter", () => {
    cy.get('pb-input input:visible').clear();
});

when("I erase the user search filter", () => {
    cy.get('.modal-body pb-input input:visible').clear();
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

when("I edit the information for first role", () => {
    cy.get('.modal-body input').eq(0).clear().type('new member');
    cy.get('.modal-body input').eq(1).clear().type('New member');
    cy.get('.modal-body textarea').clear().type('This is a new description.');
});

when("I clear the name", () => {
    cy.get('.modal-body input').eq(0).clear();
});

when("I click on delete button for first role", () => {
    cy.get('.glyphicon.glyphicon-trash').eq(0).parent().click();
});

when("I click on edit button for first role", () => {
    cy.get('.glyphicon.glyphicon-pencil').eq(0).parent().click();
});

when("I click on edit button for second role", () => {
    cy.get('.glyphicon.glyphicon-pencil').eq(1).parent().click();
});

when("I click on user button for first role", () => {
    cy.get('.glyphicon.glyphicon-user').eq(0).parent().click();
});

when("I click on user button for second role", () => {
    cy.get('.glyphicon.glyphicon-user').eq(1).parent().click();
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
    cy.get('.role-item').eq(0).get('.btn.btn-link .glyphicon-user').should('have.attr', 'title', 'View the list of users mapped to this role');
    cy.contains('.item-label', 'Roles shown: 8 of 8');
});

then("A list of {int} roles is displayed", (nbrOfItems) => {
    cy.get('.role-item:visible').should('have.length', nbrOfItems);
});

then("A list of {int} users is displayed", (nbrOfItems) => {
    cy.get('.modal-body .role-item').should('have.length', nbrOfItems);
});

then("Only one user is displayed", () => {
    cy.get('.modal-body .role-item').should('have.length', 1);
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
        case 'Virginie':
            cy.wait('@oneUserRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No roles are available", () => {
    cy.get('.role-item:visible').should('have.length', 0);
    cy.contains('No roles to display').should('be.visible');
});

then("No users are available", () => {
    cy.get('.modal-body .role-item').should('have.length', 0);
    cy.contains('No users to display').should('be.visible');
});

then("The create modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 2);
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
    cy.contains('.modal-body p.text-left', 'Make sure that no user is mapped to this role before you can safely delete it. Their memberships would be lost.').should('be.visible');
    cy.contains('.modal-body p.text-left', 'Are you sure you want to delete this role?').should('be.visible');
});

then("The edit modal is open and has a default state for {string} for role {int}", (state, roleNumber) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 2);
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Display name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    switch (roleNumber) {
        case 1:
            cy.get('.modal-body input').eq(0).should('have.value','member');
            cy.get('.modal-body input').eq(1).should('have.value','Member');
            cy.get('.modal-body textarea').should('have.value','This is a description.');
            break;
        case 2:
            cy.get('.modal-body input').eq(0).should('have.value','Role11');
            cy.get('.modal-body input').eq(1).should('have.value','Role11');
            cy.get('.modal-body textarea').should('have.value','');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Save').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The edit modal is open and has a edited state for {string}", (state, roleNumber) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 2);
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Display name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    cy.get('.modal-body input').eq(0).should('have.value','new member');
    cy.get('.modal-body input').eq(1).should('have.value','New member');
    cy.get('.modal-body textarea').should('have.value','This is a new description.');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Save').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The user list modal is open and has no users for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by first name, last name or username').should('have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'No users to display').should('be.visible');
    cy.contains('.modal-body p.text-right', 'Users shown:').should('not.be.visible');
    cy.contains('.modal-body button', 'Load more users').should('not.be.visible');
    cy.get('.modal-body .glyphicon-option-horizontal').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("The user list modal is open and has users for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by first name, last name or username').should('not.have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'No users to display').should('not.be.visible');
    cy.contains('.modal-body p.text-right', 'Users shown:').should('be.visible');
    cy.contains('.modal-body button', 'Load more users').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .role-item').should('have.length', 5);
    // Check that we use -- instead of empty field when there is no last name
    cy.get('.modal-body .role-item').should('have.length', 5).eq(0).within(() => {
        cy.contains('.item-value', '--').should('have.length', 1);
    });
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

then("The edition is successful", () => {
    cy.contains('.modal-footer button', 'Save').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@roleEditionRoute').then((xhr) => {
        expect(xhr.request.body.name).to.equal('new member');
        expect(xhr.request.body.displayName).to.equal('New member');
        expect(xhr.request.body.description).to.equal('This is a new description.');
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

then("The {string} button in modal is {string}", (buttonName, buttonState) => {
    cy.contains('.modal-footer button', buttonName).should('be.' + buttonState);
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The role does not exist. Reload the page to see the new list of roles.').should('be.visible');
            break;
        case 'already exists':
            cy.contains('.modal-body', 'A role with the same name already exists.').should('be.visible');
            break;
        case 'not exists during delete':
            cy.contains('.modal-body', 'The role does not exist. Reload the page to see the new list of roles.').should('be.visible');
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

then("The first role has a different name", () => {
    cy.get('.role-item').eq(0).within(() => {
        cy.get('.item-value').eq(0).contains('New member');
        cy.get('.item-value').eq(1).contains('new member');
        cy.contains('.item-label', 'This is a new description.');
    });
});

then("The first user details link has the correct url", () => {
    cy.get('.modal-body .glyphicon.glyphicon-option-horizontal').eq(0).parent().should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-user-details?id=7');
});

then("The user search is not disabled", () => {
    cy.get('.modal-body pb-input input:visible').should('not.have.attr', 'readonly');
});

then("The user search is disabled", () => {
    cy.get('.modal-body pb-input input:visible').should('have.attr', 'readonly', 'readonly');
});
