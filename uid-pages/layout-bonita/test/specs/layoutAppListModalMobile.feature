Feature: The Bonita layout app list modal in mobile resolution

  Scenario: The app selection modal is shown correctly
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the burger
    When I click the app selection icon in dropdown
    Then The app selection modal is visible
    And I see my apps in mobile
    And I don't see the desktop names
