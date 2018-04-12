// https://docs.cypress.io/api/introduction/api.html

describe("User table test", () => {
  it("List users in table", () => {
    cy.server();
    cy.fixture('page1').as('page1');
    cy.fixture('page2').as('page2');
    cy.fixture('page3').as('page3');
    cy.route({
      url: '/API/identity/user?p=0&c=10',
      headers: {
        'content-range': '0-10/22'
      },
      response: '@page1'
    });
    cy.route({
      url: '/API/identity/user?p=1&c=10',
      headers: {
        'content-range': '1-10/22'
      },
      response: '@page2'
    });
    cy.route({
      url: '/API/identity/user?p=2&c=10',
      headers: {
        'content-range': '2-10/22'
      },
      response: '@page3'
    });
    cy.visit("/");

    cy.get('table tbody').find('tr').as('rows');
    cy.get('@rows').should('have.length', 10);
    const secondRow = cy.get('@rows').first().next().find('td');
    secondRow.first().contains('giovanna.almeida')
      .next().contains('Almeida')
      .next().contains('Giovanna')
      .next().contains('Account manager');

      //TODO test page switch
  });
});
