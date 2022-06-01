Feature: Install resource modal in desktop resolution

  Scenario: The install modal is displayed and closed
    When I visit the index page
    And I click on install button in the page
    Then The modal "Install" button is disabled
    When I click on close button in the modal
    Then The modal is closed