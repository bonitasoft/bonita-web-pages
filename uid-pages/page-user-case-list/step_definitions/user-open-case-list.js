const url = 'build/dist/resources/index.html';

given("A list of open cases is available", ()=> {
    cy.server();
    cy.fixture('json/openCases.json').as('openCases');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0*',
        response: '@openCases',
    }).as('openCasesRoute');
});

given("A list of archived cases is available", ()=>{
    cy.server();
    cy.fixture('json/archivedCases.json').as('archivedCases');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=20&p=0*',
        response: '@archivedCases',
    }).as('archivedCasesRoute');
});

given("A user session is available", ()=>{
    cy.fixture('json/session.json').as('session');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/system/session/unusedId',
        response: '@session',
    }).as('sessionRoute');
});

when("I visit the user case list page", ()=>{
    cy.visit(url);
});

when("I click on {string} tab", (casesTab)=>{
    cy.get("tab-heading").contains(casesTab).click();
});

then("A list of open cases is displayed", ()=>{
    //cy.get("a.case-property-value").should("have.length", 5);
    cy.get(".case-item:visible").should("have.length", 5);
    cy.get(".case-item:visible").eq(0).get("a.case-property-value:visible").eq(0).should("have.text", "2001");
    cy.get(".case-item:visible").eq(1).get("a.case-property-value:visible").eq(2).should("have.text", "6001");
    cy.get(".case-item:visible").eq(2).get("a.case-property-value:visible").eq(4).should("have.text", "8007");
    cy.get(".case-item:visible").eq(3).get("a.case-property-value:visible").eq(6).should("have.text", "8008");
    cy.get(".case-item:visible").eq(4).get("a.case-property-value:visible").eq(8).should("have.text", "8011");
    /*cy.get("a.case-property-value");
    cy.get("a.case-property-value");
    cy.get("a.case-property-value");
    cy.get("a.case-property-value");*/
});

then("A list of archived cases is displayed", ()=>{
    //cy.wait(2000);
    cy.get(".case-item:visible").should("have.length", 4);
    cy.get(".case-item:visible").eq(0).get("a.case-property-value:visible").eq(0).should("have.text", "3010");
    cy.get(".case-item:visible").eq(1).get("a.case-property-value:visible").eq(1).should("have.text", "3013");
    cy.get(".case-item:visible").eq(2).get("a.case-property-value:visible").eq(2).should("have.text", "24012");
    cy.get(".case-item:visible").eq(3).get("a.case-property-value:visible").eq(3).should("have.text", "24034");

    /*cy.get("a.case-property-value");
    cy.get("a.case-property-value");
    cy.get("a.case-property-value");
    cy.get("a.case-property-value");*/
});