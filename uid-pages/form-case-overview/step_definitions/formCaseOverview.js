const archivedCaseUrl = 'build/dist/resources/index.html?id=30003';
const openCaseUrl = 'build/dist/resources/index.html?id=30004';

given('The archived case {string} server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCase.json').as('archivedCase');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=1&d=started_by&d=processDefinitionId&f=sourceObjectId=' + archivedCaseId + '&p=0',
        response: '@archivedCase',
    }).as('archivedCaseRoute');
});

given('The archived case {string} context server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCaseContext.json').as('archivedCaseContext');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase/' + archivedCaseId + '/context',
        response: '@archivedCaseContext',
    }).as('archivedCaseContextRoute');
});

given('The archived case {string} document server response is defined', (archivedCaseId) => {
    cy.server();
    cy.fixture('json/archivedCaseDocument.json').as('archivedCaseDocument');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCaseDocument?f=caseId=' + archivedCaseId,
        response: '@archivedCaseDocument',
    }).as('archivedCaseDocumentRoute');
});

given('The open case {string} server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCase.json').as('openCase');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '?d=started_by&d=processDefinitionId',
        response: '@openCase',
    }).as('openCaseRoute');
});


given('The open case {string} context server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseContext.json').as('openCaseContext');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case/' + openCaseId + '/context',
        response: '@openCaseContext',
    }).as('openCaseContextRoute');
});

given('The open case {string} document server response is defined', (openCaseId) => {
    cy.server();
    cy.fixture('json/openCaseDocument.json').as('openCaseDocument');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/caseDocument?f=caseId=' + openCaseId,
        response: '@openCaseDocument',
    }).as('openCaseDocumentRoute');
});

when('I visit the archived case index page', () => {
    cy.visit(archivedCaseUrl);
});

when('I visit the open case index page', () => {
    cy.visit(openCaseUrl);
});

then('I can see both IDs have correct values', () => {
    cy.wait('@archivedCaseContextRoute');
    cy.get('pb-title').contains('Case id').contains('10002');
    cy.get('pb-title').contains('Archived case id').contains('30003');
});

then('I can see the open case ID', () => {
    cy.wait('@openCaseContextRoute');
    cy.get('pb-title').contains('Case id').contains('30004');
});

then('I cannot see the archived case ID', () => {
    cy.get('pb-title').contains('Archived case id').should('not.be.visible');
});