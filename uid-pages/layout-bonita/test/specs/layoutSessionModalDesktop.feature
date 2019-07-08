Feature: The Bonita layout current session modal in desktop resolution

  Scenario: The Bonita layout shows the current session modal
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the user name
    Then The current session modal is visible

  Scenario: The current session modal is shown correctly without sso
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The user first and last name "Walter Bates" are visible
    And The user name "walter.bates" is shown
    And The user email "walter.bates@email.com" is shown
    And The language select is visible
    And The logout button is visible
    And The apply and close buttons are visible

  Scenario: The current session modal is shown correctly with sso
    Given The URL target to the application "appName1"
    And A user is connected with sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The logout button is hidden

  Scenario: The current session modal has the user icon correctly set
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And I see "../API/avatars/1" as the user modal icon

  Scenario: The current session modal show the default user icon
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has the default icon
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And I see default user icon as the user modal icon

  Scenario: The language is changed in current session modal
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    And I have languages available
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The apply button is disabled
    When I select "Français" in language picker
    Then The apply button is enabled
    When I press the apply button
    Then The language in BOS_Locale is "fr"

  Scenario: The current session modal closes correctly
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    When I click the close button
    Then The current session modal is not visible