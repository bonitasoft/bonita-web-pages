Feature: The Bonita layout

  Scenario: The Bonita layout is running
    Given I have the "appName1" application selected
    When I visit the index page
    Then The application displayName is "dist"
    And The "first" page displayName is "process"
    And The "second" page displayName is "home"

  Scenario: The Bonita layout shows the user name correctly
    Given I have the "appName1" application selected
    And A user is connected
    When I visit the index page
    Then I see "walter.bates" as the user name

  Scenario: The Bonita layout shows the first and last name and not the user name
    Given I have the "appName1" application selected
    And A user is connected
    And The user has a first and last name defined
    When I visit the index page
    Then I see "Walter Bates" as the user name
    And I don't see "walter.bates" as the user name

  Scenario: The Bonita layout shows the user name when a firstname isn't available
    Given I have the "appName1" application selected
    And A user is connected
    And The user doesn't have a "firstname" info available
    When I visit the index page
    Then I see "walter.bates" as the user name

  Scenario: The Bonita layout shows the user name when a lastname isn't available in mobile resolution
    Given I have the "appName1" application selected
    And A user is connected
    And The user doesn't have a "lastname" info available
    When I visit the index page
    Then I see "walter.bates" as the user name

  Scenario: The Bonita layout shows the app selection correctly
    Given I have the "appName1" application selected
    When I visit the index page
    Then I see the app selection icon

  Scenario: The Bonita layout has the correct source
    Given I have the "appName1" application selected
    When I visit the index page
    Then The image has the correct source

  Scenario: The Bonita layout should run and show the burger in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    Then The burger shows correctly

  Scenario: The Bonita layout should show page names list in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    And I click the burger
    Then I see the page name dropdown
    And The "first" page displayName in dropdown is "process"
    And The "second" page displayName in dropdown is "home"

  Scenario: The first line should be hidden in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    Then I should not see the first line

  Scenario: The application name should be shown in the menu bar in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    Then The application displayName is "app1" and is shown in the navbar

  Scenario: The Bonita layout shows the user name when a firstname isn't available in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected
    And The user doesn't have a "firstname" info available
    When I visit the index page
    And I click the burger
    Then I see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the user name when a lastname isn't available in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected
    And The user doesn't have a "lastname" info available
    When I visit the index page
    And I click the burger
    Then I see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the first and last name and not the user name in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    Then I see "Walter Bates" as the user name in the dropdown menu
    And I don't see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the app selection correctly in mobile resolution
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    And I click the burger
    Then I see the app selection icon in the dropdown menu