const url = 'build/dist/resources/index.html';

given("A list of open cases is available", ()=> {
    cy.server();
    cy.fixture('json/openCases.json').as('openCases');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes',
        response: '@openCases',
    }).as('openCasesRoute');
});

given("A list of archived cases is available", ()=>{
    cy.server();
    cy.fixture('json/archivedCases.json').as('archivedCases');
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4',
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
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=processDefinitionId=4713701278409746992',
        response: '@filteredByProcessName',
    }).as('filteredByProcessNameRoute');
});

given("The filter responses sort by are defined", ()=>{
    cy.fixture('json/openCasesSortedByProcessNameAsc.json').as("openCasesSortedByProcessNameAsc");
    cy.fixture('json/openCasesSortedByProcessNameDesc.json').as("openCasesSortedByProcessNameDesc");
    cy.fixture('json/openCasesSortedByStartDateNew.json').as("openCasesSortedByStartDateNew");
    cy.fixture('json/openCases.json').as("openCases");
    let filterQueryURLPrefix = 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=started_by=4';
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=name+ASC',
        response: '@openCasesSortedByProcessNameAsc',
    }).as('openCasesSortedByProcessNameAscRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=name+DESC',
        response: '@openCasesSortedByProcessNameDesc',
    }).as('openCasesSortedByProcessNameDescRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=startDate+ASC',
        response: '@openCasesSortedByStartDateNew',
    }).as('openCasesSortedByStartDateNewRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=startDate+DESC',
        response: '@openCases',
    }).as('openCasesSortedByStartDateOldRoute');
});

given("No cases for {string} are available response is defined", (filterType)=>{
    cy.fixture('json/emptyResult.json').as("emptyResult");
    let filterQueryURLPrefix = 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes';
    switch(filterType) {
        case "process name":
            cy.route({
                method: 'GET',
                url: filterQueryURLPrefix + '&f=processDefinitionId=5900913395173494779',
                response: '@emptyResult',
            }).as('emptyResultRoute');
            break;
        case "search":
            cy.route({
                method: 'GET',
                url: filterQueryURLPrefix + '&s=Incorrect',
                response: '@emptyResult',
            }).as('emptyResultRoute');
            break;
    }

});

given("The filter response only started by me is defined", ()=>{
    cy.fixture('json/filteredStartedByMe.json').as("filteredStartedByMe");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=started_by=4',
        response: '@filteredStartedByMe',
    }).as('filteredStartedByMeRoute');
});

given("The filter responses search are defined", ()=>{
    cy.fixture('json/openCasesSearchPool3.json').as("openCasesSearchPool3");
    cy.fixture('json/openCasesSearchKey.json').as("openCasesSearchKey");
    let filterQueryURLPrefix = 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=started_by=4';
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&s=Pool3',
        response: '@openCasesSearchPool3',
    }).as('openCasesSearchPool3Route');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&s=Long%20Search%20Value%205',
        response: '@openCasesSearchKey',
    }).as('openCasesSearchKeyRoute');
});

given("A list of open cases with several pages is available", ()=>{
    cy.server();
    function getOpenCasesQuery(casesPerPage, pageIndex) {
        return 'build/dist/API/bpm/case?c=' + casesPerPage + '&p=' + pageIndex +'&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes';
    }

    cy.fixture('json/openCasesPage0.json').as("openCasesPage0");
    cy.fixture('json/openCases.json').as("openCasesPage1");
    cy.fixture('json/emptyResult.json').as("emptyResult");
    cy.route({
        method: 'GET',
        url: getOpenCasesQuery(20, 0),
        response: '@openCasesPage0',
    }).as('openCasesPage0Route');

    cy.route({
        method: 'GET',
        url: getOpenCasesQuery(10, 2),
        response:  '@openCasesPage1',
    }).as('openCasesPage1Route');

    cy.route({
        method: 'GET',
        url: getOpenCasesQuery(10, 3),
        response:  '@emptyResult',
    }).as('emptyResultRoute');
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
        case "sort by":
            selectFilterSortByOption(filterValue);
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
            break;
        case 'Cancel Vacation Request':
            cy.get('select:visible').eq(0).select('2');
            break;
    }
}

function selectFilterSortByOption(filterValue) {
    switch(filterValue) {
        case 'Start date - newest first':
            cy.get("select:visible").eq(1).select('0');
            break;
        case 'Start date - oldest first':
            cy.get('select:visible').eq(1).select('1');
            break;
        case 'Process name (Asc)':
            cy.get('select:visible').eq(1).select('2');
            break;
        case 'Process name (Desc)':
            cy.get('select:visible').eq(1).select('3');
            break;
    }
}

when('I click on filter only started by me', () => {
    cy.get('pb-checkbox input:visible').click({ multiple: true });
});

when("I filter only started by me", ()=>{
    cy.get(".checkbox:visible input").click();
});

when("I search {string} in search filter", (searchValue)=>{
    cy.get("pb-input input:visible").type(searchValue);
});

when("I click on Load more cases button", ()=>{
    cy.get(".btn-link:visible").contains("Load more cases").click();
    cy.wait(200);
});

then("A list of open cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 5);
});

then("A list of archived cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 1);
});

then("The {string} cases have the correct information", (caseType)=>{
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
                cy.get(".case-property-value").contains("Helen Kelly");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("2");
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

            cy.get(".case-item:visible").eq(1).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/13/19 10:07 AM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("2");
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

            cy.get(".case-item:visible").eq(2).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("22001");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/14/19 10:07 AM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("2");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("12001");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/15/19 10:07 AM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
                cy.get(".case-property-label").contains("Tasks");
                cy.get(".case-property-value").contains("2");
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

            cy.get(".case-item:visible").eq(4).within(() => {
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("8008");
                cy.get(".case-property-label").contains("Process display name (Version)");
                cy.get(".case-property-value").contains("Pool3(1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("9/17/19 3:42 PM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Walter Bates");
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
            cy.wait("@filteredByProcessNameRoute");
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("2001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("22001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                cy.get(".case-property-value").contains("12001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });
            break;

        case 'started by me':
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("22001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("12001");
                cy.get(".case-property-value").contains("Another My Pool(1.0)");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                cy.get(".case-property-value").contains("8008");
                cy.get(".case-property-value").contains("Pool3");
            });
            break;
    }
});

then("I don't see the cases that are unmatched by the {string} filter", (filterType)=>{
    switch (filterType) {
        case 'process name':
            cy.get(".case-item:visible").should("have.length", 4);
            break;
    }
});

then("No cases are available", ()=>{
    cy.get(".case-item:visible").should("have.length", 0);
    cy.contains("No cases to display").should("be.visible");
});

then('I erase the search filter', ()=> {
    cy.get("pb-input input:visible").clear();
});

then("A list of {string} open cases is displayed", (numberOfCases)=>{
    cy.get(".case-item:visible").should("have.length", numberOfCases);
});

then("I see more cases added to the list", ()=>{
    cy.get(".case-item:visible").should("have.length", 25);
});

then("The Load more cases button is disabled", ()=>{
    cy.get(".btn-link:visible").contains("Load more cases").should("be.disabled");
});