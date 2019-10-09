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

given("A list of processes is available", ()=>{
    cy.fixture('json/processes.json').as('processes');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/process*',
        response: '@processes',
    }).as('processesRoute');
});

given("The filter responses process name are defined", ()=>{
    cy.fixture('json/filteredByProcessName.json').as("filteredByProcessName");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=processDefinitionId=7672776979056865539',
        response: '@filteredByProcessName',
    }).as('filteredByProcessNameRoute');
});

when("I visit the user case list page", ()=>{
    cy.visit(url);
});

when("I click on {string} tab", (casesTab)=>{
    cy.get("tab-heading").contains(casesTab).click();
});

when("I select {string} in {string} filter", (filterValue, filterType)=>{
    switch (filterType) {
        case "process name":
            selectFilterProcessNameOption(filterValue);
            break;
    }
});

function selectFilterProcessNameOption(filterValue){
    switch(filterValue) {
        case 'All processes':
            cy.get("select:visible").eq(0).select('0');
            cy.wait('@openCasesRoute');
            break;
        case 'Another My Pool':
            cy.get('select:visible').eq(0).select('1');
            cy.wait('@filteredByProcessNameRoute');
            break;
    }
}

then("A list of open cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 2);
});

then("A list of archived cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 1);
});

then("The {string} cases have the correct Ids", (caseType)=>{
    switch(caseType){
        case "open":
            cy.get(".case-item:visible").eq(0).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("2001");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/12/19 10:07 AM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("2");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("8008");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Pool3(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("9/25/19 3:42 PM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Daniela Angelo");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("1");
                cy.get(".case-property-label").contains("Long Search Key 1");
                cy.get(".case-property-value").contains("Long Search Value 1");
                cy.get(".case-property-label").contains("Long Search Key 2");
                cy.get(".case-property-value").contains("Long Search Value 2");
                cy.get(".case-property-label").contains("Long Search Key 3");
                cy.get(".case-property-value").contains("Long Search Value 3");
                cy.get(".case-property-label").contains("Long Search Key 4");
                cy.get(".case-property-value").contains("Long Search Value 4");
                cy.get(".case-property-label").contains("Long Search Key 5");
                cy.get(".case-property-value").contains("Long Search Value 5");
            });
            break;

        case "archived":
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-label").contains("Archived Case ID");
                cy.get(".case-property-value").contains("3010");
                cy.get(".case-property-label").contains("Open Case ID");
                cy.get(".case-property-value").contains("1004");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Pool(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/9/19 2:21 PM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
            });
            break;
    }
});

then("I see only the filtered open cases by {string}", (filterType)=>{
    switch (filterType) {
        case 'process name':
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("2001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });
            break;
    }

});

then("I don't see the cases that are unmatched by the {string} filter", (filterType)=>{
    switch (filterType) {
        case 'process name':
            cy.get(".case-item:visible").eq(1).should("not.exist");
            break;
    }
});
