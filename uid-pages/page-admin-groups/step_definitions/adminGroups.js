const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const groupsUrl = 'API/identity/group';
const defaultFilters = '&o=displayName ASC';
const defaultRequestUrl = urlPrefix + groupsUrl + '?c=20&p=0' + defaultFilters;
const refreshUrl = urlPrefix + groupsUrl + '?c=20&p=0' + defaultFilters + '&t=1*';
const parentGroupSearchUrl = urlPrefix + groupsUrl + '?p=0&c=20&o=name&s=';

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
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'groups8Route', 'groups8');
            break;
        case 'sort by':
            createRoute(groupsUrl + '?c=20&p=0&o=displayName+DESC&t=0', 'sortDisplayNameDescRoute');
            createRoute(groupsUrl + '?c=20&p=0&o=name+ASC&t=0', 'sortNameAscRoute');
            createRoute(groupsUrl + '?c=20&p=0&o=name+DESC&t=0', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Acme&t=0', 'searchAcmeRoute', 'groups1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match&t=0', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0','groups20Route', 'groups20');
            createRolesRouteWithResponseAndPagination('', 'groups10Route', 'groups10', 2, 10);
            createRolesRouteWithResponseAndPagination('', 'groups8Route', 'groups8', 3, 10);
            createRolesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'groups20Route', 'groups20');
            createRolesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'group creation success':
            createRouteWithMethod(groupsUrl, 'parentGroupCreationRoute', 'POST');
            break;
        case 'parent group list':
            createRouteWithResponse(parentGroupSearchUrl + 'A', 'parentGroupListRoute', 'groups8');
            break;
        case 'refresh list after create':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'groups9');
            break;
        case 'parent group list with 20 groups':
            createRouteWithResponse(parentGroupSearchUrl + 'A', 'parentGroupWith20GroupsRoute', 'groups20');
            createRouteWithResponse(parentGroupSearchUrl + 'Au', 'parentGroupWith8GroupsRoute', 'groups8');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + groupsUrl, 'createGroupAlreadyExistsRoute', 'createGroupAlreadyExists', 'POST', '500');
            break;
        case '403 during creation':
            createRouteWithMethodAndStatus(groupsUrl, 'unauthorizedCreateGroupRoute', 'POST', '403');
            break;
        case '500 during creation':
            createRouteWithMethodAndStatus(groupsUrl, 'unauthorizedCreateGroupRoute', 'POST', '500');
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
        const loadMoreUrl = urlPrefix + groupsUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

when("I visit the admin groups page", () => {
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

when("I erase the search filter", () => {
    cy.get('pb-input input:visible').clear();
});

when("I click on Load more groups button", () => {
    cy.get('button').contains('Load more groups').click();
});

when("I click on create button", () => {
    cy.contains('button', 'Create').click();
});

when("I click on the {string} button in modal", (buttonName) => {
    cy.contains('.modal button', buttonName).click();
});

when("I fill in the information", () => {
    cy.get('.modal-body input').eq(0).type('Group name');
    cy.get('.modal-body input').eq(1).type('Group display name');
    cy.get('.modal-body input').eq(2).type('Group description');
});

when("I type {string} in the parent group input", (parentName) => {
    cy.get('.modal-body input').eq(3).type(parentName);
});

when("I click on {string} in the list", (parentGroupName) => {
    cy.contains('.modal-content .dropdown-menu button', parentGroupName).click();
});

when("I remove {string} from the parent group input", () => {
    cy.get(".modal-body input").eq(3).type("{backspace}")
});

then("The groups page have the correct information", () => {
    cy.contains('h3', 'Groups');
    cy.get('.group-item').should('have.length', 8);
    cy.get('.group-item').eq(0).contains('.item-label', 'Display name');
    cy.get('.group-item').eq(0).contains('.item-value', 'Acme');
    cy.get('.group-item').eq(0).contains('.item-label', 'Name');
    cy.get('.group-item').eq(0).contains('.item-value', 'acme');
    cy.get('.group-item').eq(0).contains('.item-label', 'Created on');
    cy.get('.group-item').eq(0).contains('.item-value', '7/31/20 11:34 AM');
    cy.get('.group-item').eq(0).contains('.item-label', 'Updated on');
    cy.get('.group-item').eq(0).contains('.item-value', '8/6/20 9:52 AM');
    cy.get('.group-item').eq(0).contains('.item-label', 'This group represents the acme department of the ACME organization');
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-th-list').should('have.attr', 'title', 'View sub-groups');;
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-user').should('have.attr', 'title', 'View users in the group');
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-pencil').should('have.attr', 'title', 'Edit group');;
    cy.get('.group-item').eq(0).get('.btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete group');;
    cy.contains('.item-label', 'Groups shown: 8');
});

then("A list of {int} groups is displayed", (nbrOfItems) => {
    cy.get('.group-item:visible').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Display name (Asc)':
            cy.wait('@groups8Route');
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
        case 'Acme':
            cy.wait('@searchAcmeRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No groups are available", () => {
    cy.get('.group-item:visible').should('have.length', 0);
    cy.contains('No groups to display').should('be.visible');
});

then("The load more groups button is disabled", () => {
    cy.get('button').contains('Load more groups').should('be.disabled');
});

then("The create modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 4);
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Display name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    cy.contains('.modal-body', 'Parent group').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.visible');
});

then("The {string} button in modal is {string}", (buttonName, buttonState) => {
    cy.contains('.modal-footer button', buttonName).should('be.' + buttonState);
});

then("The parent group list is displayed", () => {
    cy.get('.modal-body .dropdown-menu').scrollIntoView().should('be.visible');
});

then("The parent group list is not displayed", () => {
    cy.get('.modal-body .dropdown-menu').should('not.be.visible');
});

then("The parent group input is filled with {string}", (parentGroupName) => {
    cy.get('.modal-body .form-group input').eq(3).should('have.value', parentGroupName);
});

then("The creation is successful", () => {
    cy.contains('.modal-footer button', 'Create').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@parentGroupCreationRoute').then((xhr) => {
        expect(xhr.request.body.name).to.equal('Group name');
        expect(xhr.request.body.displayName).to.equal('Group display name');
        expect(xhr.request.body.description).to.equal('Group description');
        expect(xhr.request.body.parent_group_id).to.equal('1');
    });
    cy.get('.modal-body input').each((input) => {
        expect(input).to.have.attr('readonly', 'readonly');
    });
});

then("The groups list is refreshed", () => {
    cy.wait('@refreshUrlRoute');
});

then("The type more message is displayed and disabled", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').scrollIntoView();
    cy.get('.dropdown-menu button').eq(20).contains('Or type more...');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.visible');
    cy.contains('.dropdown-menu button', 'Or type more...').should('be.disabled');
});

then("The type more message is not displayed", () => {
    cy.contains('.dropdown-menu button', 'Or type more...').should('not.be.visible');
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case 'already exists':
            cy.contains('.modal-body', 'A group with the same name already exists.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The group has not been ' + action + '.').should('be.visible');
});