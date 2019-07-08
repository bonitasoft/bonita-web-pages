const url = 'build/dist/resources/index.html';

given('The resolution is set to mobile', () => {
    /* 766 instead of 767 because bootstrap issue with hidden-xs
    *  hidden-xs break point is <767 whereas it should be <768 */
    cy.viewport(766, 1000);
});

given('The URL target to the application {string}', () => {
    cy.server();
    cy.fixture('json/app1.json').as('app1');
    cy.fixture('json/pageList.json').as('pageList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application/*',
        response: '@app1',
    }).as('app1Route');
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

given('The user has the default icon', () => {
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
        url: '/build/dist/API/living/application?c=9999',
        response: '@appsList'
    });
});

given('The filter responses are defined', () => {
    cy.fixture('json/filteredAppsListMyFirst.json').as('filteredAppsListMyFirst');
    cy.fixture('json/filteredAppsList105.json').as('filteredAppsList105');
    cy.fixture('json/filteredAppsListapp1.json').as('filteredAppsListapp1');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=My first',
        response: '@filteredAppsListMyFirst'
    }).as('filteredAppsListMyFirstRoute');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=app1',
        response: '@filteredAppsListapp1'
    }).as('filteredAppsListapp1Route');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=1.0.5',
        response: '@filteredAppsList105'
    }).as('filteredAppsList105Route');
});

given('Incorrect name filter response is defined', () => {
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=Incorrect name',
        response: '@emptyResult'
    }).as('emptyResultRoute');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=9999&s=Incorrect name&f=profileId=2',
        response: '@emptyResult'
    }).as('emptyResultRoute');
});

given('The profiles list is defined', () => {
    cy.fixture('json/profilesList.json').as('profilesList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/portal/profile?p=0&c=100&f=user_id=4',
        response: '@profilesList'
    }).as('profilesListRoute');
});

given('The filter responses are defined for all profiles', () => {
    cy.fixture('json/filteredAppsListForAllProfiles.json').as('filteredAppsListByAllProfiles');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application?c=9999',
        response: '@filteredAppsListByAllProfiles'
    }).as('filteredAppsListByAllProfilesRoute');
});

given('The filter responses are defined for the user profile', () => {
    cy.fixture('json/filteredAppsListForUserProfile.json').as('filteredAppsListByUserProfile');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application?c=9999&f=profileId=1',
        response: '@filteredAppsListByUserProfile'
    }).as('filteredAppsListByUserProfileRoute');
});

given('The filter responses are defined for the administrator profile', () => {
    cy.fixture('json/filteredAppsListForAdminProfile.json').as('filteredAppsListByAdminProfile');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application?c=9999&f=profileId=2',
        response: '@filteredAppsListByAdminProfile'
    }).as('filteredAppsListByAdminProfileRoute');
});

given('The response for both administrator profile and app name is defined', () => {
    cy.fixture('json/filteredAppsListAdminProfileMyFirst.json').as('filteredAppsListAdminProfileMyFirst');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application?c=9999&s=My first&f=profileId=2',
        response: '@filteredAppsListAdminProfileMyFirst'
    }).as('filteredAppsListAdminProfileMyFirstRoute');
});

given('I have the application home page token defined', () => {
    cy.fixture('json/homePage.json').as('homePage');
    cy.route({
        method: "GET",
        url: 'build/dist/API/living/application-page/107',
        response: '@homePage'
    }).as('homePageRoute');
});

given('Multiple applications are available for the user, some without access rights', () => {
    cy.fixture('json/appsListWithUnauthorizedApp.json').as('appsListWithUnauthorizedApp');
    cy.route({
        method: "GET",
        url: 'build/dist/API/living/application?c=9999',
        response: '@appsListWithUnauthorizedApp'
    }).as('appsListWithUnauthorizedAppRoute');
});

given('Unauthorized applications response is defined', () => {
    cy.fixture('json/filteredAppsListNoAccess.json').as('filteredAppsListNoAccess');
    cy.route({
        method: "GET",
        url: 'build/dist/API/living/application?c=9999&s=noAccess',
        response: '@filteredAppsListNoAccess'
    }).as('filteredAppsListNoAccessRoute');
});

when('I visit the index page', () => {
    cy.visit(url);
});

when('I click the user name', () => {
    cy.get('.text-right > .ng-binding').click();
});

when ('I click the user name in dropdown', () => {
    cy.get('.visible-xs > li > a').eq(0).click();
});

when('I select {string} in language picker', (languageSelected) => {
    cy.get('.form-control').select(languageSelected);
});

when('I press the apply button', () => {
    cy.get('button').contains('Apply').click();
});

when('I click the burger', () => {
    cy.get('.navbar-toggle').click();
});

when('I click the app selection icon', () => {
    cy.get('.ng-binding > .glyphicon').click();
});

when('I click the app selection icon in dropdown', () => {
    cy.get('a > .glyphicon').click();
});

when('I filter the app selection by {string}', (filter) => {
    cy.get('pb-input .form-control').type(filter);
});

when('I erase the input field', () => {
    cy.get('pb-input .form-control').clear();
});

when('I click the close button', () => {
    cy.get('button').contains('Close').click();
});

when('I hover over the appName', () => {
    cy.get('.app-name-in-list a').eq(0).trigger('mouseover');
});

when('I select {string} in dropdown', (profileName) => {
    cy.wait('@profilesListRoute');
    switch(profileName) {
        case 'All profile':
            cy.get('pb-select .form-control').select('0');
            cy.wait('@filteredAppsListByAllProfilesRoute');
            break;
        case 'User':
            cy.get('pb-select .form-control').select('1');
            cy.wait('@filteredAppsListByUserProfileRoute');
            break;
        case 'Administrator':
            cy.get('pb-select .form-control').select('2');
            cy.wait('@filteredAppsListByAdminProfileRoute');
            break;
    }
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
    cy.get('.user-menu.image-circle img').should('have.attr', 'src', userIcon);
});

then('I see {string} as the user modal icon', (userIcon) => {
    cy.get('.modal-content .image-circle--large img').should('have.attr', 'src', userIcon);
});

then('I see default user icon as the user menu icon', () => {
    cy.get('.user-menu i.fa').should('exist');
});

then('I see default user icon as the user modal icon', () => {
    cy.get('.modal-content i.fa').should('exist');
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
    cy.get('.user-details--break-all p').eq(0).should('have.text', userName);
});

then('The user email {string} is shown', (userEmail) => {
    cy.get('.user-details--break-all p').eq(1).should('have.text', userEmail)
});

then('The language select is visible', () => {
    cy.get('.form-control').should('be.visible');
});

then('The logout button is visible', () => {
    cy.get('button').contains('Logout').should('be.visible');
});

then('The apply and close buttons are visible', () => {
    cy.get('button').contains('Apply').should('be.visible');
    cy.get('button').contains('Close').should('be.visible');
});

then('The logout button is hidden', () => {
    cy.get('button').contains('Logout').should('not.exist');
});

then('The apply button is disabled', () => {
    cy.get('button').contains('Apply').should('be.disabled');
});

then('The apply button is enabled', () => {
    cy.get('button').contains('Apply').should('not.be.disabled');
});

then('The language in BOS_Locale is {string}', (languageSelected) => {
    cy.getCookie('BOS_Locale').should('have.property', 'value', languageSelected);
});

then('The current session modal is not visible', () => {
    cy.get('.modal').should('not.exist');
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
    cy.get('.visible-xs > li > a').eq(0).should('have.text', userName);
});

then('I don\'t see {string} as the user name in the dropdown menu', (userName) => {
    cy.get('.visible-xs > li > a').eq(0).should('not.have.text', userName);
});

then('I see the app selection icon in the dropdown menu', () => {
    cy.get('a > .glyphicon').should('have.attr', 'class', 'glyphicon glyphicon-th');
});

then('The app selection modal is visible', () => {
    cy.get('.modal-content').should('be.visible');
});

then('I see my apps in mobile', () => {
    var appNameSelectorForMobile = '.app-name-in-list--multiline a';
    cy.get(appNameSelectorForMobile).eq(0).should('have.text', 'My first app');
    cy.get(appNameSelectorForMobile).eq(1).should('have.text', 'My second app');
    cy.get(appNameSelectorForMobile).eq(2).should('have.text', 'My app administrator');
    cy.get(appNameSelectorForMobile).eq(3).should('have.text', 'My first app administrator');
    cy.get(appNameSelectorForMobile).eq(4).should('have.text', 'Current application');
});

then('I don\'t see the desktop names', () => {
    var appNameSelectorForDestop = '.app-name-in-list a';
    cy.get(appNameSelectorForDestop).eq(0).should('be.hidden');
    cy.get(appNameSelectorForDestop).eq(1).should('be.hidden');
    cy.get(appNameSelectorForDestop).eq(2).should('be.hidden');
    cy.get(appNameSelectorForDestop).eq(3).should('be.hidden');
    cy.get(appNameSelectorForDestop).eq(4).should('be.hidden');
});

then('I see my apps in desktop', () => {
    var appNameSelectorForDestop = '.app-name-in-list a';
    cy.get(appNameSelectorForDestop).eq(0).should('have.text', 'My first app');
    cy.get(appNameSelectorForDestop).eq(1).should('have.text', 'My second app');
    cy.get(appNameSelectorForDestop).eq(2).should('have.text', 'My app administrator');
    cy.get(appNameSelectorForDestop).eq(3).should('have.text', 'My first app administrator');
    cy.get(appNameSelectorForDestop).eq(4).should('have.text', 'Current application');
});

then('I don\'t see the mobile names', () => {
    var appNameSelectorForMobile = '.app-name-in-list--multiline a';
    cy.get(appNameSelectorForMobile).eq(0).should('be.hidden');
    cy.get(appNameSelectorForMobile).eq(1).should('be.hidden');
    cy.get(appNameSelectorForMobile).eq(2).should('be.hidden');
    cy.get(appNameSelectorForMobile).eq(3).should('be.hidden');
    cy.get(appNameSelectorForMobile).eq(4).should('be.hidden');
});

then ('I see only the filtered applications by {string} in desktop', (type)=> {
    var appNameSelectorForDestop = '.app-name-in-list a';
    switch (type) {
        case 'name':
            cy.wait('@filteredAppsListMyFirstRoute');
            cy.get(appNameSelectorForDestop).eq(0).should('be.visible').should('have.text', 'My first app');
            cy.get(appNameSelectorForDestop).eq(1).should('be.visible').should('have.text', 'My first app administrator');
            break;
        case 'token':
            cy.wait('@filteredAppsListapp1Route');
            cy.get(appNameSelectorForDestop).eq(0).should('be.visible').should('have.text', 'My first app');
            cy.get(appNameSelectorForDestop).eq(1).should('not.exist');
            break;
        case 'version':
            cy.wait('@filteredAppsList105Route');
            cy.get(appNameSelectorForDestop).eq(0).should('be.visible').should('have.text', 'My first app');
            cy.get(appNameSelectorForDestop).eq(1).should('not.exist');
            break;
    }
    cy.get(appNameSelectorForDestop).eq(2).should('not.exist');
});

then('The app selection modal is not visible', () => {
    cy.get('.modal-content').should('not.exist');
});

then('The app on-hover text should be {string}', (appHover) => {
    cy.get('.app-name-in-list p').eq(0).should('have.attr','title', appHover);
});

then('I see the filter dropdown', () => {
    cy.get('pb-select .form-control').should('be.visible');
});

then('I see only my user apps', () => {
    cy.get('.app-name-in-list a').eq(0).should('be.visible').should('have.text', 'My first app');
    cy.get('.app-name-in-list a').eq(1).should('be.visible').should('have.text', 'My second app');
    cy.get('.app-name-in-list a').eq(2).should('not.exist');
});

then('I see only my administrator apps', () => {
    cy.get('.app-name-in-list a').eq(0).should('be.visible').should('have.text', 'My app administrator');
    cy.get('.app-name-in-list a').eq(1).should('be.visible').should('have.text', 'My first app administrator');
    cy.get('.app-name-in-list a').eq(2).should('not.exist');
});

then('I see only the app with correct profile and name', () => {
    cy.wait('@filteredAppsListAdminProfileMyFirstRoute');
    cy.get('.app-name-in-list a').eq(0).should('be.visible').should('have.text', 'My first app administrator');
    cy.get('.app-name-in-list a').eq(1).should('not.exist');
});

then('I don\'t see any apps', () => {
    cy.get('.app-name-in-list a').should('have.length', 0);
});

then('The no app is available text is {string}', (noAppMessage) => {
    cy.get('.text-center').should('have.text', noAppMessage);
});

then('The current application has the class {string}', (currentAppClass) => {
    cy.get('.app-item').contains('.app-item', 'Current application').should('have.class', currentAppClass);
});

then('The other applications don\'t have the class {string}', (currentAppClass) => {
    cy.get('.app-item').not(currentAppClass).should('have.length', 4);
});

then('The favicon link should be set to {string}', (faviconURL) => {
    cy.get('link[rel=icon]').should('have.attr', 'href', faviconURL);
});

then('The app title should be set to {string}', (appName) => {
    cy.get('title').contains(appName);
});

then('I can see the application name as {string}', (appTitle) => {
    cy.get('.app-title a').should('have.text', appTitle);
});

then('Application name has {string} as application href', (homePageHref) => {
    cy.get('.app-title a').should('have.attr', 'href', homePageHref);
});

when('I click on the appName', () => {
    cy.get('.navbar-brand').click();
});

then('Application name has {string} as application href in mobile view', (homePageHref) => {
    cy.url().should('include', homePageHref);
});

then('I don\'t see the apps without access rights', () => {
    cy.get('.app-name-in-list p').contains('App without access rights').should('not.exist');
});