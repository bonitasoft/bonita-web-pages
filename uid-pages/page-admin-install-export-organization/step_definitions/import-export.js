import { Given as given, Then as then, When as when } from "cypress-cucumber-preprocessor/steps";

const buildDir = Cypress.env('BUILD_DIR');
const url = `${buildDir}/resources/index.html`;

beforeEach(() => {
  // Force locale as we test labels value
  cy.setCookie('BOS_Locale', 'en');
});

given('No file is selected', () => {
    cy.get('.form-control').should('have.attr','placeholder','Click here to choose your .xml file');
});

given('The response for fileUpload is defined', () => {
    cy.intercept('POST', `${buildDir}/API/formFileUpload`, {"filename":"ACME.xml","tempPath":"tmp_632726332956609779.xml","contentType":"text\/xml"});
});

given('The response for install Organisation is defined', () => {
    cy.intercept('POST', `${buildDir}/API/services/organization/import`, {organizationDataUpload: "tmp_8603867932412969442.xml"});
})


when(`I\'m user with {string} bos_local`, (text) => {
    cy.setCookie('BOS_Locale', text);
});

when('I open the install-export organization page', () => {
    cy.server();
    cy.visit(url);
});

when("I click on attach icon", () => {
    cy.get('.form-group .file-upload .input-group-btn').click();
})

when("I click on {string} button", (buttonName) => {
    cy.contains('.btn-primary', buttonName).click();
})


then('I can download the file', () => {
    cy.get('pb-link > .text-right > .ng-binding').should('have.attr', 'href', '../API/exportOrganization');
    cy.get('pb-link > .text-right > .ng-binding').should('have.attr', 'target', '_blank');
});

then('I see the "Incorrect extension" message', () => {
    cy.get('.form-control').should('have.attr','placeholder','Incorrect extension');
});

then('I see {string} label on the install button', (text) => {
    cy.get('pb-button > .text-right > .ng-binding').should('have.text', text);
});

then('I see {string} label on the export button', (text) => {
    cy.get('pb-link > .text-right > .ng-binding').should('have.text', text);
});

then('I see the "Install" button being disabled', () => {
    cy.get('pb-button > .text-right > .ng-binding').should('be.disabled');
});

then("It uploads a organization", () => {
    cy.get('.form-group input[type="file"]').selectFile('test/mockServer/ACME.xml', {force: true});
    cy.get('.form-group input[type="text"]').should('have.value', 'Uploading...');
    cy.get('.form-group .file-upload input[type="text"]').should('have.value', 'ACME.xml');
})

then("The {string} button is enabled", (buttonName) => {
    cy.contains('.btn-primary', buttonName).should('be.enabled');
});

then("The process is installed and I see {string}", (successMessage) => {
    cy.contains('p', successMessage);
});