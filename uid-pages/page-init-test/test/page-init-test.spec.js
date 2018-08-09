describe('page-init-test', () => {
  beforeEach(() => {
    cy.visit('build/dist/resources/index.html');
  })

  it('contains a text who contains \'My page\'', () => {
    cy.contains('.text-left', 'My page');

  })
  it('contains a writable input text ', () => {
    cy.get('.form-control').type('It\'s write with my cypress test runner !! And it\'s work very good');
  })
})