const url = 'build/dist/resources/index.html';

given('The resolution is set to mobile', () => {
    /* 766 instead of 767 because bootstrap issue with hidden-xs
    *  hidden-xs break point is <767 whereas it should be <768 */
    cy.viewport(766, 1000);
});

when('I visit the index page', () => {
    cy.visit(url);
});