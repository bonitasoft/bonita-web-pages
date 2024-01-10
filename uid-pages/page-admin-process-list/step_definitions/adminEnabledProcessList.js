import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";


const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=deployedBy&f=activationState=ENABLED';
const processListUrl = 'API/bpm/process';
const defaultRequestUrl = urlPrefix + processListUrl + '?c=10&p=0&time=0' + defaultFilters;
const defaultSortOrder = '&o=displayName+ASC';
const processDetailsUrl = '/bonita/apps/APP_TOKEN_PLACEHOLDER/admin-process-details?id=';
const disabledProcessRequestUrl = urlPrefix + processListUrl + '?c=10&p=0&time=0&d=deployedBy&f=activationState=DISABLED';
const refreshUrl = urlPrefix + processListUrl + '?c=10&p=0' + defaultFilters + '&time=1*';

given("The page response {string} is defined", (filterType) => {
    cy.server();
    switch (filterType) {
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
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, 'enabledProcesses5Route', 'enabledProcesses5');
            break;
        case "default filter with headers":
            createRouteWithResponseAndHeaders(defaultSortOrder, 'enabledProcesses5Route', 'enabledProcesses5', {'content-range': '0-5/5'});
            break;
        case 'state':
            createRouteWithResponse(defaultRequestUrl + '&f=configurationState=RESOLVED' + defaultSortOrder, 'enabledResolvedProcessesRoute', 'enabledResolvedProcesses');
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
        case 'sort during limitation':
            createRouteWithResponse(urlPrefix + processListUrl + '?c=10&p=0&time=0' + defaultFilters + '&o=displayName+DESC', 'sortByDisplayNameDescRoute', 'enabledProcesses10');
            createRouteWithResponse(urlPrefix + processListUrl + '?c=10&p=1&time=0' + defaultFilters + '&o=displayName+DESC', 'sortByDisplayNameDescRoute2', 'enabledProcesses10');
            break;
        case 'search':
            createDefaultRoute(defaultSortOrder + '&s=Pool3', 'searchByNameRoute');
            createRouteForSpecialCharacter(urlPrefix + processListUrl, '&Special', 'searchByNameWithSpecialCharacterRoute');
            createDefaultRoute(defaultSortOrder + '&s=New', 'searchByDisplayNameRoute');
            createDefaultRoute(defaultSortOrder + '&s=1.0', 'searchByVersionRoute');
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder + '&s=Search term with no match', 'emptyResultRoute', 'emptyResult');
            break;
        case 'disable process':
            createRouteWithResponseAndMethod(urlPrefix + processListUrl + '/7150158626056333703', "processDisableRoute", 'emptyResult', "PUT");
            createRoute(urlPrefix + processListUrl + '?c=10&p=0&time=1*' + defaultFilters + defaultSortOrder, "refreshEnabledProcessesList", "GET");
            createRoute(urlPrefix + processListUrl + '?c=10&p=0&time=1*&d=deployedBy&f=activationState=DISABLED' + defaultSortOrder, "refreshDisabledProcessesList", "GET");
            break;
        case 'file upload':
            cy.intercept('POST', urlPrefix + 'API/processUpload', {"filename":"Pool.bar","tempPath":"tmp_632726332956609779.bar","contentType":"text\/xml"})
            break;
        case 'process installation':
            cy.intercept('POST', urlPrefix + 'API/bpm/process', {"fileupload": "tmp_5586848544544004207.bar"});
            break;
        case 'disable state code 500':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + processListUrl + '/7150158626056333703',"processDisableRoute", 'emptyResult', "PUT", '500');
            createRouteWithResponse(urlPrefix + processListUrl + '?c=10&p=0&time=1*', 'enabledProcesses5Route', 'enabledProcesses5');
            break;
        case 'disable state code 403':
            createRouteWithResponseAndMethodAndStatus(urlPrefix + processListUrl + '/7150158626056333703',"processDisableRoute", 'emptyResult', "PUT", '403');
            createRouteWithResponse(urlPrefix + processListUrl + '?c=10&p=0&time=1*', 'enabledProcesses5Route', 'enabledProcesses5');
            break;
        case 'delay disable':
            cy.fixture('json/emptyResult.json').as('emptyResult');
            cy.route({
                method: 'PUT',
                url: urlPrefix + processListUrl + '/7150158626056333703',
                response: '@emptyResult',
                delay: 2000
            }).as('delayDisableRoute');
            break;
        case 'refresh enabled process list':
            createRoute(urlPrefix + processListUrl + '?c=10&p=0&time=0' + defaultFilters + defaultSortOrder, "refreshEnabledProcessesList", "GET");
            break;
        case 'disabled process api is not called':
            cy.route({
                method: "GET",
                url: disabledProcessRequestUrl + defaultSortOrder,
                onRequest: () => {
                    throw new Error("The disabled process api should have not been called");
                }
            });
            break;
        default:
            throw new Error("Unsupported case");
    }

    function createDefaultRoute(queryParameter, routeName) {
        createRoute(defaultRequestUrl + queryParameter, routeName, "GET");
    }

    function createRouteForSpecialCharacter(pathname, searchParameter, routeName) {
        cy.intercept({
            method: 'GET',
            pathname: '/' + pathname,
            query: {
                'c': '10',
                'p': '0',
                'time': '0',
                'd': 'deployedBy',
                'f': 'activationState=ENABLED',
                'o': 'displayName ASC',
                's': searchParameter
            }
        }).as(routeName);
    }

    function createRoute(url, routeName, method) {
        cy.route({
            method: method,
            url: url
        }).as(routeName);
    }

    function createRouteWithResponse(url, routeName, response) {
        createRouteWithResponseAndMethod(url, routeName, response, "GET");
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

when("I put {string} in {string} filter field", (filterValue, filterType) => {
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
                cy.wait('@enabledResolvedProcessesRoute');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }

    function selectSortByOption(filterValue) {
        switch (filterValue) {
            case 'Display name (Asc)':
                cy.get('select').eq(1).select('0');
                break;
            case 'Display name (Desc)':
                cy.get('select').eq(1).select('1');
                break;
            case 'Name (Asc)':
                cy.get('select').eq(1).select('2');
                break;
            case 'Name (Desc)':
                cy.get('select').eq(1).select('3');
                break;
            case 'Version (Asc)':
                cy.get('select').eq(1).select('4');
                break;
            case 'Version (Desc)':
                cy.get('select').eq(1).select('5');
                break;
            case 'Installed on (Newest first)':
                cy.get('select').eq(1).select('6');
                break;
            case 'Installed on (Oldest first)':
                cy.get('select').eq(1).select('7');
                break;
            case 'Updated on (Newest first)':
                cy.get('select').eq(1).select('8');
                break;
            case 'Updated on (Oldest first)':
                cy.get('select').eq(1).select('9');
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

when("I click on {string} button on the item {string}", (iconName, itemNumber) => {
    cy.get('button .glyphicon-' + iconName).eq(itemNumber - 1).click();
});

when("I click on {string} button in the modal", (btnName) => {
    cy.get('.modal-footer button').contains(btnName).click();
});

when("I click on disable button in modal", () => {
    cy.get('button').contains('Disable').click();
});

when("I click on refresh button", () => {
    cy.get('.glyphicon-repeat:visible').click();
});

when("I click on install button in the page", () => {
    cy.get('button').contains('Install').click();
});

then("The enabled process list have the correct information", () => {
    cy.contains('.item-label-container p', 'State').should('be.visible');
    cy.contains('.item-label-container p', 'Display name').should('be.visible');
    cy.contains('.item-label-container p', 'Name').should('be.visible');
    cy.contains('.item-label-container p', 'Version').should('be.visible');
    cy.contains('.item-label-container p', 'Installed on').should('be.visible');
    cy.contains('.item-label-container p', 'Installed by').should('be.visible');
    cy.contains('.item-label-container p', 'Updated on').should('be.visible');
    cy.contains('.item-label-container p', 'Actions').should('be.visible');
    cy.get('.process-item').eq(0).within(() => {
        // Check that the element exist.
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-value').contains('New vacation request with means of transportation');
        cy.get('.item-value').contains('VacationRequest');
        cy.get('.item-value').contains('2.0');
        cy.get('.item-value').contains('2/16/20 3:31 PM');
        cy.get('.item-value').contains('Helen Kelly');
        cy.get('.item-value').contains('2/19/20 10:29 AM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View process details');
        cy.get('a .glyphicon-eye-open').parent().should('have.attr', 'href', processDetailsUrl + '7150158626056333703');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
    });
    cy.get('.process-item').eq(1).within(() => {
        // Check that the element exist.
        cy.get('.glyphicon-alert').should('have.attr', 'title', 'Unresolved. Click on "View process details" to complete the configuration.');
        cy.get('.item-value').contains('Pool');
        cy.get('.item-value').contains('Pool');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-value').contains('12/30/19 2:49 PM');
        cy.get('.item-value').contains('William Jobs');
        cy.get('.item-value').contains('2/24/20 5:17 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View process details');
        cy.get('a .glyphicon-eye-open').parent().should('have.attr', 'href', processDetailsUrl + '7881320656099632799');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
    });
    cy.get('.process-item').eq(2).within(() => {
        // Check that the element exist.
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-value').contains('Pool2');
        cy.get('.item-value').contains('Pool2');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-value').contains('2/18/20 3:31 PM');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-value').contains('2/18/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
    });
    cy.get('.process-item').eq(3).within(() => {
        // Check that the element exist.
        cy.get('.glyphicon-check').should('have.attr', 'title', 'Resolved');
        cy.get('.item-value').contains('Pool3');
        cy.get('.item-value').contains('Pool3');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-value').contains('2/13/20 3:31 PM');
        cy.get('.item-value').contains('Walter Bates');
        cy.get('.item-value').contains('2/26/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
    });
    cy.get('.process-item').eq(4).within(() => {
        // Check that the element exist.
        cy.get('.glyphicon-alert').should('have.attr', 'title', 'Unresolved. Click on "View process details" to complete the configuration.');
        cy.get('.item-value').contains('Pool4');
        cy.get('.item-value').contains('Pool4');
        cy.get('.item-value').contains('1.0');
        cy.get('.item-value').contains('2/15/20 3:31 PM');
        cy.get('.item-value').contains('Anthony Nichols');
        cy.get('.item-value').contains('2/15/20 3:58 PM');
        cy.get('.item-label').contains('No description');
        cy.get('.glyphicon-eye-open').should('have.attr', 'title', 'View process details');
        cy.get('.glyphicon-ban-circle').should('have.attr', 'title', 'Disable');
    });
    cy.get('.text-primary.item-label:visible').contains('Processes shown: 5 of 5');
});

then("A list of {string} items is displayed", (nbrOfItems) => {
    cy.get('.process-item:visible').should('have.length', nbrOfItems);
});

then("The api call is made for {string}", (filterValue) => {
    switch (filterValue) {
        case 'Resolved only':
            cy.wait('@enabledResolvedProcessesRoute');
            break;
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
        case 'disable process':
            cy.wait('@processDisableRoute');
            break;
        case 'refresh list':
            cy.wait('@refreshEnabledProcessesList');
            break;
        case 'refresh enabled process list':
            cy.wait('@refreshEnabledProcessesList');
            break;
        case '&Special':
            cy.wait('@searchByNameWithSpecialCharacterRoute');
            break;
        default:
            throw new Error("Unsupported case");
    }
});

then("The {string} button is disable", (state) => {
   cy.contains('.modal-footer button', state).should('be.disabled');
});

then("The successfully enabled message is displayed", () => {
   cy.contains('.modal-body p', 'The process has been successfully enabled.').should('be.visible');
});

then("The successfully disabled message is displayed", () => {
   cy.contains('.modal-body p', 'The process has been successfully disabled.').should('be.visible');
});

then("No enabled processes are available", () => {
    cy.get('.process-item:visible').should('have.length', 0);
    cy.contains('No processes to display').should('be.visible');
});

then("The {string} process modal is displayed for {string}", (fieldText, itemName) => {
    cy.get('.modal').contains(fieldText + ' ' + itemName).should('be.visible');
});

then("The modal is closed",() => {
    cy.get('.modal').should('not.exist');
});

then("The correct text is shown in disable modal", () => {
    cy.contains('.modal', 'Disabling this process will remove it from the list of processes that users can start.').should('be.visible');
    cy.contains('.modal', 'Enabling this process will make it visible to the users who can start it').should('not.exist');
    cy.contains('.modal', 'This process is already disabled.').should('not.exist');
    cy.contains('.modal', 'This process is already enabled.').should('not.exist');
    cy.contains('.modal', 'An error has occurred. For more information, check the log file.').should('not.exist');
    cy.contains('.modal', 'Access denied. For more information, check the log file.').should('not.exist');
    cy.contains('.modal', 'Disabling process...').should('not.exist');
    cy.contains('.modal', 'Enabling process...').should('not.exist');
});

then("I see {string} error message", (errorCode) => {
    cy.contains('.modal', 'Disabling this process will remove it from the list of processes that users can start.').should('be.visible');
    cy.contains('.modal', 'The process has not been disabled.').should('be.visible');
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

then("I see disabling message", () => {
    cy.get('.glyphicon-cog.gly-spin').should('be.visible');
    cy.contains('div','Disabling process...').should('be.visible');
});

then("The modal {string} button is disabled",(buttonLabel) => {
    cy.get('.modal-footer button').contains(buttonLabel).should('be.disabled');
});

then("The modal {string} button is enabled",(buttonLabel) => {
    cy.get('.modal-footer button').contains(buttonLabel).should('be.enabled');
});

then("The loading text is displayed", () => {
    cy.get('button').contains('Load more processes').should('not.be.visible');
    cy.contains('Processes shown:').should('not.be.visible');
    cy.get('.text-center').contains('Loading processes...').should('be.visible');
    cy.get('h4').should('not.exist');
});

then("The process is installed", () => {
    cy.contains(".modal-body p", "Process successfully installed")
});


when("I click on attach icon", () => {
    cy.get('.modal-body .file-upload .input-group-btn').click();
});

then("It uploads a process", () => {
    cy.get('.modal-body input[type="file"]').selectFile('test/mockServer/Pool.bar', {force: true});
    cy.get('.modal-body input[type="text"]').should('have.value', 'Uploading...');
    cy.get('.modal-body .file-upload input[type="text"]').should('have.value', 'Pool.bar');
});