const urlPrefix = 'build/dist/';
const profilesUrl = 'API/portal/profile';
const defaultFilters = '&o=name ASC';
const defaultRequestUrl = urlPrefix + profilesUrl + '?c=20&p=0' + defaultFilters;
const refreshUrl = urlPrefix + profilesUrl + '?c=20&p=0' + defaultFilters + '&t=1*';

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
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'profiles8Route', 'profiles8');
            break;
        case 'sort by':
            createRoute(profilesUrl + '?c=20&p=0&o=name+ASC&t=0', 'sortNameAscRoute');
            createRoute(profilesUrl + '?c=20&p=0&o=name+DESC&t=0', 'sortNameDescRoute');
            break;
        case 'search':
            createRouteWithResponse(defaultRequestUrl + '&s=Administrator&t=0', 'searchAdministratorRoute', 'profiles1');
            createRouteWithResponse(defaultRequestUrl + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'profiles load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0','profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'profiles10Route', 'profiles10', 2, 10);
            createProfilesRouteWithResponseAndPagination('', 'profiles8Route', 'profiles8', 3, 10);
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'profiles 20 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'profiles 30 load more':
            createRouteWithResponse(defaultRequestUrl + '&t=0', 'profiles20Route', 'profiles20');
            createProfilesRouteWithResponseAndPagination('', 'profiles10Route', 'profiles10', 2, 10);
            createProfilesRouteWithResponseAndPagination('', 'emptyResultRoute', 'emptyResult', 3, 10);
            break;
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + profilesUrl + '?c=20&p=0&o=name+DESC&t=0', 'sortDisplayNameDescRoute', 'profiles20');
            createRouteWithResponse(urlPrefix + profilesUrl + '?c=10&p=2&o=name+DESC', 'sortDisplayNameDescRoute2', 'profiles10');
            break;
        case 'profile deletion success':
            createRouteWithMethod(profilesUrl + '/101', 'profileDeletionRoute', 'DELETE');
            break;
        case 'refresh list after delete':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'profiles7');
            break;
        case '403 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'unauthorizedDeleteProfileRoute', 'DELETE', '403');
            break;
        case '404 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'notFoundDeleteProfileRoute', 'DELETE', '404');
            break;
        case '500 during deletion':
            createRouteWithMethodAndStatus(profilesUrl + '/101', 'internalErrorDeleteProfileRoute', 'DELETE', '500');
            break;
        case 'profile creation success':
            createRouteWithMethod(profilesUrl, 'profileCreationRoute', 'POST');
            break;
        case 'refresh list after create':
            createRouteWithResponse(refreshUrl, 'refreshUrlRoute', 'profiles9');
            break;
        case '403 during creation':
            createRouteWithMethodAndStatus(profilesUrl, 'unauthorizedCreateProfileRoute', 'POST', '403');
            break;
        case 'already exists during creation':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + profilesUrl, 'alreadyExistsCreateProfileRoute', 'alreadyExistsException', 'POST', '403');
            break;
        case '500 during creation':
            createRouteWithMethodAndStatus(profilesUrl, 'internalErrorCreateProfileRoute', 'POST', '500');
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

    function createRouteWithMethodAndStatus(urlSuffix, routeName, method, status) {
        cy.route({
            method: method,
            url: urlPrefix + urlSuffix,
            response: "",
            status: status
        }).as(routeName);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, 'GET');
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, 200);
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

    function createProfilesRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + profilesUrl + '?c=' + count + '&p=' + page + defaultFilters;
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

when("I visit the admin profiles page", () => {
    cy.visit(urlPrefix + 'resources/index.html');
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
            case 'Name (Asc)':
                cy.get('select').select('0');
                break;
            case 'Name (Desc)':
                cy.get('select').select('1');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input').type(filterValue);
    }
});

when("I erase the search filter", () => {
    cy.get('pb-input input').clear();
});

when("I click on Load more profiles button", () => {
    cy.get('button').contains('Load more profiles').click();
});

when("I click on delete button for first profile", () => {
    cy.get('.glyphicon.glyphicon-trash').eq(0).parent().click();
});

when("I click on add button", () => {
    cy.contains('button', 'Add').click();
});

when("I switch to create a profile", () => {
    cy.get('.modal-body input[type=radio]').eq(1).click();
});

when("I click on the {string} button in modal footer", (buttonName) => {
    cy.contains('.modal-footer button', buttonName).click();
});

when("I fill in the name and description", () => {
    cy.get('.modal-body input[type=text]').eq(0).type('Profile name');
    cy.get('.modal-body input[type=text]').eq(1).type('Profile description');
});

when("I wait for {int}", (time) => {
    cy.wait(time);
});

when("I click inside the modal", () => {
    cy.get('.modal-body').click();
});

then("The profiles page has the correct information", () => {
    cy.contains('h3', 'Profiles');
    cy.get('.profile-item').should('have.length', 8);
    cy.get('.profile-item').eq(0).within(() => {
        cy.contains('.item-label', 'Name');
        cy.contains('.item-value', 'aaa');
        cy.contains('.item-label', 'Created on');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-label', 'Updated on');
        cy.contains('.item-value', '8/18/20 4:45 PM');
        cy.contains('.item-label', 'No description');
        cy.get('.btn.btn-link .glyphicon-option-horizontal').should('have.attr', 'title', 'View profile details');
        cy.get('.btn.btn-link .glyphicon-export').should('have.attr', 'title', 'Export profile');
        cy.get('.btn.btn-link .glyphicon-trash').should('have.attr', 'title', 'Delete profile');
        cy.get('.is-provided-icon').should('not.be.visible');
    });
    cy.get('.profile-item').eq(1).within(() => {
        cy.contains('.item-label', 'Name');
        cy.contains('.item-value', 'Administrator');
        cy.get('.is-provided-icon').should('be.visible');
        cy.get('.btn.btn-link .glyphicon-trash').should('not.be.enabled');
    });
    cy.contains('.item-label', 'Profiles shown: 8');
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.profile-item').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Name (Asc)':
            cy.wait('@sortNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortNameDescRoute');
            break;
        case 'Administrator':
            cy.wait('@searchAdministratorRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No profiles are displayed", () => {
    cy.get('.profiles-item:visible').should('have.length', 0);
    cy.contains('No profiles to display').should('be.visible');
});

then("The load more profiles button is disabled", () => {
    cy.get('button').contains('Load more profiles').should('be.disabled');
});

then("The delete modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'Are you sure you want to delete this profile?');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.contains('.modal-footer button', 'Delete').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("The add modal is open and has a default state for {string}", (state) => {
    cy.contains('.modal-header h3', state).should('be.visible');
    cy.contains('.modal-body p', 'Select how you want to add profiles.');
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
    cy.get('.modal-body input[type=radio]').should('have.length', 2);
    cy.contains('.modal-footer button', 'Add').should('be.enabled');
    cy.contains('.modal-footer button', 'Cancel').should('be.visible');
    cy.contains('.modal-footer button', 'Close').should('not.exist');
});

then("There is no modal displayed", () => {
    cy.get('.modal').should('not.visible');
});

then("The deletion is successful", () => {
    cy.contains('.modal-footer button', 'Delete').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("The creation is successful", () => {
    cy.contains('.modal-footer button', 'Add').should('be.disabled');
    cy.contains('.modal-footer button', 'Cancel').should('not.exist');
    cy.contains('.modal-footer button', 'Close').should('be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("The profiles list is refreshed", () => {
    cy.wait('@refreshUrlRoute');
});

then("A list of {int} profiles is displayed", (nbrOfItems) => {
    cy.get('.profile-item:visible').should('have.length', nbrOfItems);
});

then("I see {string} error message for {string}", (error, action) => {
    switch (error) {
        case 'already exists':
            cy.contains('.modal-body', 'A profile with the same name already exists.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal-body', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        case '404':
            cy.contains('.modal-body', 'The profile does not exist. Reload the page to see the new list of profiles.').should('be.visible');
            break;
        case '500':
            cy.contains('.modal-body', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
    cy.get('.modal').contains('The profile has not been ' + action + '.').should('be.visible');
});

then("The name and description are empty", () => {
    cy.get('.modal-body input[type=text]').eq(0).should('have.value', '');
    cy.get('.modal-body input[type=text]').eq(1).should('have.value', '');
});

then("The success message does not disappear", () => {
    cy.get('.modal-body .glyphicon-ok-sign').should('be.visible');
});

then("There is no error or success", () => {
    cy.get('.modal-body .glyphicon-remove-sign').should('not.be.visible');
    cy.get('.modal-body .glyphicon-ok-sign').should('not.be.visible');
});
