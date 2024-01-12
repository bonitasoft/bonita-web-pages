Feature: Install resource modal in desktop resolution

  Scenario: The install modal is displayed and closed
    When I visit the index page
    And I click on install button in the page
    Then The modal "Install" button is disabled
    When I click on close button in the modal
    Then The modal is closed

  Scenario: The installation resources is working correctly
    Given The filter response "file upload" is defined
    And The filter response "resource installation" is defined
    When I visit the index page
    And I click on install button in the page
    Then The modal "Install" button is disabled
    When I click on attach icon
    Then It uploads a resource
    When I click on install button in modal
    Then The resource is installed