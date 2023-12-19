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

given('The URL target to the application {string} with icon', () => {
    cy.server();
    cy.fixture('json/app1WithIcon.json').as('app1WithIcon');
    cy.fixture('json/pageList.json').as('pageList');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application/*',
        response: '@app1WithIcon',
    }).as('app1Route');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application-menu/**',
        response: '@pageList'
    });
});

given('A user is connected without sso', () => {
    cy.fixture('json/session.json').as('session');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@session'
    });
});

given('A technical user is connected without sso', () => {
    cy.fixture('json/sessionTechnicalUser.json').as('session');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@session'
    });
});

given('A user is connected with sso', () => {
    cy.fixture('json/sessionWithSSO.json').as('sessionWithSSO');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@sessionWithSSO'
    });
});

given('A user is connected as guest', () => {
    cy.fixture('json/sessionAsGuest.json').as('sessionAsGuest');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@sessionAsGuest'
    });
});

given('A user is connected as guest with sso', () => {
    cy.fixture('json/sessionAsGuestWithSSO.json').as('sessionAsGuestWithSSO');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/system/session/*',
        response: '@sessionAsGuestWithSSO'
    });
});

given('The user has a first and last name defined', () => {
    cy.fixture('json/userFull.json').as('userFull');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/identity/user/*',
        response: '@userFull'
    }).as('userRoute');
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
    cy.fixture('json/appsList5.json').as('appsList');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4',
        response: '@appsList'
    });
});

given('35 applications are available for the user', () => {
    cy.fixture('json/appsList20.json').as('appsList20');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4',
        response: '@appsList20'
    });
    cy.fixture('json/appsList10.json').as('appsList10');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=2&f=userId=4',
        response: '@appsList10'
    });
    cy.fixture('json/appsList5.json').as('appsList5');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=3&f=userId=4',
        response: '@appsList5'
    });
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=4&f=userId=4',
        response: '@emptyResult'
    });
});

given('30 applications are available for the user', () => {
    cy.fixture('json/appsList20.json').as('appsList20');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4',
        response: '@appsList20'
    });
    cy.fixture('json/appsList10.json').as('appsList10');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=2&f=userId=4',
        response: '@appsList10'
    });
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=3&f=userId=4',
        response: '@emptyResult'
    });
    cy.fixture('json/appsList20.json').as('appsList20');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=Bonita',
        response: '@appsList20'
    });
    cy.fixture('json/appsList10.json').as('appsList10');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=2&f=userId=4&s=Bonita',
        response: '@appsList10'
    });
});

given('20 applications are available for the user', () => {
    cy.fixture('json/appsList20.json').as('appsList20');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4',
        response: '@appsList20'
    });
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=10&p=2&f=userId=4',
        response: '@emptyResult'
    });
});

given('The filter responses are defined', () => {
    cy.fixture('json/filteredAppsListMyFirst.json').as('filteredAppsListMyFirst');
    cy.fixture('json/filteredAppsListSpecialCharactor.json').as('filteredAppsListSpecialCharactor');
    cy.fixture('json/filteredAppsList105.json').as('filteredAppsList105');
    cy.fixture('json/filteredAppsListapp1.json').as('filteredAppsListapp1');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=My first',
        response: '@filteredAppsListMyFirst'
    }).as('filteredAppsListMyFirstRoute');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=app1',
        response: '@filteredAppsListapp1'
    }).as('filteredAppsListapp1Route');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=1.0.5',
        response: '@filteredAppsList105'
    }).as('filteredAppsList105Route');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=&Special',
        response: '@filteredAppsListSpecialCharactor'
    }).as('filteredAppsListSpecialCharactorRoute');
});

given('Incorrect name filter response is defined', () => {
    cy.fixture('json/emptyResult.json').as('emptyResult');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/living/application?c=20&p=0&f=userId=4&s=Incorrect name',
        response: '@emptyResult'
    }).as('emptyResultRoute');
});

given('I have the application home page token defined', () => {
    cy.fixture('json/homePage.json').as('homePage');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application-page/107',
        response: '@homePage'
    }).as('homePageRoute');
});

given('Multiple applications are available for the user, some without access rights', () => {
    cy.fixture('json/appsListWithUnauthorizedApp.json').as('appsListWithUnauthorizedApp');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/living/application?c=20&p=0&f=userId=4',
        response: '@appsListWithUnauthorizedApp'
    }).as('appsListWithUnauthorizedAppRoute');
});

given('The current language in BOS_Locale is {string}', (language) => {
    cy.setCookie('BOS_Locale', language);
});

when('I visit the index page', () => {
    cy.visit(url);
    cy.wait('@app1Route');
});

when('I visit the index page with a parameter {string} in the URL', (localeParamName) => {
    cy.visit(url + '?' + localeParamName + '=es');
    cy.wait('@app1Route');
});

when('I click the user name', () => {
    cy.get('.user-menu-name button').click();
});

when ('I click the user name in dropdown', () => {
    cy.get('.visible-xs > li > a').eq(0).click();
});

when('I select {string} in language picker', (languageSelected) => {
    switch (languageSelected) {
        case 'English':
            cy.get('.form-control').select('0');
            break;
        case 'Français':
            cy.get('.form-control').select('1');
            break;
        case 'Español':
            cy.get('.form-control').select('2');
            break;
        case '日本語':
            cy.get('.form-control').select('3');
            break;
    }
});

when('I press the button {string}', (buttonText) => {
    cy.get('button').contains(buttonText).click();
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
    cy.get('.application-title a').eq(0).trigger('mouseover');
});

when('I click next to the current session modal', () => {
    cy.get('.modal.fade').click('right');
});

then( 'The application displayName is {string}', (appName) => {
    cy.get('pb-link > .text-left > .ng-binding').should('have.text', appName);
});

when('I click on the appName', () => {
    cy.get('.navbar-brand').click();
});

when("I click on Load more applications button", () => {
    cy.get('button').contains('Load more applications').click();
});

when("I wait for user API call", () => {
    checkUserRouteUntilItSucceeds();
});

function checkUserRouteUntilItSucceeds() {
    cy.wait('@userRoute').then((interception) => {
        if (interception.status !== 200) {
            checkUserRouteUntilItSucceeds();
        }
    });
}

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

then('The login link is displayed', () => {
    cy.get('.text-right > .ng-binding').should('have.text', 'Sign in');
});

then('The login link does not exist', () => {
    cy.contains('.user-menu-name', 'Sign in').should('not.exist');
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

then('The application icon has the correct source', () => {
    cy.get('.resized-image img').should('have.attr', 'src', '../API/applicationIcon/1?t=1618565660762');
});

then('The default application icon has the correct source', () => {
    cy.get('img.img-responsive.ng-scope').should('have.attr','src', '../theme/images/logo.png');
});

then('The image is not displayed', () => {
    cy.get('img.img-responsive.ng-scope').should('not.be.visible');
});

then('The current session modal is visible', () => {
    cy.get('.modal').should('be.visible');
    cy.waitFor('.modal', 10000);
});

then('The user first and last name {string} are visible', (firstAndLastName) => {
    cy.get('pb-title > h3').eq(0).should('have.text', firstAndLastName)
});

then('The user name {string} is shown', (userName) => {
    cy.get('.user-details--break-all p').eq(0).should('have.text', userName);
});

then('The user email {string} is shown', (userEmail) => {
    cy.get('.user-details--break-all p').eq(1).should('have.text', userEmail);
});

then('The technical user email is hidden', () => {
    cy.contains('.user-details--break-all p', 'Email').should('not.be.visible');
});

then('The language select is visible', () => {
    cy.get('.form-control').should('be.visible');
});

then('The logout button is visible', () => {
    cy.get('.btn-danger').eq(0).should('have.text', 'Sign out');
});

then('The logout button has the correct url', () => {
    cy.get('.btn-danger').eq(0).should('have.attr', 'href').and('contains', 'logoutservice?locale=en&redirect=true');
});

then('The apply and close buttons are visible', () => {
    cy.get('button').contains('Apply').should('be.visible');
    cy.get('button').contains('Close').should('be.visible');
});

then('The logout button is hidden', () => {
    cy.get('.btn-danger').should('not.be.visible');
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

then('The parameter {string} is not in the URL', (parameterName) => {
    cy.url().should('not.include', parameterName + '=');
});

then('The parameter {string} is in the URL', (parameterName) => {
    cy.url().should('include', parameterName + '=');
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
    cy.get('.navbar-nav').should('be.visible');
});

then('I don\'t see the dropdown', () => {
    cy.get('.navbar-nav').should('not.be.visible');
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

then('The login link is displayed in the dropdown menu', () => {
    cy.get('.visible-xs > li > a').eq(0).should('have.text', 'Sign in');
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

then('I see my apps', () => {
    cy.get('.application-container').eq(0).within(() => {
        cy.get('.icon-container img').should('be.visible').should('have.attr', 'src', '../API/applicationIcon/15');
        cy.contains('.application-title a', 'My first app').should('have.attr', 'href', '/bonita/apps/app1/');
        cy.contains('1.0.5').should('be.visible');
    });
    cy.get('.application-container').eq(1).within(() => {
        cy.get('.icon-container img').should('be.visible').should('have.attr', 'src', '../theme/images/logo.png');
        cy.contains('.application-title span', 'My second app');
        cy.contains('.application-title a', 'My second app').should('have.attr', 'href', '/bonita/apps/app2/');
        cy.contains('1.0').should('be.visible');
    });
    cy.contains('h4', 'No applications to display').should('not.exist');
});

then ('I see only the filtered applications by {string} in desktop', (type)=> {
    var appNameSelectorForDestop = '.application-title a';
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
    cy.get('.application-title span').eq(0).should('have.attr','title', appHover);
});

then('I see the filter dropdown', () => {
    cy.get('pb-select .form-control').should('be.visible');
});

then('I see only my user apps', () => {
    cy.get('.application-title a').eq(0).should('be.visible').should('have.text', 'My first app');
    cy.get('.application-title a').eq(1).should('be.visible').should('have.text', 'My second app');
    cy.get('.application-title a').eq(2).should('not.exist');
});

then('I see only my administrator apps', () => {
    cy.get('.application-title a').eq(0).should('be.visible').should('have.text', 'My app administrator');
    cy.get('.application-title a').eq(1).should('be.visible').should('have.text', 'My first app administrator');
    cy.get('.application-title a').eq(2).should('not.exist');
});

then('I don\'t see any apps', () => {
    cy.get('.application-title a').should('have.length', 0);
});

then('The no app is available text is {string}', (noAppMessage) => {
    cy.get('h4.text-center').should('have.text', noAppMessage);
});

then('The current application has the class {string}', (currentAppClass) => {
    cy.contains('.application-container', 'Current application').within(() => {
        cy.get('.application-card').should('have.class', currentAppClass);
    });
});

then('The other applications don\'t have the class {string}', (currentAppClass) => {
    cy.get('.application-card').not("." + currentAppClass).should('have.length', 4);
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

then('Application name has {string} as application href in mobile view', (homePageHref) => {
    cy.url().should('include', homePageHref);
});

then('I don\'t see the apps without access rights', () => {
    cy.get('.application-title p').contains('App without access rights').should('not.exist');
});

then('The current language is {string}', (language) => {
    switch (language) {
        case 'English':
            cy.get('select').should('have.value','0');
            break;
        case 'Français':
            cy.get('select').should('have.value','1');
            break;
        case 'Español':
            cy.get('select').should('have.value','2');
            break;
        case '日本語':
            cy.get('select').should('have.value','3');
            break;
    }
});

then('Page reloads', () => {
    //necessary when the page reloads to avoid modale opening failure
    cy.reload();
});

then("A list of {int} items is displayed", (nbrOfItems) => {
    cy.get('.application-container').should('have.length', nbrOfItems);
});

then("The load more applications button is disabled", () => {
    cy.get('button').contains('Load more applications').should('be.disabled');
});