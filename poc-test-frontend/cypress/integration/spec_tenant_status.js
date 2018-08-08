// @ts-check
describe('page', () => {
  beforeEach(() => {
    cy.visit('../uid-pages/page-tenant-status/build/dist/resources/index.html')
  })

  it('has h2', () => {
    cy.contains('h2', 'test')
  })
})
