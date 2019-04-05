const url = 'build/dist/resources/index.html';

given('The resolution is set to mobile', () => {
    cy.viewport(767, 1000);
});

given('I have the {string} application selected', () => {
    cy.server();
    cy.fixture('json/app1.json').as('app1');
    cy.fixture('json/pageList.json').as('pageList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application/*',
        response: '@app1',
    });
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application-menu/**',
        response: '@pageList'
    });
});

given('A user is connected without sso', () => {
    cy.fixture('json/unusedIdNoSSO.json').as('unusedIdNoSSO');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@unusedIdNoSSO'
    });
});

given('A user is connected with sso', () => {
    cy.fixture('json/unusedIdSSO.json').as('unusedIdSSO');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@unusedIdSSO'
    });
});

given('A logo is available in the theme', () => {
    cy.route({
        method: 'GET',
        url: '/build/dist/theme/images/logo.png',
        response: 'logo content'
    });
});

given('The user has a first and last name defined', () => {
    cy.fixture('json/userFull.json').as('userFull');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/identity/user/*',
        response: '@userFull'
    });
});

given('The user has a default icon', () => {
    cy.fixture('json/userDefaultImage.json').as('userDefaultImage');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/identity/user/*',
        response: '@userDefaultImage'
    });
});

given('The user has a first, a last name, but no image defined', () => {
    cy.fixture('json/userNoImage.json').as('userNoImage');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/identity/user/*',
        response: '@userNoImage'
    });
});

given('The user doesn\'t have a {string} info available', (unavailableInfo) => {
    switch (unavailableInfo) {
        case 'firstname' :
            cy.fixture('json/userNoFirstname.json').as('userNoFirstname');
            cy.route({
                method: 'GET',
                url: '/build/dist/API/identity/user/*',
                response: '@userNoFirstname'
            }).as('userNoFirstnameRoute');
            break;
        case 'lastname' :
            cy.fixture('json/userNoLastname.json').as('userNoLastname');
            cy.route({
                method: 'GET',
                url: '/build/dist/API/identity/user/*',
                response: '@userNoLastname'
            }).as('userNoLastnameRoute');
            break;
    }
});

given('I have languages available', () => {
    cy.fixture('json/i18locale.json').as('i18locale');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/i18nlocale*',
        response: '@i18locale'
    });
});

given('Multiple applications are available for the user', () => {
    cy.fixture('json/appsList.json').as('appsList');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=',
        response: '@appsList'
    });
});

given('The filter responses is defined', () => {
    cy.fixture('json/filteredAppsList.json').as('filteredAppsList');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=My first',
        response: '@filteredAppsList'
    });
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=app1',
        response: '@filteredAppsList'
    });
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=1.0.5',
        response: '@filteredAppsList'
    });
});

when('I visit the index page', () => {
    cy.visit(url);
});

when('I click the user name', () => {
    cy.get('.text-right > .ng-binding').click();
});

when ('I click the user name in dropdown', () => {
    cy.get('.shownOnlyInMobile > li > a').eq(0).click();
});

when('I select {string} in language picker', (languageSelected) => {
    cy.get('.form-control').select(languageSelected);
});

when('I press the save button', () => {
    cy.get('button').contains('Save').click();
});

when('I click the burger', () => {
    cy.get('.navbar-toggle').click();
});

when('I should not see the first line', () => {
    cy.get('div.notShownInMobile').should('not.be.visible');
});

when('I click the app selection icon', () => {
    cy.get('.ng-binding > .glyphicon').click();
});

when('I click the app selection icon in dropdown', () => {
    cy.get('a > .glyphicon').click();
});

when('I filter the app selection by {string}', (filter) => {
    cy.get('.form-control').type(filter);
});

when('I erase the input field', () => {
    cy.get('.form-control').clear();
});

when('I click the close button', () => {
    cy.get('button').contains('Close').click();
});

when('I hover over the appName', () => {
    cy.get('pb-link p').eq(0).trigger('mouseover');
});

then( 'The application displayName is {string}', (appName) => {
    cy.get('pb-link > .text-left > .ng-binding').should('have.text', appName);
});

then('The {string} page displayName is {string}', (pageNumber, pageName) => {
    switch (pageNumber) {
        case 'first' :
            cy.get('li.ng-scope > .ng-scope').eq(0).should('have.text', pageName);
            break;
        case 'second' :
            cy.get('li.ng-scope > .ng-scope').eq(1).should('have.text', pageName);
            break;
    }
});

then('I see {string} as the user name', (userName) => {
    cy.get('.text-right > .ng-binding').should('have.text', userName);
});

then('I see {string} as the user menu icon', (userIcon) => {
    cy.get('.user-menu .image-circle img').should('have.attr', 'src', userIcon);
});

then('I see {string} as the user modal icon', (userIcon) => {
    cy.get('.modal-content .image-circle--large img').should('have.attr', 'src', userIcon);
});

then('I don\'t see {string} as the user name', (userName) => {
    cy.get('.text-right > .ng-binding').should('not.have.text', userName);
});

then('I see the app selection icon', () => {
    cy.get('.ng-binding > .glyphicon').should('have.attr', 'class', 'glyphicon glyphicon-th');
});

then('The image has the correct source', () => {
    cy.get('img.img-responsive.ng-scope').should('have.attr','src', '../theme/images/logo.png');
});

then('The image is not displayed', () => {
    cy.get('img.img-responsive.ng-scope').should('not.be.visible');
});

then('The current session modal is visible', () => {
    cy.get('.modal').should('be.visible');
});

then('The user first and last name {string} are visible', (firstAndLastName) => {
    cy.get('pb-title > h3').eq(0).should('have.text', firstAndLastName)
});

then('The user name {string} is shown', (userName) => {
    cy.get('pb-text p').eq(0).should('have.text', userName);
});

then('The user email {string} is shown', (userEmail) => {
    cy.get('pb-text p').eq(1).should('have.text', userEmail)
});

then('The language select is visible', () => {
    cy.get('.form-control').should('be.visible');
});

then('The logout button is visible', () => {
    cy.get('button').contains('Logout').should('be.visible');
});

then('The save and cancel buttons are visible', () => {
    cy.get('button').contains('Save').should('be.visible');
    cy.get('button').contains('Cancel').should('be.visible');
});

then('The logout button is hidden', () => {
    cy.get('button').contains('Logout').should('not.be.visible');
});

then('The save button is disabled', () => {
    cy.get('button').contains('Save').should('be.disabled');
});

then('The save button is enabled', () => {
    cy.get('button').contains('Save').should('not.be.disabled');
});

then('The language in BOS_Locale is {string}', (languageSelected) => {
    cy.getCookie('BOS_Locale').should('have.property', 'value', 'fr')
});

then('The burger shows correctly', () => {
    cy.get('.navbar-toggle > span').should((navbarToggleSpans) => {
        expect(navbarToggleSpans).to.have.length(3);
        for(var spanIndex = 0; spanIndex < navbarToggleSpans.length; spanIndex++) {
            expect(navbarToggleSpans.eq(spanIndex)).to.have.class('icon-bar');
        }
    });
});

then('I see the dropdown that opened', () => {
    cy.get('.navbar-responsive-collapse').should('be.visible');
});

then('I don\'t see the dropdown', () => {
    cy.get('.navbar-responsive-collapse').should('not.be.visible');
});

then('I see the page name dropdown', () => {
    cy.get('li.ng-scope > .ng-scope').should('be.visible');
});

then('The {string} page displayName in dropdown is {string}', (pageNumber, pageName) => {
    switch (pageNumber) {
        case 'first' :
            cy.get('.maxTitleWidth').eq(0).should('have.text', pageName);
            break;
        case 'second' :
            cy.get('.maxTitleWidth').eq(1).should('have.text', pageName);
            break;
    }
});

then('The application displayName is {string} and is shown in the navbar', (appName) => {
    cy.get('.navbar-brand').should('have.text', appName);
});

then('I see {string} as the user name in the dropdown menu', (userName) => {
    cy.get('.shownOnlyInMobile > li > a').eq(0).should('have.text', userName);
});

then('I don\'t see {string} as the user name in the dropdown menu', (userName) => {
    cy.get('.shownOnlyInMobile > li > a').eq(0).should('not.have.text', userName);
});

then('I see the app selection icon in the dropdown menu', () => {
    cy.get('a > .glyphicon').should('have.attr', 'class', 'glyphicon glyphicon-th');
});

then('The app selection modal is visible', () => {
    cy.get('.modal-content').should('be.visible');
});

then('I see my apps', () => {
    cy.get('pb-link p').eq(0).should('have.text', 'My first app');
    cy.get('pb-link p').eq(1).should('have.text', 'My second app');
});

then('I see only the filtered applications', () => {
    cy.get('pb-link p').eq(0).should('be.visible').should('have.text', 'My first app');
    cy.get('pb-link p').eq(1).should('not.be.visible');
});

then('The app selection modal is not visible', () => {
    cy.get('.modal-content').should('not.be.visible');
});

then('The app description should be correct', () => {
    cy.get('pb-link p').eq(0).should('have.attr','title', 'My first app description');
});