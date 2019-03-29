Feature: The Bonita layout in mobile resolution

  Scenario: The application name should be shown in the menu bar
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    Then The application displayName is "app1" and is shown in the navbar

  Scenario: The burger is opened and closed when clicking the icon two times
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    And I click the burger
    Then I see the dropdown that opened
    When I click the burger
    Then I don't see the dropdown

  Scenario: The Bonita layout shows the user name when a firstname isn't available
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user doesn't have a "firstname" info available
    When I visit the index page
    And I click the burger
    Then I see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the user name when a lastname isn't available
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user doesn't have a "lastname" info available
    When I visit the index page
    And I click the burger
    Then I see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the first and last name and not the user name
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    Then I see "Walter Bates" as the user name in the dropdown menu
    And I don't see "walter.bates" as the user name in the dropdown menu

  Scenario: The Bonita layout shows the app selection correctly
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    When I visit the index page
    And I click the burger
    Then I see the app selection icon in the dropdown menu

  Scenario: The Bonita layout shows the current session modal
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible

  Scenario: The current session modal is shown correctly without sso
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible
    And The user first and last name "Walter Bates" are visible
    And The user name "walter.bates" is shown
    And The user email "walter.bates@email.com" is shown
    And The language select is visible
    And The logout button is visible
    And The save and cancel buttons are visible

  Scenario: The current session modal is shown correctly with sso
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected with sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible
    And The logout button is hidden

  Scenario: The current session modal has the image correctly set
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible
    And I see "../API/avatars/1" as the user modal icon

  Scenario: The current session modal doesn't show an image
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first, a last name, but no image defined
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible
    And I see "../theme/icons/default/icon_user.png" as the user modal icon


  Scenario: The language is changed in current session modal
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And A user is connected without sso
    And The user has a first and last name defined
    And I have languages available
    When I visit the index page
    And I click the burger
    And I click the user name in dropdown
    Then The current session modal is visible
    And The save button is disabled
    When I select "Français" in language picker
    Then The save button is enabled
    When I press the save button
    Then The language in BOS_Locale is "fr"

  Scenario: The app selection modal is shown correctly
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And Multiple applications are available for the user
    When I visit the index page
    And I click the burger
    Then I see the dropdown that opened
    When I click the app selection icon in dropdown
    Then The app selection modal is visible
    And I see my apps

  Scenario: The app selection modal filter works correctly
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And Multiple applications are available for the user
    And The filter responses is defined
    When I visit the index page
    And I click the burger
    Then I see the dropdown that opened
    When I click the app selection icon in dropdown
    Then The app selection modal is visible
    When I filter the app selection by "My first"
    Then I see only the filtered applications
    When I erase the input field
    And I filter the app selection by "app1"
    Then I see only the filtered applications
    When I erase the input field
    And I filter the app selection by "1.0.5"
    Then I see only the filtered applications

  Scenario: The app selection modal closes correctly
    Given The resolution is set to mobile
    And I have the "appName1" application selected
    And Multiple applications are available for the user
    When I visit the index page
    And I click the burger
    Then I see the dropdown that opened
    When I click the app selection icon in dropdown
    Then The app selection modal is visible
    When I click the close button
    Then The app selection modal is not visible