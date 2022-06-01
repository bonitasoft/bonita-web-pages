const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const groupsUrl = 'API/identity/group';
const defaultFilters = '&d=parent_group_id&o=displayName ASC';
const defaultRequestUrl = urlPrefix + groupsUrl + '?c=20&p=0' + defaultFilters;
const refreshUrl = urlPrefix + groupsUrl + '?c=20&p=0' + defaultFilters + '&t=1*';
const parentGroupSearchUrl = urlPrefix + groupsUrl + '?p=0&c=20&o=name&s=';
const subGroupUrl = urlPrefix + groupsUrl + '?p=0&c=20&o=displayName ASC&f=parent_path=';
const userUrl = 'API/identity/user';
const defaultUserUrl = urlPrefix + userUrl + '?c=20&p=0&f=enabled=true&f=group_id=';

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
            createRouteWithResponseAndHeaders('&t=0', 'groups8Route', 'groups8', {'content-range': '0-8/8'});
            break;
        case 'sort by':
            createRoute(groupsUrl + '?c=20&p=0&d=parent_group_id&o=displayName+DESC&t=0', 'sortDisplayNameDescRoute');
            createRoute(groupsUrl + '?c=20&p=0&d=parent_group_id&o=name+ASC&t=0', 'sortNameAscRoute');
            createRoute(groupsUrl + '?c=20&p=0&d=parent_group_id&o=name+DESC&t=0', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Acme&t=0', 'searchAcmeRoute', 'groups1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match&t=0', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponseAndHeaders('&t=0', 'groups20Route', 'groups20', {'content-range': '0-20/35'});
            createGroupsRouteWithResponseAndPagination('', 'groups10Route', 'groups10', 2, 10);
            createGroupsRouteWithResponseAndPagination('', 'groups8Route', 'groups8', 3, 10);
            createGroupsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'groups20Route', 'groups20');
            createGroupsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'enable 30 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'groups20Route', 'groups20');
            createGroupsRouteWithResponseAndPagination('', 'groups10Route', 'groups10', 2, 10);
            createGroupsRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 3, 10);
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
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + groupsUrl + '?c=20&p=0&d=parent_group_id&o=displayName+DESC&t=0', 'sortDisplayNameDescRoute', 'groups20');
            createRouteWithResponse(urlPrefix + groupsUrl + '?c=10&p=2&d=parent_group_id&o=displayName+DESC', 'sortDisplayNameDescRoute2', 'groups10');
            break;
        case 'parent group list with 20 groups':
            createRouteWithResponse(parentGroupSearchUrl + 'A', 'parentGroupWith20GroupsRoute', 'groups20');
            createRouteWithResponse(parentGroupSearchUrl + 'Au', 'parentGroupWith8GroupsRoute', 'groups8');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + groupsUrl, 'createGroupAlreadyExistsRoute', 'createGroupAlreadyExists', 'POST', '403');
            break;
        case '403 during creation':
            createRouteWithMethodAndStatus(groupsUrl, 'unauthorizedCreateGroupRoute', 'POST', '403');
            break;
        case '500 during creation':
            createRouteWithMethodAndStatus(groupsUrl, 'unauthorizedCreateGroupRoute', 'POST', '500');
            break;
        case 'empty user list':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'userUrlRoute', 'emptyResult');
            break;
        case 'user list':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'userUrlRoute', 'users5');
            break;
        case 'user list search':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'userUrlRoute', 'users5');
            createRouteWithResponse(defaultUserUrl + '1&s=Virginie&t=1*', 'oneUserRoute', 'users1');
            createRouteWithResponse(defaultUserUrl + '1&s=Search term with no match&t=1*', 'noMatchRoute', 'emptyResult');
            break;
        case 'user search during limitation':
            createRouteWithResponse(defaultUserUrl + '1&s=Virginie&t=1*', 'users20Route', 'users20');
            createRouteWithResponse(urlPrefix + userUrl + '?c=10&p=2&f=enabled=true&f=group_id=1&s=Virginie', 'emptyResultRoute', 'emptyResult');
            break;
        case 'user list load more':
            createRouteWithResponse(defaultUserUrl + '1&t=1*','users20Route', 'users20');
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'users10Route', 'users10', 2, 10);
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'users5Route', 'users5', 3, 10);
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'user list 20 load more':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'users20Route', 'users20');
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'user list 30 load more':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'users20Route', 'users20');
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'users10Route', 'users10', 2, 10);
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'user list for two groups':
            createRouteWithResponse(defaultUserUrl + '1&t=1*', 'emptyResultRoute', 'users18');
            createUserRouteWithResponseAndPagination('&f=enabled=true&f=group_id=1', 'emptyResultRoute', 'emptyResult', 2, 10);
            createRouteWithResponse(defaultUserUrl + '9&t=1*', 'userUrlRoute', 'emptyResult');
            break;
        case 'empty sub-group list':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'subGroupUrlRoute', 'emptyResult');
            break;
        case 'sub-group list':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'subGroupUrlRoute', 'subGroups5');
            break;
        case 'sub-group list search':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'subGroupUrlRoute', 'subGroups5');
            createRouteWithResponse(subGroupUrl + '/acme&s=Acme&t=1*', 'searchAcmeRoute', 'subGroups1');
            createRouteWithResponse(subGroupUrl + '/acme&s=Search term with no match&t=1*', 'noMatchRoute', 'emptyResult');
            break;
        case 'sub-groups search during limitation':
            createRouteWithResponse(subGroupUrl + '/acme&s=Acme&t=1*', 'subGroups20Route', 'groups20');
            createRouteWithResponse(urlPrefix + groupsUrl + '?p=2&c=10&o=displayName ASC&f=parent_path=/acme&s=Acme', 'emptyResultRoute', 'emptyResult');
            break;
        case 'sub-groups list load more':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*','subGroups20Route', 'groups20');
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'subGroups10Route', 'groups10', 2, 10);
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'subGroups5Route', 'subGroups5', 3, 10);
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'sub-groups list 20 load more':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'subGroups20Route', 'groups20');
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'sub-groups list 30 load more':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'subGroups20Route', 'groups20');
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'subGroups10Route', 'groups10', 2, 10);
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'sub-groups list for two groups':
            createRouteWithResponse(subGroupUrl + '/acme&t=1*', 'emptyResultRoute', 'subGroups18');
            createSubGroupsRouteWithResponseAndPagination('&o=displayName ASC&f=parent_path=/acme', 'emptyResultRoute', 'emptyResult', 2, 10);
            createRouteWithResponse(subGroupUrl + '/acme/sales/asia&t=1*', 'SubGroupUrlRoute', 'emptyResult');
            break;
        case 'current parent information':
            createRouteWithResponse(urlPrefix + groupsUrl + '/8?t=1*', 'currentParentGroupEuropeRoute', 'currentParentGroupEurope');
            break;
        case 'current parent information for second group':
            createRouteWithResponse(urlPrefix + groupsUrl + '/4?t=1*', 'currentParentGroupInfrastructureRoute', 'currentParentGroupInfrastructure');
            break;
        case 'group edition success':
            createRouteWithMethod(groupsUrl + '/1', 'groupEditionRoute', 'PUT');
            createRouteWithResponse(urlPrefix + groupsUrl + '/9?t=1*', 'currentParentGroupAsiaRoute', 'currentParentGroupAsia');
            break;
        case 'refresh list after edit':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'groups8Updated');
            break;
        case 'already exists during edition':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + groupsUrl + '/1', 'editGroupAlreadyExistsRoute', 'editGroupAlreadyExists', 'PUT', '403');
            break;
        case '403 during edition':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'unauthorizedEditGroupRoute', 'PUT', '403');
            break;
        case '404 during edition':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'notFoundEditGroupRoute', 'PUT', '404');
            break;
        case '500 during edition':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'internalErrorEditGroupRoute', 'PUT', '500');
            break;
        case 'group deletion success':
            createRouteWithMethod(groupsUrl + '/1', 'parentGroupDeletionRoute', 'DELETE');
            break;
        case 'refresh list after delete':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'groups7');
            break;
        case '403 during deletion':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'unauthorizedDeleteGroupRoute', 'DELETE', '403');
            break;
        case '404 during deletion':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'notFoundDeleteGroupRoute', 'DELETE', '404');
            break;
        case '500 during deletion':
            createRouteWithMethodAndStatus(groupsUrl + '/1', 'internalErrorDeleteGroupRoute', 'DELETE', '500');
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

    function createRouteWithResponseAndHeaders(queryParameter, routeName, response, headers) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
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

    function createGroupsRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
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

    function createSubGroupsRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + groupsUrl + '?p=' + page + '&c=' + count;
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

when("I erase all the information in edit modal", () => {
    cy.get('.modal-body pb-input input').eq(0).clear();
    cy.get('.modal-body pb-input input').eq(1).clear();
    cy.get('.modal-body textarea').clear();
});

when("I click on Load more groups button", () => {
    cy.get('button').contains('Load more groups').click();
});

when("I click on create button", () => {
    cy.contains('button', 'Create').click();
});

when("I click on the {string} button in modal body", (buttonName) => {
    cy.contains('.modal-body button', buttonName).click();
});

when("I click on the {string} glyphicon button in modal body", (glyphiconName) => {
    cy.get('.modal-body .glyphicon-' + glyphiconName).click();
});

when("I click on the {string} button in modal footer", (buttonName) => {
    cy.contains('.modal-footer button', buttonName).click();
});

when("I fill in the information", () => {
    cy.get('.modal-body input').eq(0).type('Group name');
    cy.get('.modal-body input').eq(1).type('Group display name');
    cy.get('.modal-body textarea').type('Group description');
});

when("I type {string} in the parent group input", (parentName) => {
    cy.get('.modal-body input').eq(2).type(parentName);
});

when("I click on {string} in the list", (parentGroupName) => {
    cy.contains('.modal-content .dropdown-menu button', parentGroupName).click();
});

when("I remove {string} from the parent group input", () => {
    cy.get(".modal-body input").eq(2).type("{backspace}")
});

when("I click on Load more users button", () => {
    cy.get('.modal-body button').contains('Load more users').click();
});

when("I click on Load more sub-groups button", () => {
    cy.get('.modal-body button').contains('Load more sub-groups').click();
});

when("I put {string} in modal search filter field", (filterValue) => {
    cy.get('.modal-body pb-input input').type(filterValue);
});

when("I erase the modal search filter", () => {
    cy.get('.modal-body pb-input input').clear();
});

when("I click on user button for first group", () => {
    cy.get('.glyphicon.glyphicon-user').eq(0).parent().click();
});

when("I click on edit button for first group", () => {
    cy.get('.glyphicon.glyphicon-pencil').eq(0).parent().click();
});

when("I click on delete button for first group", () => {
    cy.get('.glyphicon.glyphicon-trash').eq(0).parent().click();
});

when("I click on edit button for second group", () => {
    cy.get('.glyphicon.glyphicon-pencil').eq(1).parent().click();
});

when("I click on user button for second group", () => {
    cy.get('.glyphicon.glyphicon-user').eq(1).parent().click();
});

when("I click on sub-group button for first group", () => {
    cy.get('.glyphicon.glyphicon-th-list').eq(0).parent().click();
});

when("I click on sub-group button for second group", () => {
    cy.get('.glyphicon.glyphicon-th-list').eq(1).parent().click();
});

then("The groups page have the correct information", () => {
    cy.contains('h3', 'Groups');
    cy.get('.group-item').should('have.length', 8);
    cy.get('.group-item').eq(0).within((item) => {
        cy.wrap(item).contains('.item-label', 'Display name');
        cy.wrap(item).contains('.item-value', 'Acme');
        cy.wrap(item).contains('.item-label', 'Name');
        cy.wrap(item).contains('.item-value', 'acme');
        cy.wrap(item).contains('.item-label', 'Created on');
        cy.wrap(item).contains('.item-value', '7/31/20 11:34 AM');
        cy.wrap(item).contains('.item-label', 'Updated on');
        cy.wrap(item).contains('.item-value', '8/6/20 9:52 AM');
        cy.wrap(item).contains('.item-label', 'This group represents the acme department of the ACME organization');
        cy.wrap(item).get('.btn.btn-link .glyphicon-th-list').should('have.attr', 'title', 'View sub-groups');
        cy.wrap(item).get('.btn.btn-link .glyphicon-user').should('have.attr', 'title', 'View users in the group');
        cy.wrap(item).get('.btn.btn-link .glyphicon-pencil').should('have.attr', 'title', 'Edit group');
        cy.wrap(item).get('.btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete group');
    });
    cy.contains('.item-label', 'Groups shown: 8 of 8');
});

then("A list of {int} groups is displayed", (nbrOfItems) => {
    cy.get('.group-item:visible').should('have.length', nbrOfItems);
});

then("A list of {int} groups is displayed out of {int}", (nbrOfItems, totalItems) => {
    cy.get('.group-item:visible').should('have.length', nbrOfItems);
    cy.get('.text-primary.item-label:visible').contains('Groups shown: ' + nbrOfItems + ' of ' + totalItems);
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
        case 'Virginie':
            cy.wait('@oneUserRoute');
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
    cy.get('.modal-body input').should('have.length', 3);
    cy.get('.modal-body textarea').should('have.length', 1);
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

then("The delete modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
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
    cy.get('.modal-body .form-group input').eq(2).should('have.value', parentGroupName);
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

then("The edition is successful", () => {
    cy.contains('.modal-footer button', 'Save').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.wait('@groupEditionRoute').then((xhr) => {
        expect(xhr.request.body.name).to.equal('Group name');
        expect(xhr.request.body.displayName).to.equal('Group display name');
        expect(xhr.request.body.description).to.equal('Group description');
        expect(xhr.request.body.parent_group_id).to.equal('9');
    });
    cy.get('.modal-body input').each((input) => {
        expect(input).to.have.attr('readonly', 'readonly');
    });
});

then("The edition is successful with empty parent field", () => {
    cy.wait('@groupEditionRoute').then((xhr) => {
        expect(xhr.request.body.parent_group_id).to.equal('');
    });
});

then("The edition is successful with old parent", () => {
    cy.wait('@groupEditionRoute').then((xhr) => {
        expect(xhr.request.body.parent_group_id).to.equal('8');
    });
});

then("The deletion is successful", () => {
    cy.contains('.modal-footer button', 'Delete').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
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
        case '404':
            cy.contains('.modal-body', 'The group does not exist. Reload the page to see the new list of groups.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The group has not been ' + action + '.').should('be.visible');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.modal-body .group-item').should('have.length', nbrOfItems);
});

then("Only one item is displayed", () => {
    cy.get('.modal-body .group-item').should('have.length', 1);
});

then("The load more {string} button is disabled", (items) => {
    cy.get('.modal-body button').contains('Load more ' + items).should('be.disabled');
});

then("No {string} are available", (item) => {
    cy.get('.modal-body .group-item').should('have.length', 0);
    cy.contains('No ' + item + ' to display').should('be.visible');
});

then("No users are available", () => {
    cy.get('.modal-body .group-item').should('have.length', 0);
    cy.contains('No users to display').should('be.visible');
});

then("The user list modal is open and has no users for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by first name, last name, or username').should('have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'No users to display').should('be.visible');
    cy.contains('.modal-body p.text-right', 'Users shown:').should('not.be.visible');
    cy.contains('.modal-body button', 'Load more users').should('not.be.visible');
    cy.get('.modal-body .glyphicon-option-horizontal').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("The user list modal is open and has {int} users for {string}", (numberOfUsers, state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by first name, last name, or username').should('not.have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'No users to display').should('not.be.visible');
    cy.contains('.modal-body p.text-right', 'Users shown:').should('be.visible');
    cy.contains('.modal-body button', 'Load more users').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .group-item').should('have.length', numberOfUsers);
    // Check that we use -- instead of empty field when there is no last name
    cy.get('.modal-body .group-item').eq(0).within(() => {
        cy.contains('.item-value', '--').should('have.length', 1);
    });
});

then("The first user details link has the correct url", () => {
    cy.get('.modal-body .glyphicon.glyphicon-option-horizontal').eq(0).parent().should('have.attr', 'href', '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-user-details?id=7');
});

then("The search input is not disable", () => {
    cy.get('.modal-body input').should('not.be.disabled');
});

then("The sub-group list modal is open and has no sub-groups for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by display name, or name').should('have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'No sub-groups to display').should('be.visible');
    cy.contains('.modal-body p.text-right', 'Sub-groups shown:').should('not.be.visible');
    cy.contains('.modal-body button', 'Load more sub-groups').should('not.be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
});

then("The sub-group list modal is open and has {int} sub-groups for {string}", (numberOfSubGroups, state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.attr', 'placeholder', 'Search by display name, or name').should('not.have.attr', 'readonly', 'readonly');
    cy.contains('.modal-body h4', 'There are no sub-groups in this group').should('not.be.visible');
    cy.contains('.modal-body p.text-right', 'Sub-groups shown:').scrollIntoView().should('be.visible');
    cy.contains('.modal-body button', 'Load more sub-groups').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .group-item').should('have.length', numberOfSubGroups);
});

then("The edit modal is open and has a default state for {string}, {string}, {string}, {string}, {string}", (state, name, displayName, description, parent) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.get('.modal-body input').should('have.length', 3);
    cy.contains('.modal-body', 'Name').should('be.visible');
    cy.contains('.modal-body', 'Display name').should('be.visible');
    cy.contains('.modal-body', 'Description').should('be.visible');
    cy.contains('.modal-body', 'Parent group').should('be.visible');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Save').should('not.be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
    cy.get('.modal-body input').eq(2).should('have.attr', 'readonly', 'readonly');
    cy.get('.modal-body .form-group input').eq(0).should('have.value', name);
    cy.get('.modal-body .form-group input').eq(1).should('have.value', displayName);
    cy.get('.modal-body .form-group input').eq(2).should('have.value', parent);
    cy.get('.modal-body .form-group textarea').should('have.value', description);
    cy.get('.modal-body button .glyphicon-pencil').should('be.visible');
    cy.get('.modal-body button .glyphicon-remove').should('not.exist');
});

then("The parent group edition field should contain {string}", (parentDisplayName) => {
    cy.get('.modal-body .form-group input').eq(2).should('have.value', parentDisplayName);
});

then("The parent group dropdown is not shown", (parentDisplayName) => {
    cy.get('.modal-body .dropdown-menu').should('not.exist');
});
