Feature: The Admin Case Details in desktop resolution

  Scenario: The admin case details displays the correct attributes
    Given The response "default details" is defined
    When I visit the admin case details page
    Then The case details have the correct information

  Scenario: The admin case details displays no search keys
    Given The response "default details without search keys" is defined
    When I visit the admin case details page
    Then There are no search keys

  Scenario: The admin case details has the correct link to case list
    Given The response "default details" is defined
    When I visit the admin case details page
    Then The back button has correct href

  Scenario: The admin case details has the correct link to case overview
    Given The response "default details" is defined
    When I visit the admin case details page
    And I click on case overview button
    Then The case overview url is displayed

  Scenario: The admin case details display monitoring for less than 10 tasks correctly
    Given The response "default details" is defined
    And The response "monitor 9 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "9" tasks
    And The task list link has correct href
    And The no task message is not visible

  Scenario: The admin case details display monitoring for exactly 10 tasks correctly
    Given The response "default details" is defined
    And The response "monitor 10 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "10" tasks

  Scenario: The admin case details display monitoring for more than 10 tasks correctly
    Given The response "default details" is defined
    And The response "monitor 10+ tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "11" tasks

  Scenario: The admin case details display monitoring for no tasks correctly
    Given The response "default details" is defined
    And The response "monitor 0 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "0" tasks
    And The task list link is not visible

  Scenario: The admin case details display comments correctly
    Given The response "default details" is defined
    And The response "comments" is defined
    And The response "process variable api is not called" is defined
    When I visit the admin case details page
    Then The comments have the correct information
    And "No (more) comments to display" is shown at the end of the comments
    And There is no "System comment"

  Scenario: The admin case details should add a new comment
    Given The response "default details" is defined
    And The response "add new comment" is defined
    When I visit the admin case details page
    Then There are no comments
    And The add comment button is "disabled"
    When I fill in the new comment
    Then The add comment button is "enabled"
    When I click on add comment button
    Then There is a new comment
    And The new comment input is empty
    Then The add comment button is "disabled"

  Scenario: The admin case details should display an archived case
    Given The response "archived case" is defined
    And The response "archived comments" is defined
    When I visit the admin case details page
    Then The state is "completed"
    And The input placeholder is "Comments cannot be added to archived cases"
    And The input placeholder is not "Type new comment"
    And The comments have the correct information

  Scenario: The admin case details displays the process variables
    Given The response "default details" is defined
    And The response "process variables with headers" is defined
    When I visit the admin case details page
    And I click on process variables tab
    Then The process variables have the correct information

  Scenario: The edit process variables works correctly for string variable
    Given The response "default details" is defined
    And The response "process variables" is defined
    And The response "process variable update" is defined
    When I visit the admin case details page
    And I click on process variables tab
    And I click on Edit button for process variable "1"
    Then Edit modal for variable "1" is displayed
    And The value for variable "1" is displayed correctly in the modal
    When I modify the value for variable "1"
    And I click on "Save" button in the modal
    Then I see the updated successfully message
    When I click on "Close" button in the modal
    Then The modal is closed
    And I see the value is updated for variable "1"

  Scenario: The edit process variables works correctly for boolean variable
    Given The response "default details" is defined
    And The response "process variables" is defined
    And The response "process variable update boolean" is defined
    When I visit the admin case details page
    And I click on process variables tab
    And I click on Edit button for process variable "2"
    Then Edit modal for variable "2" is displayed
    And The value for variable "2" is displayed correctly in the modal
    When I modify the value for variable "2"
    And I click on "Save" button in the modal
    Then I see the updated successfully message
    When I click on "Close" button in the modal
    Then The modal is closed
    And I see the value is updated for variable "2"

  Scenario: The edit modal should display 500 error message
    Given The response "default details" is defined
    And The response "process variables" is defined
    And The response "500 error" is defined
    When I visit the admin case details page
    And I click on process variables tab
    And I click on Edit button for process variable "1"
    Then Edit modal for variable "1" is displayed
    And The value for variable "1" is displayed correctly in the modal
    When I modify the value for variable "1"
    And I click on "Save" button in the modal
    Then I see "500" error message
    When I click on "Cancel" button in the modal
    Then The modal is closed
    And The value for variable 1 is not changed

  Scenario: No case is found with id message is shown
    When I visit the admin case details page
    Then I see that "No case found with id: 1"

  Scenario: No id is specified message is shown
    When I visit the admin case details page without an id
    Then I see that "Case id not provided. Unable to retrieve the case."

  Scenario: No id is specified message is shown when id is empty
    When I visit the admin case details page with an empty id
    Then I see that "Case id not provided. Unable to retrieve the case."
