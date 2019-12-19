Feature: Install resource modal in desktop resolution

  Scenario: The update modal is displayed and closed
    Given The filter response "default filter" is defined
    When I visit the index page
    And I click on "pencil" button on the resource "1"
    Then The modal "Update" button is disabled
    When I click on cancel button in the modal
    Then The modal is closed