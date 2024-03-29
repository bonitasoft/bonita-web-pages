describe('page-platform-maintenance', () => {
  describe('user isn\'t logged as technical user', () => {
    beforeEach(() => {
      cy.server();

      cy.route('GET', 'build/dist/API/system/maintenance*', 'fixture:maintenanceModeDisabled').as('maintenanceModeDisabled');
      cy.route('GET', 'build/dist/API/system/session/unusedId', 'fixture:noTechnicalUser').as('noTechnicalUser');

      cy.visit('build/dist/resources/index.html');
    });

    it('should display a blank page', () => {
      cy.wait(['@maintenanceModeDisabled', '@noTechnicalUser']);
      cy.get('pb-title > .text-left').should('not.exist');

    });
  });


  describe('user is logged as technical user', () => {
    beforeEach(() => {
      cy.setCookie('BOS_Locale', 'en');
      cy.server();
      cy.route('GET', 'build/dist/API/system/session/unusedId', 'fixture:technicalUser').as('technicalUser');

      cy.visit('build/dist/resources/index.html');
    });

    it('should display a button to pause tenant when tenant is running', () => {
      cy.route('GET', 'build/dist/API/system/maintenance*', 'fixture:maintenanceModeDisabled').as('maintenanceModeDisabled');
      cy.wait(['@maintenanceModeDisabled', '@technicalUser']);


      cy.get('.ng-binding').should('have.text','PAUSE');
      cy.get('.img-responsive').should('have.attr','src','assets/img/running.jpg');
    });

    it('should display a button to resume tenant when tenant is paused', () => {
      cy.route('GET', 'build/dist/API/system/maintenance*', 'fixture:maintenanceModeEnabled').as('maintenanceModeEnabled');
      cy.wait(['@maintenanceModeEnabled', '@technicalUser']);

      cy.get('.ng-binding').should('have.text','RESUME');
      cy.get('.img-responsive').should('have.attr','src','assets/img/paused.jpg');
    });
  });
});