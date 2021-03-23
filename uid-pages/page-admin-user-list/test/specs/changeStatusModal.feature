Feature: change status modal in desktop resolution

  Scenario: The change status button depends on user status
    Given The filter response "default filter with headers" is defined
    And The filter response "inactive user" is defined
    When I visit the user list page
    Then The first user has the "ban-circle" button
    When I filter show inactive users
    Then The first user has the "ok" button

  Scenario: The change status modal is displayed and closed
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    Then The change status modal is displayed for "Giovanna Almeida"
    When I click on "Cancel" button in modal
    Then The modal is closed

  Scenario: The change status modal displays the correct user name
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    Then The change status modal is displayed for "Giovanna Almeida"
    When I click on "Cancel" button in modal
    And I click on "ban-circle" button on the user "2"
    Then The change status modal is displayed for "daniela.angelo"
    When I click on "Cancel" button in modal
    And I click on "ban-circle" button on the user "3"
    Then The change status modal is displayed for "walter.bates"
    When I click on "Cancel" button in modal
    And I click on "ban-circle" button on the user "4"
    Then The change status modal is displayed for "isabel.bleasdale"

  Scenario: The change status modal displays the correct action
    Given The filter response "default filter with headers" is defined
    And The filter response "inactive user" is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    Then The "Deactivate" title is displayed
    And The "Deactivate" button is displayed
    When I click on "Cancel" button in modal
    And I filter show inactive users
    And I click on "ok" button on the user "1"
    Then The "Activate" title is displayed
    And The "Activate" button is displayed

  Scenario: The change status modal should deactivate a user
    Given The filter response "default filter with headers" is defined
    And Deactivate user response is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    Then The deactivate modal is open and has a default state for "Deactivate Giovanna Almeida"
    When I click on "Deactivate" button in modal
    Then The "Deactivate" is successful
    And The users list is refreshed
    When I click on the "Close" button in modal
    And The modal is closed

  Scenario: The change status modal should activate a user
    Given The filter response "default filter with headers" is defined
    And The filter response "inactive user" is defined
    And Activate user response is defined
    When I visit the user list page
    And I filter show inactive users
    And I click on "ok" button on the user "1"
    Then The activate modal is open and has a default state for "Activate Giovanna Almeida"
    When I click on "Activate" button in modal
    Then The "Activate" is successful
    When I click on the "Close" button in modal
    And The modal is closed

  Scenario: The change status modal should display 500 error message
    Given The filter response "default filter with headers" is defined
    And The deactivate status code "500" response is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    When I click on "Deactivate" button in modal
    Then I see status code "500" error message
    When I click on "Cancel" button in modal
    And I click on "ban-circle" button on the user "1"
    Then I don't see any error message

  Scenario: The change status modal should display 403 error message
    Given The filter response "default filter with headers" is defined
    And The deactivate status code "403" response is defined
    When I visit the user list page
    And I click on "ban-circle" button on the user "1"
    When I click on "Deactivate" button in modal
    Then I see status code "403" error message
    When I click on "Cancel" button in modal
    And I click on "ban-circle" button on the user "1"
    Then I don't see any error message