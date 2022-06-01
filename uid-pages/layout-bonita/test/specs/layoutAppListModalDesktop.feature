Feature: The Bonita layout app list modal in desktop resolution

  Scenario: The app selection modal is shown correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see my apps in desktop
    And I don't see the mobile names

  Scenario: The app selection modal filter works correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
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
    And The no app is available text is "No application available using these filters"

  Scenario: The app selection modal closes correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    When I click the close button
    Then The app selection modal is not visible

  Scenario: The app description popup is shown correctly
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And The app on-hover text should be "My first app"

  Scenario: The app filter by profile is visible
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for all profiles
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I see my apps in desktop

  Scenario: The apps are filtered by the user profile
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for the user profile
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I select "User" in dropdown
    And I see only my user apps

  Scenario: The apps are filtered by the administrator profile
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for the administrator profile
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I select "Administrator" in dropdown
    And I see only my administrator apps

  Scenario: The apps aren't filtered when selecting the all option
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for all profiles
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I select "All profiles" in dropdown
    And I see my apps in desktop

  Scenario: The apps are filtered by both user profile and app name
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for the administrator profile
    And The response for both administrator profile and app name is defined
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I select "Administrator" in dropdown
    And I see only my administrator apps
    When I filter the app selection by "My first"
    Then I see only the app with correct profile and name

  Scenario: No app is displayed when the filter is incorrect
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    And The filter responses are defined for the administrator profile
    And Incorrect name filter response is defined
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And I see the filter dropdown
    And I select "Administrator" in dropdown
    And I see only my administrator apps
    When I filter the app selection by "Incorrect name"
    Then I don't see any apps
    And The no app is available text is "No application available using these filters"

  Scenario: The current app is the only one has the app item current class defined
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user
    When I visit the index page
    And I click the app selection icon
    Then The app selection modal is visible
    And The current application has the class "app-item--current"
    And The other applications don't have the class ".app-item--current"

  Scenario: Show only the apps with profile access rights
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The profiles list is defined
    And The user has a first and last name defined
    And Multiple applications are available for the user, some without access rights
    And Unauthorized applications response is defined
    When I visit the index page
    And I click the app selection icon
    Then I see my apps in desktop
    And I don't see the apps without access rights
    When I filter the app selection by "noAccess"
    Then I don't see any apps
    And The no app is available text is "No application available using these filters"