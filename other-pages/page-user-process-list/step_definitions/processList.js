import { Given as given, Then as then, When as when } from '@badeball/cypress-cucumber-preprocessor';

const buildDir = Cypress.env('BUILD_DIR') || 'build';
const pageUrl = `${buildDir}/index.html`;

const sessionUrl = '**/API/system/session/unusedId';
const processesUrl = '**/API/bpm/process?**';
const formMappingUrl = '**/API/form/mapping?**';
const instantiationUrl = '**/API/bpm/process/*/instantiation';

function setupSessionIntercept() {
    cy.intercept('GET', sessionUrl, {
        body: { user_id: '4', user_name: 'walter.bates' },
    }).as('sessionRoute');
}

function setupProcessesIntercept(fixture = 'json/processesPage0.json', total = 3) {
    cy.intercept('GET', processesUrl, (req) => {
        const url = new URL(req.url, 'http://localhost');
        const p = parseInt(url.searchParams.get('p') || '0', 10);
        const c = parseInt(url.searchParams.get('c') || '10', 10);
        // Bonita's Content-Range is "<page>-<size>/<total>", not byte offsets.
        req.reply({
            fixture,
            headers: { 'Content-Range': `${p}-${c}/${total}` },
        });
    }).as('processesRoute');
}

function setupCategoriesIntercept(allFixture = 'json/categoriesEmpty.json', byProcessFixture = 'json/categoriesByProcessEmpty.json') {
    // The unfiltered "all categories" call (single c=… param without f=)
    cy.intercept('GET', '**/API/bpm/category?p=0&c=*', (req) => {
        if (req.url.includes('f=id=')) {
            req.reply({ fixture: byProcessFixture });
        } else {
            req.reply({ fixture: allFixture });
        }
    }).as('categoriesRoute');
}

function setupEmptyProcessesIntercept() {
    cy.intercept('GET', processesUrl, {
        body: [],
        headers: { 'Content-Range': '0-10/0' },
    }).as('processesRoute');
}

// Two-page setup (15 total): page 0 returns 10 rows, page 1 returns 5 rows.
// Used by pagination.feature.
function setupPaginatedProcessesIntercept(total = 15) {
    cy.intercept('GET', processesUrl, (req) => {
        const url = new URL(req.url, 'http://localhost');
        const p = parseInt(url.searchParams.get('p') || '0', 10);
        const c = parseInt(url.searchParams.get('c') || '10', 10);
        const fixture = p === 0 ? 'json/processesPage0Of2.json' : 'json/processesPage1Of2.json';
        req.reply({
            fixture,
            headers: { 'Content-Range': `${p}-${c}/${total}` },
        });
    }).as('processesRoute');
}

function setupFormMappingIntercept(target = 'INTERNAL') {
    const fixture = target === 'NONE' ? 'json/formMappingNone.json' : 'json/formMappingInternal.json';
    cy.intercept('GET', formMappingUrl, { fixture }).as('formMappingRoute');
}

function setupInstantiationIntercept({ status = 200, body = { caseId: '42' } } = {}) {
    cy.intercept('POST', instantiationUrl, { statusCode: status, body }).as('instantiationRoute');
}

beforeEach(() => {
    cy.setCookie('BOS_Locale', 'en');
});

// --- Given ---

given('the process list page is loaded with the test fixtures', () => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept();
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('the process list page is loaded with two categories available', () => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept('json/categoriesPopulated.json', 'json/categoriesByProcessPopulated.json');
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
    cy.wait('@categoriesRoute');
});

given('the process list page is loaded with no processes', () => {
    setupSessionIntercept();
    setupEmptyProcessesIntercept();
    setupCategoriesIntercept();
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('the process list page is loaded with 15 processes spread across 2 pages', () => {
    setupSessionIntercept();
    setupPaginatedProcessesIntercept(15);
    setupCategoriesIntercept();
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('the process list page is loaded with a process having a form', () => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept();
    setupFormMappingIntercept('INTERNAL');
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('the process list page is loaded with a process that has no form', () => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept();
    setupFormMappingIntercept('NONE');
    setupInstantiationIntercept();
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('the process list page is loaded and the instantiation API will fail', () => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept();
    setupFormMappingIntercept('NONE');
    setupInstantiationIntercept({ status: 500, body: '' });
    cy.visit(pageUrl);
    cy.wait('@processesRoute');
});

given('I visit the page with deep-link params for {string} {string}', (processName, processVersion) => {
    setupSessionIntercept();
    setupProcessesIntercept();
    setupCategoriesIntercept();
    setupFormMappingIntercept('INTERNAL');
    cy.visit(`${pageUrl}?processName=${encodeURIComponent(processName)}&processVersion=${encodeURIComponent(processVersion)}`);
    cy.wait('@processesRoute');
});

// --- When ---

when('I open the category dropdown', () => {
    cy.get('#Filters-category').click();
});

when('I select the {string} category', (categoryName) => {
    cy.get('#Filters-category').click();
    cy.contains('.dropdown-menu [role="menuitem"]', categoryName).click();
});

when('I type {string} in the search field', (text) => {
    cy.get('input#searchInput').clear().type(text);
});

when('I submit the search form', () => {
    cy.get('button[aria-label="Submit search"]').click();
});

when('I clear the search field', () => {
    cy.get('button[aria-label="Clear search"]').click();
});

when('I click the Name column header', () => {
    cy.get('table thead th.List-name button').click();
});

when('I click the row for {string}', (displayName) => {
    cy.contains('.List-process', displayName).click();
});

when('I click Start in the confirm modal', () => {
    cy.get('[role="dialog"]').within(() => {
        cy.contains('button', 'Start').click();
    });
});

when('I click Cancel in the confirm modal', () => {
    cy.get('[role="dialog"]').within(() => {
        cy.contains('button', 'Cancel').click();
    });
});

when('I click the next-page pager button', () => {
    cy.get('button[aria-label="Next page"]').click();
});

when('I click the previous-page pager button', () => {
    cy.get('button[aria-label="Previous page"]').click();
});

when('I click the last-page pager button', () => {
    cy.get('button[aria-label="Last page"]').click();
});

when('I press Enter on the row for {string}', (displayName) => {
    cy.contains('.List-process', displayName).focus().type('{enter}');
});

when('I press the Escape key', () => {
    cy.get('body').type('{esc}');
});

// The Instantiation listener gates the message twice: the origin must match
// (`event.origin === window.location.origin`) AND the source must be the form
// iframe's own contentWindow (`event.source === iframeEl.contentWindow`). The
// latter is defence-in-depth against any other same-origin frame forging a
// "Start process" success — see Instantiation.svelte.
//
// To satisfy the source gate we must dispatch the message *from inside the
// iframe*, exactly as the real Bonita form does (`window.parent.postMessage`).
// The iframe src resolves to a same-origin path on the Cypress static server,
// so its contentWindow is scriptable: `eval` runs with the iframe window as the
// incumbent global, which makes `event.source` the iframe's contentWindow.
// Posting from `cy.window()` (the page window) sets the wrong source and the
// handler rightly rejects it.
function postFromForm(payload) {
    cy.get('.Instantiation iframe').then(($iframe) => {
        $iframe[0].contentWindow.eval(
            `window.parent.postMessage(${JSON.stringify(payload)}, '*')`,
        );
    });
}

when('the form posts a successful instantiation message', () => {
    postFromForm({ action: 'Start process', message: 'success', dataFromSuccess: { caseId: '42' } });
});

when('the form posts an error instantiation message', () => {
    postFromForm({ action: 'Start process', message: 'error' });
});

// --- Then ---

then('I see {int} processes in the list', (count) => {
    cy.get('table tbody tr.List-process').should('have.length', count);
});

then('the empty state is displayed', () => {
    cy.contains('No process to display').should('be.visible');
});

then('the pagination status shows {string}', (text) => {
    cy.get('.List-pagination-top').should('contain.text', text);
});

then('the {string} category dropdown is visible', (text) => {
    cy.get('#Filters-category').should('contain.text', text);
});

then('the process row {string} is visible', (displayName) => {
    cy.contains('.List-process', displayName).should('be.visible');
});

then('the processes API was called with sort {string}', (sortValue) => {
    cy.get('@processesRoute.all').should((interceptions) => {
        const lastCall = interceptions[interceptions.length - 1];
        const url = new URL(lastCall.request.url, 'http://localhost');
        expect(url.searchParams.get('o')).to.equal(sortValue);
    });
});

then('the processes API was called with search {string}', (search) => {
    cy.get('@processesRoute.all').should((interceptions) => {
        const lastCall = interceptions[interceptions.length - 1];
        const url = new URL(lastCall.request.url, 'http://localhost');
        expect(url.searchParams.get('s')).to.equal(search);
    });
});

then('the processes API was called with page {string}', (page) => {
    cy.get('@processesRoute.all').should((interceptions) => {
        const lastCall = interceptions[interceptions.length - 1];
        const url = new URL(lastCall.request.url, 'http://localhost');
        expect(url.searchParams.get('p')).to.equal(page);
    });
});

then('the processes API was called with category filter {string}', (categoryId) => {
    cy.get('@processesRoute.all').should((interceptions) => {
        const lastCall = interceptions[interceptions.length - 1];
        const fParams = lastCall.request.url.match(/f=([^&]+)/g) || [];
        const decoded = fParams.map((f) => decodeURIComponent(f.replace('f=', '')));
        expect(decoded).to.include(`categoryId=${categoryId}`);
    });
});

then('the processes API was NOT called with a category filter', () => {
    cy.get('@processesRoute.all').should((interceptions) => {
        const lastCall = interceptions[interceptions.length - 1];
        const fParams = lastCall.request.url.match(/f=([^&]+)/g) || [];
        const decoded = fParams.map((f) => decodeURIComponent(f.replace('f=', '')));
        const hasCategoryFilter = decoded.some((f) => f.startsWith('categoryId='));
        expect(hasCategoryFilter).to.equal(false);
    });
});

then('the Name column header shows the {string} sort indicator', (direction) => {
    const cls = direction === 'ascending' ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
    cy.get('table thead th.List-name button .glyphicon').should('have.class', cls);
});

then('the instantiation iframe is visible', () => {
    cy.get('.Instantiation iframe').should('be.visible');
});

then('the iframe src targets process {string} version {string}', (name, version) => {
    cy.get('.Instantiation iframe').should('have.attr', 'src').and('include', encodeURIComponent(name)).and('include', version);
});

then('the confirm modal is visible', () => {
    cy.get('[role="dialog"][aria-modal="true"]').should('be.visible');
});

then('the confirm modal is NOT visible', () => {
    cy.get('[role="dialog"][aria-modal="true"]').should('not.exist');
});

then('a success toast with the case id {string} is displayed', (caseId) => {
    cy.get('.Alert.alert-success').should('contain.text', caseId);
});

then('an error toast for the failed instantiation is displayed', () => {
    cy.get('.Alert.alert-danger').should('contain.text', 'Error while starting the case');
});

then('the process list view is shown again', () => {
    cy.get('table tbody tr.List-process').should('exist');
});

then('the deep-link params are removed from the URL', () => {
    cy.location('search').should('not.include', 'processName').and('not.include', 'processVersion');
});
