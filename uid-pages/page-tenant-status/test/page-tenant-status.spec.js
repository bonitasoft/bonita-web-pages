describe('page-tenant-status', () => {
  beforeEach(() => {
    cy.visit('build/dist/resources/index.html');
  })

  it('was empty', () => {
    cy.get('.text-left').should('not.exist');
  })
})