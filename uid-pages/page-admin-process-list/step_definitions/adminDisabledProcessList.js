const urlPrefix = 'build/dist/';
const url = urlPrefix + 'resources/index.html';
const defaultFilters = '&d=deployedBy&f=activationState=DISABLED';
const processListUrl = 'API/bpm/process';
const defaultRequestUrl = urlPrefix + processListUrl + '?c=20&p=0&time=0' + defaultFilters;
const defaultSortOrder = '&o=displayName+ASC';

given("The page response {string} is defined for disabled processes", (filterType) => {
    cy.server();
    switch (filterType) {
        case 'default filter':
            createRouteWithResponse(defaultRequestUrl + defaultSortOrder, '', 'disabledProcesses5Route', 'disabledProcesses5');
            break;
        case 'state':
            createRouteWithResponse(defaultRequestUrl,'&f=configurationState=RESOLVED' + defaultSortOrder, 'resolvedProcessesRoute', 'resolvedProcesses');
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
                cy.wait('@resolvedProcessesRoute');
                break;
            default:
                throw new Error("Unsupported case");
        }
    }
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

then("The api call is made for {string} processes", (filterValue) => {
    switch (filterValue) {
        case 'Resolved only':
            cy.wait('@disabledProcesses5Route');
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