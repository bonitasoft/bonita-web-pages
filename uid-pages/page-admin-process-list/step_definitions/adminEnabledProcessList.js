const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=deployedBy&f=activationState=ENABLED';
const processListUrl = 'API/bpm/process?';
const defaultRequestUrl = urlPrefix + processListUrl + 'c=20&p=0' + defaultFilters;
const defaultSortOrder = '&o=displayName+ASC';

given("The filter response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'enabledProcesses5Route', 'enabledProcesses5');
            break;
        case 'sort by':
            createRoute('&o=name+ASC', 'sortByNameAscRoute');
            createRoute('&o=name+DESC', 'sortByNameDescRoute');
            createRoute('&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createRoute('&o=version+ASC', 'sortByVersionAscRoute');
            createRoute('&o=version+DESC', 'sortByVersionDescRoute');
            createRoute('&o=deploymentDate+ASC', 'sortByDeployedOnAscRoute');
            createRoute('&o=deploymentDate+DESC', 'sortByDeployedOnDescRoute');
            createRoute('&o=last_update_date+ASC', 'sortByLastUpdateDateAscRoute');
            createRoute('&o=last_update_date+DESC', 'sortByLastUpdateDateDescRoute');
            break;
        case 'search':
            createRoute(defaultSortOrder + '&s=Pool3', 'searchByNameRoute');
            createRoute(defaultSortOrder + '&s=New', 'searchByDisplayNameRoute');
            createRoute(defaultSortOrder + '&s=1.0', 'searchByVersionRoute');
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder,'&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'enable load more':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder,'', 'enabledProcesses20Route', 'enabledProcesses20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'enabledProcesses10Route', 'enabledProcesses10', 2, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'enabledProcesses5Route', 'enabledProcesses5', 3, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'enable 20 load more':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'enabledProcesses20Route', 'enabledProcesses20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createRoute(queryParameter, routeName) {
        cy.route({
            method: 'GET',
            url: defaultRequestUrl + queryParameter,
        }).as(routeName);
    }

    function createRouteWithResponse(url, queryParameter, routeName, response) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: 'GET',
            url: url + queryParameter,
            response: responseValue
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + processListUrl + 'c=' + count + '&p=' + page + defaultFilters;
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

when("I visit admin process list page", () => {
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
            case 'Name (Asc)':
                cy.get('select').eq(0).select('0');
                break;
            case 'Name (Desc)':
                cy.get('select').eq(0).select('1');
                break;
            case 'Display name (Asc)':
                cy.get('select').eq(0).select('2');
                break;
            case 'Display name (Desc)':
                cy.get('select').eq(0).select('3');
                break;
            case 'Version (Asc)':
                cy.get('select').eq(0).select('4');
                break;
            case 'Version (Desc)':
                cy.get('select').eq(0).select('5');
                break;
            case 'Installed on (Newest first)':
                cy.get('select').eq(0).select('6');
                break;
            case 'Installed on (Oldest first)':
                cy.get('select').eq(0).select('7');
                break;
            case 'Updated on (Newest first)':
                cy.get('select').eq(0).select('8');
                break;
            case 'Updated on (Oldest first)':
                cy.get('select').eq(0).select('9');
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

when("I click on load more processes button", () => {
    cy.get('button').contains('Load more processes').click();
});

then("The enabled process list have the correct information", () => {
    cy.get('.process-item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved')
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('VacationRequest');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('New vacation request with means of transportation');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('2.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/16/20 3:31 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/19/20 10:29 AM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Helen Kelly');
    });
    cy.get('.process-item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Pool');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('12/30/19 2:49 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/24/20 5:17 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: William Jobs');
    });
    cy.get('.process-item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool2');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Pool2');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/18/20 3:31 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/18/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Walter Bates');
    });
    cy.get('.process-item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool3');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Pool3');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/13/20 3:31 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/26/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Walter Bates');
    });
    cy.get('.process-item').eq(4).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool4');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Pool4');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/15/20 3:31 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/15/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Anthony Nichols');
    });

});

then("The enabled process list have the correct item shown number", () => {
    cy.get('.text-primary.item-label:visible').contains('Processes shown: 5');
});

then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.get('.process-item:visible').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Name (Asc)':
            cy.wait('@sortByNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortByNameDescRoute');
            break;
        case 'Display name (Asc)':
            cy.wait('@enabledProcesses5Route');
            break;
        case 'Display name (Desc)':
            cy.wait('@sortByDisplayNameDescRoute');
            break;
        case 'Version (Asc)':
            cy.wait('@sortByVersionAscRoute');
            break;
        case 'Version (Desc)':
            cy.wait('@sortByVersionDescRoute');
            break;
        case 'Installed on (Newest first)':
            cy.wait('@sortByDeployedOnDescRoute');
            break;
        case 'Installed on (Oldest first)':
            cy.wait('@sortByDeployedOnAscRoute');
            break;
        case 'Updated on (Newest first)':
            cy.wait('@sortByLastUpdateDateDescRoute');
            break;
        case 'Updated on (Oldest first)':
            cy.wait('@sortByLastUpdateDateAscRoute');
            break;
        case 'Pool3':
            cy.wait('@searchByNameRoute');
            break;
        case 'New':
            cy.wait('@searchByDisplayNameRoute');
            break;
        case '1.0':
            cy.wait('@searchByVersionRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("No enabled processes are available", () => {
    cy.get('.process-item:visible').should('have.length', 0);
    cy.contains('No processes to display').should('be.visible');
});

then("The load more processes button is disabled", () => {
    cy.get('button').contains('Load more processes').should('be.disabled');
});