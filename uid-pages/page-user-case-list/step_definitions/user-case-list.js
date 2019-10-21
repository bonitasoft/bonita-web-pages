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

given("The responses filtered by process name are defined for open cases", ()=>{
    cy.fixture('json/openCasesFilteredByProcessName.json').as("openCasesFilteredByProcessName");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=processDefinitionId=4713701278409746992',
        response: '@openCasesFilteredByProcessName',
    }).as('openCasesFilteredByProcessNameRoute');
});

given("The responses filtered by process name are defined for archived cases", ()=>{
    cy.fixture('json/archivedCasesFilteredByProcessName.json').as("archivedCasesFilteredByProcessName");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&f=processDefinitionId=4713701278409746992',
        response: '@archivedCasesFilteredByProcessName',
    }).as('archivedCasesFilteredByProcessNameRoute');
});

given("The filter responses sort by are defined for open cases", ()=>{
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

given("The filter responses sort by are defined for archived cases", ()=>{
    cy.fixture('json/archivedCasesSortedByProcessNameAsc.json').as("archivedCasesSortedByProcessNameAsc");
    cy.fixture('json/archivedCasesSortedByProcessNameDesc.json').as("archivedCasesSortedByProcessNameDesc");
    cy.fixture('json/archivedCasesSortedByStartDateNew.json').as("archivedCasesSortedByStartDateNew");
    cy.fixture('json/archivedCases.json').as("archivedCases");
    let filterQueryURLPrefix = 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&f=started_by=4';
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=name+ASC',
        response: '@archivedCasesSortedByProcessNameAsc',
    }).as('archivedCasesSortedByProcessNameAscRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=name+DESC',
        response: '@archivedCasesSortedByProcessNameDesc',
    }).as('archivedCasesSortedByProcessNameDescRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=startDate+ASC',
        response: '@archivedCasesSortedByStartDateNew',
    }).as('archivedCasesSortedByStartDateNewRoute');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&o=startDate+DESC',
        response: '@archivedCases',
    }).as('archivedCasesSortedByStartDateOldRoute');
});

given("No open cases for {string} are available response is defined", (filterType)=>{
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

given("No archived cases for {string} are available response is defined", (filterType)=>{
    cy.fixture('json/emptyResult.json').as("emptyResult");
    let filterQueryURLPrefix = 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4';
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

given("The filter response only started by me is defined for open cases", ()=>{
    cy.fixture('json/openCasesFilteredStartedByMe.json').as("openCasesFilteredStartedByMe");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/case?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&n=activeFlowNodes&n=failedFlowNodes&f=started_by=4',
        response: '@openCasesFilteredStartedByMe',
    }).as('openCasesFilteredStartedByMeRoute');
});

given("The filter response only started by me is defined for archived cases", ()=>{
    cy.fixture('json/archivedCasesFilteredStartedByMe.json').as("archivedCasesFilteredStartedByMe");
    cy.route({
        method: 'GET',
        url: 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&f=started_by=4',
        response: '@archivedCasesFilteredStartedByMe',
    }).as('archivedCasesFilteredStartedByMeRoute');
});

given("The filter responses search are defined for open cases", ()=>{
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

given("The filter responses search are defined for archived cases", ()=>{
    cy.fixture('json/archivedCasesSearchPool3.json').as("archivedCasesSearchPool3");
    cy.fixture('json/archivedCasesSearchKey.json').as("archivedCasesSearchKey");
    let filterQueryURLPrefix = 'build/dist/API/bpm/archivedCase?c=20&p=0&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4&f=started_by=4';
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&s=Pool3',
        response: '@archivedCasesSearchPool3',
    }).as('archivedCasesSearchPool3Route');
    cy.route({
        method: 'GET',
        url: filterQueryURLPrefix + '&s=Long%20Search%20Value%205',
        response: '@archivedCasesSearchKey',
    }).as('archivedCasesSearchKeyRoute');
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

given("A list of archived cases with several pages is available", ()=>{
    cy.server();
    function getArchivedCasesQuery(casesPerPage, pageIndex) {
        return 'build/dist/API/bpm/archivedCase?c=' + casesPerPage + '&p=' + pageIndex +'&d=processDefinitionId&d=started_by&d=startedBySubstitute&f=user_id=4';
    }

    cy.fixture('json/archivedCasesPage0.json').as("archivedCasesPage0");
    cy.fixture('json/archivedCases.json').as("archivedCasesPage1");
    cy.fixture('json/emptyResult.json').as("emptyResult");
    cy.route({
        method: 'GET',
        url: getArchivedCasesQuery(20, 0),
        response: '@archivedCasesPage0',
    }).as('archivedCasesPage0Route');

    cy.route({
        method: 'GET',
        url: getArchivedCasesQuery(10, 2),
        response:  '@archivedCasesPage1',
    }).as('archivedCasesPage1Route');

    cy.route({
        method: 'GET',
        url: getArchivedCasesQuery(10, 3),
        response:  '@emptyResult',
    }).as('emptyResultRoute');
});

when("I visit the user case list page", ()=>{
    cy.visit(url);
});

when("I click on {string} tab", (casesTab)=>{
    cy.get("tab-heading").contains(casesTab).click();
});

when("I select {string} in {string} filter for {string} cases", (filterValue, filterType, casesType)=>{
    switch (filterType) {
        case "process name":
            selectCasesFilterProcessNameOption(filterValue, casesType === "archived");
            break;
        case "sort by":
            selectFilterSortByOption(filterValue);
            break;
    }
});

function selectCasesFilterProcessNameOption(filterValue, archived){
    switch(filterValue) {
        case 'All processes':
            cy.get("select:visible").eq(0).select('0');
            if(archived) {
                cy.wait('@archivedCasesRoute');
            } else {
                cy.wait('@openCasesRoute');
            }
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
});

when("I click on refresh", ()=>{
    cy.get("button i.glyphicon-repeat:visible").click();
});

then("A list of open cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 5);
});

then("A list of archived cases is displayed", ()=>{
    cy.get(".case-item:visible").should("have.length", 4);
});

then("The {string} cases have the correct information", (caseType)=>{
    switch(caseType){
        case "open":
            cy.get(".case-item:visible").eq(0).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("2001");
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/12/19 10:07 AM");
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

            cy.get(".case-item:visible").eq(1).within(() => {
                // Check that the element exist.
                cy.get(".case-property-label").contains("Case ID");
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
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
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
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
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
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
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Pool3 (1.0)");
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
                cy.get(".case-property-label").contains("Archived Case ID (original)");
                cy.get(".case-property-value").contains("3010 (1004)");
                cy.get(".case-property-label").contains("Process name (Version)");
                cy.get(".case-property-value").contains("Pool (1.0)");
                cy.get(".case-property-label").contains("Start date");
                cy.get(".case-property-value").contains("8/9/19 2:21 PM");
                cy.get(".case-property-label").contains("Started by");
                cy.get(".case-property-value").contains("Helen Kelly");
            });
            break;
    }
});

then("I see only the filtered open cases by {string}", (filterType)=>{
    switch (filterType) {
        case 'process name':
            cy.wait("@openCasesFilteredByProcessNameRoute");
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("2001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("22001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                cy.get(".case-property-value").contains("12001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });
            break;

        case 'started by me':
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("32001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("22001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("12001");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                cy.get(".case-property-value").contains("8008");
                cy.get(".case-property-value").contains("Pool3");
            });
            break;
    }
});

then("I see only the filtered archived cases by {string}", (filterType)=>{
    switch (filterType) {
        case 'process name':
            cy.wait("@archivedCasesFilteredByProcessNameRoute");
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("3010 (1004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("4010 (2004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("5010 (3004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(3).within(() => {
                cy.get(".case-property-value").contains("6010 (4004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });
            break;

        case 'started by me':
            cy.get(".case-item:visible").eq(0).within(() => {
                cy.get(".case-property-value").contains("12001 (3004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(1).within(() => {
                cy.get(".case-property-value").contains("22001 (2004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
            });

            cy.get(".case-item:visible").eq(2).within(() => {
                cy.get(".case-property-value").contains("32001 (1004)");
                cy.get(".case-property-value").contains("Another My Pool (1.0)");
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

then("No open cases are available", ()=>{
    cy.get(".case-item:visible").should("have.length", 0);
    cy.contains("No open cases to display").should("be.visible");
});

then("No archived cases are available", ()=>{
    cy.get(".case-item:visible").should("have.length", 0);
    cy.contains("No archived cases to display").should("be.visible");
});

then('I erase the search filter', ()=> {
    cy.get("pb-input input:visible").clear();
});

then("A list of {string} cases is displayed", (numberOfCases)=>{
    cy.get(".case-item:visible").should("have.length", numberOfCases);
});

then("I see more cases added to the list", ()=>{
    cy.get(".case-item:visible").should("have.length", 25);
});

then("The Load more cases button is disabled", ()=>{
    cy.get(".btn-link:visible").contains("Load more cases").should("be.disabled");
});