describe('page-tenant-status', () => {
  describe('user isn\'t logged as technical user', () => {
    beforeEach(() => {
      cy.server();

      cy.route('GET', Cypress.env('DIST_DIR') + '/API/system/tenant/*', 'fixture:tenantRunning').as('tenantRunning');
      cy.route('GET', Cypress.env('DIST_DIR') + '/API/system/session/unusedId', 'fixture:noTechnicalUser').as('noTechnicalUser');

      cy.visit(Cypress.env('DIST_DIR') + '/resources/index.html');
    });

    it('should display a blank page', () => {
      cy.wait(['@tenantRunning', '@noTechnicalUser']);
      cy.get('pb-title > .text-left').should('not.exist');

    });
  });


  describe('user is logged as technical user', () => {
    beforeEach(() => {
      cy.setCookie('BOS_Locale', 'en');
      cy.server();
      cy.route('GET', Cypress.env('DIST_DIR') + '/API/system/session/unusedId', 'fixture:technicalUser').as('technicalUser');

      cy.visit(Cypress.env('DIST_DIR') + '/resources/index.html');
    });

    it('should display a button to pause tenant when tenant is running', () => {
      cy.route('GET', Cypress.env('DIST_DIR') + '/API/system/tenant/*', 'fixture:tenantRunning').as('tenantRunning');
      cy.wait(['@tenantRunning', '@technicalUser']);


      cy.get('.ng-binding').should('have.text','PAUSE');
      cy.get('.img-responsive').should('have.attr','src','assets/img/running.jpg');
    });

    it('should display a button to resume tenant when tenant is paused', () => {
      cy.route('GET', Cypress.env('DIST_DIR') + '/API/system/tenant/*', 'fixture:tenantPaused').as('tenantPaused');
      cy.wait(['@tenantPaused', '@technicalUser']);

      cy.get('.ng-binding').should('have.text','RESUME');
      cy.get('.img-responsive').should('have.attr','src','assets/img/paused.jpg');
    });
  });
});