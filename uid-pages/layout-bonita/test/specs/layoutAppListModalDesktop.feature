Feature: The Bonita layout app list modal in desktop resolution

  Scenario: The app selection modal is shown correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see my apps

  Scenario: The app selection modal filter works correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined
    And Incorrect name filter response is defined
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    When I filter the app selection by "My first"
    Then I see only the filtered applications by "name" in desktop
    When I erase the input field
    And I filter the app selection by "app1"
    Then I see only the filtered applications by "token" in desktop
    When I erase the input field
    And I filter the app selection by "1.0.5"
    Then I see only the filtered applications by "version" in desktop
    When I erase the input field
    And I filter the app selection by "Incorrect name"
    Then I don't see any apps
    And The no app is available text is "No applications to display"

  Scenario: The app selection modal filter works correctly for an app with special characters
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    When I filter the app selection by "&Special"
    Then I see only the filtered applications by "&Special" in desktop

  Scenario: The app selection modal closes correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    When I click the close button
    Then The app selection modal is not visible

  Scenario: The app name should have a tooltip for full app name
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And The app on-hover text should be "My first app"

  Scenario: The current app is the only one has the app item current class defined
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And The current application has the class "application-card--current"
    And The other applications don't have the class "application-card--current"

  Scenario: Load more button works correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And 35 applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    When I click on Load more applications button
    Then A list of 30 items is displayed
    When I click on Load more applications button
    Then A list of 35 items is displayed
    And The load more applications button is disabled

  Scenario: Load more is disabled when result is a multiple of count
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And 20 applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    And The load more applications button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And 30 applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    When I click on Load more applications button
    Then A list of 30 items is displayed
    And The load more applications button is disabled
    When I filter the app selection by "Bonita"
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed