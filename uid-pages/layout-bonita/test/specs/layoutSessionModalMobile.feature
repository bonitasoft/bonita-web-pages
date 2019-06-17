Feature: The Bonita layout current session modal in mobile resolution

  Scenario: The Bonita layout shows the current session modal
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible