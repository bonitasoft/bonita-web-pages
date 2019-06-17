Feature: The Bonita layout in mobile resolution

  Scenario: The application name should be shown in the menu bar
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    And I have the application home page token defined
    When I visit the index page
    Then The application displayName is "app1" and is shown in the navbar
    When I click on the appName
    Then Application name has "homePageToken" as application href in mobile view

  Scenario: The burger is opened and closed when clicking the icon two times
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    When I visit the index page
    And I click the burger
    Then I see the dropdown that opened
    When I click the burger
    Then I don't see the dropdown

  Scenario: The Bonita layout shows the user name when a lastname isn't available
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    And A user is connected without sso
    And The user doesn't have a "lastname" info available
    When I visit the index page
    And I click the burger
    Then I see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the first and last name and not the user name
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    Then I see "Walter Bates" as the user name in the dropdown menu
    And I don't see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the app selection correctly
    Given The resolution is set to mobile
    And The URL target to the application "appName1"
    When I visit the index page
    And I click the burger
    Then I see the app selection icon in the dropdown menu
