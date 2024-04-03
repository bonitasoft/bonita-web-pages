Feature: The Application Directory in desktop resolution

  Background:
    Given The current language in BOS_Locale is "en"
    
  Scenario: The application directory displays the correct attributes
    Given The response "default filter" is defined
    And The response "session" is defined
    When I visit the application directory page
    Then The application directory page has the correct information

  Scenario: The application directory search works correctly
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "search" is defined
    When I visit the application directory page
    Then A list of 5 items is displayed
    When I put "Bonita" in search filter field
    Then The api call is made for "Bonita"
    And A list of 1 items is displayed
    When I erase the search filter
    Then A list of 5 items is displayed
    When I put "Search term with no match" in search filter field
    Then No applications are displayed

  Scenario: The application directory search works correctly for app name with special characters
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "search" is defined
    When I visit the application directory page
    Then A list of 5 items is displayed
    When I put "&Special" in search filter field
    Then The api call is made for "&Special"
    And A list of 1 items is displayed

  Scenario: The application directory shows the user icon correctly
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    When I visit the application directory page
    Then I see "../API/avatars/1" as the user menu icon

  Scenario: The application directory shows the first and last name and not the user name
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    When I visit the application directory page
    Then I see "Walter Bates" as the user name
    And I see "../API/avatars/1" as the user menu icon
    And I don't see "walter.bates" as the user name
    And I don't see "Sign in" as the user name

  Scenario: The application directory shows the user name when a firstname isn't available
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "no user first name" is defined
    When I visit the application directory page
    Then I see "walter.bates" as the user name

  Scenario: The application directory shows the user name when a lastname isn't available
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "no user last name" is defined
    When I visit the application directory page
    Then I see "walter.bates" as the user name

  Scenario: The application directory shows the login link when guest user is connected
    Given The response "default filter" is defined
    And The response "guest user" is defined
    When I visit the application directory page
    Then The login link is displayed
    And I don't see "guest" as the user name

  Scenario: The login button is hidden if sso is active and guest user is connected
    Given The response "default filter" is defined
    And The response "guest user with sso" is defined
    When I visit the application directory page
    Then The login link is hidden
    And I don't see "guest" as the user name

  Scenario: The application directory shows the user default icon
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "default user" is defined
    When I visit the application directory page
    And I see default user icon as the user menu icon

  Scenario: The application directory shows the current session modal
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible

  Scenario: The current session modal is shown correctly without sso
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    And The current language in BOS_Locale is "en"
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And The user first and last name "Walter Bates" are visible
    And The user name "walter.bates" is shown
    And The user email "walter.bates@acme.com" is shown
    And The language select is visible
    And The logout button is visible
    And The logout button has the correct url
    And The apply and close buttons are visible

  Scenario: The current session modal is shown correctly with sso
    Given The response "default filter" is defined
    And The response "session with SSO" is defined
    And The response "user" is defined
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And The logout button is hidden

  Scenario: The current session modal has the user icon correctly set
    Given The response "default filter" is defined
    And The response "session with SSO" is defined
    And The response "user" is defined
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And I see "../API/avatars/1" as the user modal icon

  Scenario: The current session modal show the default user icon
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "default user" is defined
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And I see default user icon as the user modal icon

  Scenario: The application directory shows the technical username correctly
    Given The response "default filter" is defined
    And The response "technical user" is defined
    When I visit the application directory page
    Then I see "Super administrator" as the user name
    And I see default user icon as the user menu icon
    And I don't see "install" as the user name
    And I don't see "Sign in" as the user name

  Scenario: The current session modal is shown correctly for the technical user
    Given The response "default filter" is defined
    And The response "technical user" is defined
    When I visit the application directory page
    And I click the "Super administrator"
    Then The current session modal is visible
    And The user first and last name "Super administrator" are visible
    And The user name "install" is shown
    And The technical user email is hidden
    And The language select is visible
    And The logout button is visible
    And The apply and close buttons are visible

  Scenario: The language is changed in current session modal
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    And The response "localization" is defined
    And The current language in BOS_Locale is ""
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And The apply button is disabled
    When I select "Français" in language picker
    Then The apply button is enabled
    When I press the button "Apply"
    Then The language in BOS_Locale is "fr"
    Then Page reloads

  Scenario: The language is changed in current session modal when locale is set in URL
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    And The response "localization" is defined
    When I visit the application directory page with a parameter "_l" in the URL
    And I click the "Walter Bates"
    Then The current session modal is visible
    And The parameter "_l" is in the URL
    When I select "Français" in language picker
    When I press the button "Apply"
    Then The language in BOS_Locale is "fr"
    Then The parameter "_l" is not in the URL
    Then Page reloads

  Scenario: The current session modal closes correctly
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    When I click the close button
    Then The current session modal is not visible

  Scenario: The current session modal shows current language when first opened
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    And The response "localization" is defined
    And The current language in BOS_Locale is "fr"
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    And The current language is "Français"

  Scenario: The current session modal resets current language when closed and reopened
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "user" is defined
    And The response "localization" is defined
    And The current language in BOS_Locale is "en"
    When I visit the application directory page
    And I click the "Walter Bates"
    Then The current session modal is visible
    # Check language stays the same after closing the modal when clicking the close button
    When I select "Français" in language picker
    And I click the close button
    Then The current session modal is not visible
    When I click the "Walter Bates"
    Then The current session modal is visible
    And The current language is "English"
    # Check language stays the same after closing the modal when clicking next to it
    When I select "Français" in language picker
    And I click next to the current session modal
    Then The current session modal is not visible
    When I click the "Walter Bates"
    Then The current session modal is visible
    And The current language is "English"