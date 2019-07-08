Feature: The Bonita layout header in desktop resolution

  Scenario: The Bonita layout is running
    Given The URL target to the application "appName1"
    And I have the application home page token defined
    When I visit the index page
    Then The application displayName is "app1"
    And The "first" page displayName is "process"
    And The "second" page displayName is "home"
    And Application name has "/bonita/apps/app1/homePageToken" as application href

  Scenario: The Bonita layout shows the user icon correctly
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    Then I see "../API/avatars/1" as the user menu icon

  Scenario: The Bonita layout shows the first and last name and not the user name
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    Then I see "Walter Bates" as the user name
    And I see "../API/avatars/1" as the user menu icon
    And I don't see "walter.bates" as the user name

  Scenario: The Bonita layout shows the user name when a firstname isn't available
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user doesn't have a "firstname" info available
    When I visit the index page
    Then I see "walter.bates" as the user name

  Scenario: The Bonita layout shows the user name when a lastname isn't available
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user doesn't have a "lastname" info available
    When I visit the index page
    Then I see "walter.bates" as the user name

  Scenario: The Bonita layout shows the user default icon
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has the default icon
    When I visit the index page
    And I see default user icon as the user menu icon

  Scenario: The Bonita layout shows the app selection correctly
    Given The URL target to the application "appName1"
    When I visit the index page
    Then I see the app selection icon

  Scenario: The Bonita layout image has the correct source
    Given The URL target to the application "appName1"
    Given A logo is available in the theme
    When I visit the index page
    Then The image has the correct source

  Scenario: The Bonita layout image is not displayed
    Given The URL target to the application "appName1"
    When I visit the index page
    Then The image is not displayed

  Scenario: The favicon link should be set correctly
    Given The URL target to the application "appName1"
    When I visit the index page
    Then The favicon link should be set to "../theme/icons/default/favicon.ico"
