const archivedCaseUrl = 'build/dist/resources/index.html?id=30003';
const openCaseUrl = 'build/dist/resources/index.html?id=30004';

given('The archived case {string} server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCase.json').as('archivedCase');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=1&d=started_by?d=startedBySubstitute&d=processDefinitionId&f=sourceObjectId=' + archivedCaseId + '&p=0',
        response: '@archivedCase'
    }).as('archivedCaseRoute');
});

given('The archived case {string} empty context server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCaseEmptyContext.json').as('archivedCaseEmptyContext');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase/' + archivedCaseId + '/context',
        response: '@archivedCaseEmptyContext'
    }).as('archivedCaseEmptyContextRoute');
});

given('The archived case {string} empty document server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCaseEmptyDocument.json').as('archivedCaseEmptyDocument');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCaseDocument?f=caseId=' + archivedCaseId,
        response: '@archivedCaseEmptyDocument'
    }).as('archivedCaseEmptyDocumentRoute');
});

given('The open case {string} server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCase.json').as('openCase');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCase'
    }).as('openCaseRoute');
});


given('The open case {string} empty context server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseEmptyContext.json').as('openCaseEmptyContext');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '/context',
        response: '@openCaseEmptyContext'
    }).as('openCaseEmptyContextRoute');
});

given('The open case {string} empty document server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseEmptyDocument.json').as('openCaseEmptyDocument');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/caseDocument?f=caseId=' + openCaseId,
        response: '@openCaseEmptyDocument'
    }).as('openCaseEmptyDocumentRoute');
});

given('The open case {string} context server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseContext.json').as('openCaseContext');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '/context',
        response: '@openCaseContext'
    }).as('openCaseContextRoute');
});

given('The open case business data is defined', () => {
    cy.server();
    cy.fixture('json/businessData.json').as('businessData');
    cy.route({
        method: 'GET',
        url: '/build/dist/API/bdm/businessData/com.company.model.VacationRequest/1',
        response: '@businessData'
    }).as('businessDataRoute');
});

given('The open case {string} started by system response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseStartedBySystem.json').as('openCaseStartedBySystem');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCaseStartedBySystem'
    }).as('openCaseStartedBySystemRoute');
});

given('The open case {string} started by system for user response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseStartedBySystemForUser.json').as('openCaseStartedBySystemForUser');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCaseStartedBySystemForUser'
    }).as('openCaseStartedBySystemForUserRoute');
});

given('The open case {string} started by system for user without first name response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseStartedBySystemForUserWithoutFirstName.json').as('openCaseStartedBySystemForUserWithoutFirstName');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCaseStartedBySystemForUserWithoutFirstName'
    }).as('openCaseStartedBySystemForUserWithoutFirstNameRoute');
});

given('The open case {string} started by system for user without last name response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseStartedBySystemForUserWithoutLastName.json').as('openCaseStartedBySystemForUserWithoutLastName');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCaseStartedBySystemForUserWithoutLastName'
    }).as('openCaseStartedBySystemForUserWithoutLastNameRoute');
});

given('The open case {string} started by user for another user', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseStartedByUserForUser.json').as('openCaseStartedByUserForUser');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by?d=startedBySubstitute&d=processDefinitionId',
        response: '@openCaseStartedByUserForUser'
    }).as('openCaseStartedByUserForUserRoute');
});

given('A list of executed tasks server response is defined', () => {
    cy.fixture('json/openTask.json').as('openTask');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@openTask'
    }).as('openTaskRoute');
    cy.fixture('json/archivedTaskExecutedByUser.json').as('archivedTaskExecutedByUser');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@archivedTaskExecutedByUser'
    }).as('archivedTaskExecutedByUserRoute');
});

given('A list of executed tasks by system for user server response is defined', () => {
    cy.fixture('json/openTask.json').as('openTask');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@openTask'
    }).as('openTaskRoute');
    cy.fixture('json/archivedTaskExecutedBySystemForUser.json').as('archivedTaskExecutedBySystemForUser');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@archivedTaskExecutedBySystemForUser'
    }).as('archivedTaskExecutedBySystemForUserRoute');
});

given('A list of executed tasks by user for user server response is defined', () => {
    cy.fixture('json/openTask.json').as('openTask');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/task?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@openTask'
    }).as('openTaskRoute');
    cy.fixture('json/archivedTaskExecutedByUserForUser.json').as('archivedTaskExecutedByUserForUser');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedHumanTask?p=0&c=999&d=executedBy&d=executedBySubstitute*',
        response: '@archivedTaskExecutedByUserForUser'
    }).as('archivedTaskExecutedByUserForUserRoute');
});

when('I visit the archived case index page', () => {
    cy.visit(archivedCaseUrl);
});

when('I visit the open case index page', () => {
    cy.visit(openCaseUrl);
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
    cy.get('pb-title').contains('Archived case id').should('not.be.visible');
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
    cy.get('.timeline-footer small.text-muted').eq(1).should($el => expect($el.text().trim()).to.equal(started));
});

then('I see task {string}', (executed) => {
    // remove white spaces before checking that the strings are equal
    cy.get('li > div.timeline-panel small.text-muted').eq(1).should($el => expect($el.text().trim()).to.equal(executed));
});
