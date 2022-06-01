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
    And The current language in BOS_Locale is "en"
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The user first and last name "Walter Bates" are visible
    And The user name "walter.bates" is shown
    And The user email "walter.bates@email.com" is shown
    And The language select is visible
    And The logout button is visible
    And The logout button has the correct url
    And The apply and close buttons are visible

  Scenario: The current session modal is shown correctly for the technical user
    Given The URL target to the application "appName1"
    And A technical user is connected without sso
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The user first and last name "Super administrator" are visible
    And The user name "install" is shown
    And The technical user email is hidden
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
    When I press the button "Apply"
    Then The language in BOS_Locale is "fr"
    Then Page reloads

  Scenario: The language is changed in current session modal when locale is set in URL
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    And I have languages available
    When I visit the index page with a parameter "_l" in the URL
    And I wait for user API call
    And I click the user name
    Then The current session modal is visible
    And The parameter "_l" is in the URL
    When I select "Français" in language picker
    When I press the button "Apply"
    Then The language in BOS_Locale is "fr"
    Then The parameter "_l" is not in the URL
    Then Page reloads

  Scenario: The current session modal closes correctly
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And The user has a first and last name defined
    When I visit the index page
    And I wait for user API call
    And I click the user name
    Then The current session modal is visible
    When I click the close button
    Then The current session modal is not visible

  Scenario: The current session modal shows current language when first opened
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And I have languages available
    And The current language in BOS_Locale is "fr"
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    And The current language is "Français"

  Scenario: The current session modal resets current language when closed and reopened
    Given The URL target to the application "appName1"
    And A user is connected without sso
    And I have languages available
    And The current language in BOS_Locale is "en"
    When I visit the index page
    And I click the user name
    Then The current session modal is visible
    # Check language stays the same after closing the modal when clicking the close button
    When I select "Français" in language picker
    And I click the close button
    Then The current session modal is not visible
    When I click the user name
    Then The current session modal is visible
    And The current language is "English"
    # Check language stays the same after closing the modal when clicking next to it
    When I select "Français" in language picker
    And I click next to the current session modal
    Then The current session modal is not visible
    When I click the user name
    Then The current session modal is visible
    And The current language is "English"