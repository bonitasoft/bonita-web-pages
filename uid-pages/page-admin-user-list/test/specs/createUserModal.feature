Feature: create user modal in desktop resolution

  Scenario: The modal is displayed and closed
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    And I click on create button
    When I click on "Cancel" button in modal
    Then The modal is closed

  Scenario: The modal should create a user
    Given The filter response "default filter with headers" is defined
    And Create user response is defined
    When I visit the user list page
    Then The users have the correct information
    When I click on create button
    Then The create modal is open and has a default state for "Create a user"
    When I fill in the user information
    Then The "Create" button in modal is "enabled"
    And I click on "Create" button in modal
    Then The creation is successful
    And The users list is refreshed
    When I click on the "Close" button in modal
    Then The modal is closed
    When I click on create button
    Then The create modal is open and has a default state for "Create a user"

  Scenario: The modal should display the passwords don't match
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    And I click on create button
    And I fill in the user information
    And I put different passwords
    Then The create button in modal is disabled
    And I see "The passwords don't match" error message
    When I click on "Cancel" button in modal
    And I click on create button
    Then I don't see "The passwords don't match" error message

  Scenario: The create button in modal is disabled when not all fields are filled
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    And I click on create button
    Then The create button in modal is disabled
    When I fill in the user information
    Then The create button in modal is enabled
    When I erase all fields
    And I see "This field is required" error message
    And I fill in the username
    Then The create button in modal is disabled
    When I fill in the password
    Then The create button in modal is disabled
    When I fill in the confirm password
    Then The create button in modal is enabled

  Scenario: The modal should display 500 error message
    Given The filter response "default filter with headers" is defined
    And The create user status code "500" response is defined
    When I visit the user list page
    And I click on create button
    And I fill in the user information
    And I click on "Create" button in modal
    Then I see status code "500" error message
    When I click on "Cancel" button in modal
    And I click on create button
    Then All create user modal information is cleared
    And I don't see any error message

  Scenario: The modal should display 403 error message
    Given The filter response "default filter with headers" is defined
    And The create user status code "403" response is defined
    When I visit the user list page
    And I click on create button
    And I fill in the user information
    And I click on "Create" button in modal
    Then I see status code "403" error message
    When I click on "Cancel" button in modal
    And I click on create button
    Then All create user modal information is cleared
    And I don't see any error message

  Scenario: The modal should display already exists error message
    Given The filter response "default filter with headers" is defined
    And The create user already exists response is defined
    When I visit the user list page
    And I click on create button
    And I fill in the user information
    And I click on "Create" button in modal
    Then I see "Another user already exists" error message
    When I click on "Cancel" button in modal
    And I click on create button
    Then All create user modal information is cleared
    And I don't see any error message

  Scenario: The modal should display robustness password error message
    Given The filter response "default filter with headers" is defined
    And The robustness password error response is defined
    When I visit the user list page
    And I click on create button
    And I fill in the user information
    And I click on "Create" button in modal
    Then I see "Password must be at least 10 characters long containing at least 3 digits, 2 upper case characters, and 2 special characters." error message
    When I click on "Cancel" button in modal
    And I click on create button
    Then All create user modal information is cleared
    And I don't see any error message