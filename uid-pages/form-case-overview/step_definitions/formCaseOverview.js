import { Given as given, Then as then, When as when } from "@badeball/cypress-cucumber-preprocessor";

const buildDir = Cypress.env('BUILD_DIR');
const archivedCaseUrl = `${buildDir}/resources/index.html?id=30003`;
const openCaseUrl = `${buildDir}/resources/index.html?id=30004`;
const caseUrlWithoutId = `${buildDir}/resources/index.html`;
const caseUrlWithEmptyId = `${buildDir}/resources/index.html?id=`;
const trimSpaces = (element) => element.text().trim();

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
})


given('The archived case {string} server response is defined', (archivedCaseId) => {
    // Mock the openCase request to return 404 so the page falls back to archivedCase
    cy.intercept('GET', `${buildDir}/API/bpm/case/${archivedCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        statusCode: 404,
        body: {}
    }).as('openCaseNotFoundRoute');
    cy.intercept('GET', `${buildDir}/API/bpm/archivedCase?c=1&d=started_by&d=startedBySubstitute&d=processDefinitionId&f=sourceObjectId%3D${archivedCaseId}&p=0`, {
        fixture: 'json/archivedCase.json'
    }).as('archivedCaseRoute');
});

given('The archived case {string} empty context server response is defined', (archivedCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/archivedCase/${archivedCaseId}/context`, {
        fixture: 'json/archivedCaseEmptyContext.json'
    }).as('archivedCaseEmptyContextRoute');
});

given('The archived case {string} empty document server response is defined', (archivedCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/archivedCaseDocument?f=caseId=${archivedCaseId}`, {
        fixture: 'json/archivedCaseEmptyDocument.json'
    }).as('archivedCaseEmptyDocumentRoute');
});

given('The open case {string} server response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCase.json'
    }).as('openCaseRoute');
});


given('The open case {string} empty context server response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}/context`, {
        fixture: 'json/openCaseEmptyContext.json'
    }).as('openCaseEmptyContextRoute');
});

given('The open case {string} empty document server response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/caseDocument?f=caseId=${openCaseId}`, {
        fixture: 'json/openCaseEmptyDocument.json'
    }).as('openCaseEmptyDocumentRoute');
});

given('The open case {string} context server response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}/context`, {
        fixture: 'json/openCaseContext.json'
    }).as('openCaseContextRoute');
});

given('The open case business data is defined', () => {
    cy.intercept('GET', `${buildDir}/API/bdm/businessData/com.company.model.VacationRequest/1`, {
        fixture: 'json/businessData.json'
    }).as('businessDataRoute');
});

given('The open case {string} started by system response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCaseStartedBySystem.json'
    }).as('openCaseStartedBySystemRoute');
});

given('The open case {string} started by system for user response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCaseStartedBySystemForUser.json'
    }).as('openCaseStartedBySystemForUserRoute');
});

given('The open case {string} started by system for user without first name response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCaseStartedBySystemForUserWithoutFirstName.json'
    }).as('openCaseStartedBySystemForUserWithoutFirstNameRoute');
});

given('The open case {string} started by system for user without last name response is defined', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCaseStartedBySystemForUserWithoutLastName.json'
    }).as('openCaseStartedBySystemForUserWithoutLastNameRoute');
});

given('The open case {string} started by user for another user', (openCaseId) => {
    cy.intercept('GET', `${buildDir}/API/bpm/case/${openCaseId}?d=started_by&d=startedBySubstitute&d=processDefinitionId`, {
        fixture: 'json/openCaseStartedByUserForUser.json'
    }).as('openCaseStartedByUserForUserRoute');
});

given('A list of executed tasks server response is defined', () => {
    cy.intercept('GET', `${buildDir}/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/openTask.json'
    }).as('openTaskRoute');
    cy.intercept('GET', `${buildDir}/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/archivedTaskExecutedByUser.json'
    }).as('archivedTaskExecutedByUserRoute');
});

given('A list of executed tasks by system for user server response is defined', () => {
    cy.intercept('GET', `${buildDir}/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/openTask.json'
    }).as('openTaskRoute');
    cy.intercept('GET', `${buildDir}/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/archivedTaskExecutedBySystemForUser.json'
    }).as('archivedTaskExecutedBySystemForUserRoute');
});

given('A list of executed tasks by user for user server response is defined', () => {
    cy.intercept('GET', `${buildDir}/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/openTask.json'
    }).as('openTaskRoute');
    cy.intercept('GET', `${buildDir}/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*`, {
        fixture: 'json/archivedTaskExecutedByUserForUser.json'
    }).as('archivedTaskExecutedByUserForUserRoute');
});

when('I visit the archived case index page', () => {
    cy.visit(archivedCaseUrl);
});

when('I visit the open case index page', () => {
    cy.visit(openCaseUrl);
});

when('I visit the open case index page without an id', () => {
    cy.visit(caseUrlWithoutId);
});

when('I visit the open case index page with an empty id', () => {
    cy.visit(caseUrlWithEmptyId);
});

then('I can see both IDs have correct values', () => {
    cy.wait('@archivedCaseEmptyContextRoute');
    cy.get('pb-title').contains('Case id').contains('10002');
    cy.get('pb-title').contains('Archived case id').contains('30003');
});

then('I can see the open case ID', () => {
    cy.wait('@openCaseEmptyContextRoute');
    cy.get('pb-title').contains('Case id').contains('30004');
});

then('I cannot see the archived case ID', () => {
    cy.get('pb-title').contains('Archived case id').should('not.exist');
});

then('The correct BDM headers are visible', () => {
    cy.get('th').should('have.length', '2');
    cy.get('th').contains('requesterBonitaBPMId').should('be.visible');
    cy.get('th').contains('name_string').should('be.visible');
});

then('The incorrect BDM headers don\'t exist', () => {
    cy.get('th').contains('persistenceId').should('not.exist');
    cy.get('th').contains('persistenceId_string').should('not.exist');
    cy.get('th').contains('persistenceVersion').should('not.exist');
    cy.get('th').contains('persistenceVersion_string').should('not.exist');
    cy.get('th').contains('requesterBonitaBPMId_string').should('not.exist');
    cy.get('th').contains('links_string').should('not.exist');
    cy.get('th').contains('links').should('not.exist');
});

then('I see case {string}', (started) => {
    // remove white spaces before checking that the strings are equal
    cy.get('.timeline-footer small.text-muted').eq(1).should($el => expect(trimSpaces($el)).to.equal(started));
});

then('I see task {string}', (executed) => {
    // remove white spaces before checking that the strings are equal
    cy.get('li > div.timeline-panel small.text-muted').eq(1).should($el => expect(trimSpaces($el)).to.equal(executed));
});

then('I see that {string}', (displayedInformation) => {
    cy.get('.alert.alert-info').should($el => expect(trimSpaces($el)).to.equal(displayedInformation));
});
