const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=deployedBy&f=activationState=DISABLED';
const processListUrl = 'API/bpm/process';
const defaultRequestUrl = urlPrefix + processListUrl + '?c=20&p=0&time=0' + defaultFilters;
const defaultSortOrder = '&o=displayName+ASC';
const processDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/process-details?id=';

given("The page response {string} is defined for disabled processes", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'disabledProcesses5Route', 'disabledProcesses5');
            break;
        case 'state':
            createRouteWithResponse(defaultRequestUrl,'&f=configurationState=RESOLVED' + defaultSortOrder, 'disabledResolvedProcessesRoute', 'disabledResolvedProcesses');
            break;
        case 'sort by':
            createDefaultRoute('&o=name+ASC', 'sortByNameAscRoute');
            createDefaultRoute('&o=name+DESC', 'sortByNameDescRoute');
            createDefaultRoute('&o=displayName+DESC', 'sortByDisplayNameDescRoute');
            createDefaultRoute('&o=version+ASC', 'sortByVersionAscRoute');
            createDefaultRoute('&o=version+DESC', 'sortByVersionDescRoute');
            createDefaultRoute('&o=deploymentDate+ASC', 'sortByDeployedOnAscRoute');
            createDefaultRoute('&o=deploymentDate+DESC', 'sortByDeployedOnDescRoute');
            createDefaultRoute('&o=last_update_date+ASC', 'sortByLastUpdateDateAscRoute');
            createDefaultRoute('&o=last_update_date+DESC', 'sortByLastUpdateDateDescRoute');
            break;
        case 'search':
            createDefaultRoute( defaultSortOrder + '&s=VacationRequest', 'searchByNameRoute');
            createDefaultRoute(defaultSortOrder + '&s=New', 'searchByDisplayNameRoute');
            createDefaultRoute(defaultSortOrder + '&s=1.0', 'searchByVersionRoute');
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'disable load more':
            createRouteWithResponse(defaultRequestUrl, defaultSortOrder, 'disabledProcesses20Route', 'disabledProcesses20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'disabledProcesses10Route', 'disabledProcesses10', 2, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'disabledProcesses5Route', 'disabledProcesses5', 3, 10);
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 4, 10);
            break;
        case 'disable 20 load more':
            createRouteWithResponse(defaultRequestUrl, defaultSortOrder, 'disabledProcesses20Route', 'disabledProcesses20');
            createRouteWithResponseAndPagination(defaultSortOrder, 'emptyResultRoute', 'emptyResult', 2, 10);
            break;
        case 'enable process':
            createRouteWithResponseAndMethod(urlPrefix + processListUrl + '/4623447657350219626', "processEnableRoute", 'emptyResult', "PUT");
            createRoute(urlPrefix + processListUrl + '?c=20&p=0&time=1*' + defaultFilters + defaultSortOrder, "refreshDisabledProcessesListRoute", "GET");
            createRoute(urlPrefix + processListUrl + '?c=20&p=0&time=1*&d=deployedBy&f=activationState=ENABLED' + defaultSortOrder, "refreshEnabledProcessesListRoute", "GET");
            break;
        case 'enable state code 500':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + processListUrl + '/4623447657350219626',"processEnableRoute", 'emptyResult', "PUT", '500');
            break;
        case 'enable state code 403':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + processListUrl + '/4623447657350219626',"processEnableRoute", 'emptyResult', "PUT", '403');
            break;
        case 'delay enable':
            cy.fixture('json/emptyResult.json').as('emptyResult');
            cy.route({
                method: 'PUT',
                url: urlPrefix + processListUrl + '/4623447657350219626',
                response: '@emptyResult',
                delay: 2000
            }).as('delayEnableRoute');
            break;
        case 'refresh disabled process list':
            createRoute(urlPrefix + processListUrl + '?c=20&p=0&time=0' + defaultFilters + defaultSortOrder, "refreshDisabledProcessesList", "GET");
            break;
        default:
            throw new Error("Unsupported case");
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

    function createDefaultRoute(queryParameter, routeName) {
        createRoute(defaultRequestUrl + queryParameter, routeName, "GET");
    }

    function createRoute(url, routeName, method) {
        cy.route({
            method: method,
            url: url
        }).as(routeName);
    }

    function createRouteWithResponseAndPagination(queryParameter, routeName, response, page, count) {
        const loadMoreUrl = urlPrefix + processListUrl + '?c=' + count + '&p=' + page + "&time=0" + defaultFilters + queryParameter;
        createRouteWithResponseAndMethod(loadMoreUrl, routeName, response, "GET");
    }

    function createRouteWithResponseAndMethod(url, routeName, response, method) {
        createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, '200');
    }

    function createRouteWithResponseAndMethodAndStatus(url, routeName, response, method, status) {
        let responseValue = undefined;
        if (response) {
            cy.fixture('json/' + response + '.json').as(response);
            responseValue = '@' + response;
        }

        cy.route({
            method: method,
            url: url,
            response: responseValue,
            status: status
        }).as(routeName);
    }
});


when("I visit admin process list page", () => {
    cy.visit(url);
    cy.wait(1000);
});

when("I click on Disabled tab", () => {
    cy.get('tab-heading').contains('Disabled').click();
});

when("I put {string} in {string} filter field in disabled processes list", (filterValue, filterType) => {
    switch (filterType) {
        case 'state':
            selectFilterContentTypeOption(filterValue);
            break;
        case 'sort by':
            selectSortByOption(filterValue);
            break;
        case 'search':
            searchForValue(filterValue);
            break;
        default:
            throw new Error("Unsupported case");
    }

    function selectFilterContentTypeOption(filterValue) {
        switch (filterValue) {
            case 'Resolved and unresolved':
                cy.get('select:visible').eq(0).select('0');
                break;
            case 'Resolved only':
                cy.get('select:visible').eq(0).select('1');
                cy.wait('@disabledResolvedProcessesRoute');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Name (Asc)':
                cy.get('select:visible').eq(1).select('0');
                break;
            case 'Name (Desc)':
                cy.get('select:visible').eq(1).select('1');
                break;
            case 'Display name (Asc)':
                cy.get('select:visible').eq(1).select('2');
                break;
            case 'Display name (Desc)':
                cy.get('select:visible').eq(1).select('3');
                break;
            case 'Version (Asc)':
                cy.get('select:visible').eq(1).select('4');
                break;
            case 'Version (Desc)':
                cy.get('select:visible').eq(1).select('5');
                break;
            case 'Installed on (Newest first)':
                cy.get('select:visible').eq(1).select('6');
                break;
            case 'Installed on (Oldest first)':
                cy.get('select:visible').eq(1).select('7');
                break;
            case 'Updated on (Newest first)':
                cy.get('select:visible').eq(1).select('8');
                break;
            case 'Updated on (Oldest first)':
                cy.get('select:visible').eq(1).select('9');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function searchForValue(filterValue) {
        cy.get('pb-input input:visible').type(filterValue);
    }
});

when("I erase the search filter in disabled processes list", () => {
    cy.get('pb-input input:visible').clear();
});

when("I click on enable button in modal", () => {
    cy.get('button').contains('Enable').click();
});

then("The disabled process list have the correct information", () => {
    cy.get('.process-item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-alert').should('have.attr', 'title', 'Unresolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('VacationRequest');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('New vacation request with means of transportation');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('2.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/19/20 4:09 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/20/20 9:30 AM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('a .glyphicon-option-horizontal').parent().should('have.attr', 'href', processDetailsUrl + '4623447657350219626');
        cy.get('.glyphicon-ban-circle').should('not.exist');
        cy.get('.glyphicon-ok').should('have.attr', 'title', 'Enable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Walter Bates');
    });
    cy.get('.process-item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool 1');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Display name for Pool 1');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/20/20 2:09 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/20/20 12:30 PM');
        cy.get('.item-label').contains('Pool 1 process description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('a .glyphicon-option-horizontal').parent().should('have.attr', 'href', processDetailsUrl + '4623447657350219626');
        cy.get('.glyphicon-ban-circle').should('not.exist');
        cy.get('.glyphicon-ok').should('have.attr', 'title', 'Enable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Anthony Nichols');
    });
    cy.get('.process-item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-alert').should('have.attr', 'title', 'Unresolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Pool 2');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Display name for Pool 2');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('3.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('1/20/20 4:09 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('1/25/20 9:30 AM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('not.exist');
        cy.get('.glyphicon-ok').should('have.attr', 'title', 'Enable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Helen Kelly');
    });
    cy.get('.process-item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('New Pool 3');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('New Pool 3 display name');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('2.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/15/20 4:09 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/15/20 9:30 AM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('not.exist');
        cy.get('.glyphicon-ok').should('have.attr', 'title', 'Enable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Walter Bates');
    });
    cy.get('.process-item').eq(4).within(() => {
        // Check that the element exist.
        cy.get('.item-label').contains('State');
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-label').contains('Name');
        cy.get('.item-value').contains('Second Vacation Request');
        cy.get('.item-label').contains('Display name');
        cy.get('.item-value').contains('Second vacation request with means of transportation');
        cy.get('.item-label').contains('Version');
        cy.get('.item-value').contains('2.0');
        cy.get('.item-label').contains('Installed on');
        cy.get('.item-value').contains('2/21/20 4:09 PM');
        cy.get('.item-label').contains('Updated on');
        cy.get('.item-value').contains('2/21/20 9:30 AM');
        cy.get('.item-label').contains('Vacation request process description');
        cy.get('.glyphicon-option-horizontal').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('not.exist');
        cy.get('.glyphicon-ok').should('have.attr', 'title', 'Enable');
        cy.get('.glyphicon-info-sign').should('have.attr', 'title', 'Installed by: Walter Bates');
    });
});

then("The disabled process list have the correct item shown number", () => {
    cy.get('.text-primary.item-label:visible').contains('Processes shown: 5');
});

then("No disabled processes are available", () => {
    cy.get('.process-item:visible').should('have.length', 0);
    cy.get('h4:visible').contains('No processes to display').should('be.visible');
});

then("The api call is made for {string} processes", (filterValue) => {
    switch (filterValue) {
        case 'Resolved only':
            cy.wait('@disabledProcesses5Route');
            break;
        case 'Name (Asc)':
            cy.wait('@sortByNameAscRoute');
            break;
        case 'Name (Desc)':
            cy.wait('@sortByNameDescRoute');
            break;
        case 'Display name (Asc)':
            cy.wait('@disabledProcesses5Route');
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
        case 'VacationRequest':
            cy.wait('@searchByNameRoute');
            break;
        case 'New':
            cy.wait('@searchByDisplayNameRoute');
            break;
        case '1.0':
            cy.wait('@searchByVersionRoute');
            break;
        case 'enable process':
            cy.wait('@processEnableRoute');
            break;
        case 'refresh list':
            cy.wait('@refreshEnabledProcessesListRoute');
            cy.wait('@refreshDisabledProcessesListRoute');
            break;
        case 'refresh disabled process list':
            cy.wait('@refreshDisabledProcessesList');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.get('.process-item:visible').should('have.length', nbrOfItems);
});

then("The correct text is shown in enable modal", () => {
    cy.contains('.modal', 'Enabling this process will make it visible to the users who can start it').should('be.visible');
    cy.contains('.modal', 'Disabling this process will remove it from the list of processes that users can start.').should('not.be.visible');
    cy.contains('.modal', 'This process is already disabled.').should('not.be.visible');
    cy.contains('.modal', 'This process is already enabled.').should('not.be.visible');
    cy.contains('.modal', 'An error has occurred. For more information, check the log file.').should('not.be.visible');
    cy.contains('.modal', 'Access denied. For more information, check the log file.').should('not.be.visible');
    cy.contains('.modal', 'Disabling process...').should('not.be.visible');
    cy.contains('.modal', 'Enabling process...').should('not.be.visible');
});

then("I see enabling message", () => {
    cy.get('.glyphicon-cog.gly-spin').should('be.visible');
    cy.contains('div','Enabling process...').should('be.visible');
});

then("The {string} button is disabled for item {string}", (iconName, processNumber) => {
    cy.get('button .glyphicon-' + iconName).eq(processNumber - 1).click();
});

then("The load more processes button is disabled in disabled processes list", () => {
    cy.get('button:visible').contains('Load more processes').should('be.disabled');
});

then("I see {string} error message for disabled processes", (errorCode) => {
  //  cy.contains('.modal', 'Enabling this process will make it visible to the users who can start it.').should('be.visible');
    cy.contains('.modal', 'The process has not been enabled.').should('be.visible');
    switch (errorCode) {
        case '500':
            cy.contains('.modal', 'An error has occurred. For more information, check the log file.').should('be.visible');
            break;
        case '403':
            cy.contains('.modal', 'Access denied. For more information, check the log file.').should('be.visible');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("The correct text is shown in enable modal", () => {
    cy.contains('.modal', 'Enabling this process will make it visible to the users who can start it').should('be.visible');
    cy.contains('.modal', 'Disabling this process will remove it from the list of processes that users can start.').should('not.be.visible');
    cy.contains('.modal', 'This process is already disabled.').should('not.be.visible');
    cy.contains('.modal', 'This process is already enabled.').should('not.be.visible');
    cy.contains('.modal', 'An error has occurred. For more information, check the log file.').should('not.be.visible');
    cy.contains('.modal', 'Access denied. For more information, check the log file.').should('not.be.visible');
    cy.contains('.modal', 'Disabling process...').should('not.be.visible');
    cy.contains('.modal', 'Enabling process...').should('not.be.visible');
});