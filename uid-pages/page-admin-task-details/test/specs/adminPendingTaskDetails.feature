Feature: The Admin Pending Task Details in desktop resolution

  Scenario: The admin task details displays the correct attributes for pending tasks
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    When I visit the admin pending task details page
    Then The pending task details have the correct information

  Scenario: The admin pending task details displays the connectors correctly
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    When I visit the admin pending task details page
    Then The connectors section have the correct information for pending tasks

  Scenario: The assign task modal is opened and closed
    Given The response "empty done task" is defined for pending tasks
    And The response "refresh task not called" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    When I visit the admin pending task details page
    And I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    When I click on the cancel button
    Then The modal is closed

  Scenario: The assign task modal assign the task correctly
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list" is defined for pending tasks
    And The response "assign and refresh task" is defined for pending tasks
    When I visit the admin pending task details page
    Then The unassign button is not displayed
    When I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And The user list is not displayed
    And The assign button in the modal is disabled
    When I type "H" in the user input
    Then The user list is displayed
    When I click on "Helen Kelly" in the list
    Then The user list is not displayed
    And The user input is filled with "Helen Kelly"
    When I click on assign button in the modal
    Then There is a confirmation for task being successfully assigned
    And The api call has the correct user id
    And The page is refreshed
    And The cancel button is not displayed
    When I click on the close button
    Then The modal is closed
    And The unassign button is displayed
    And The assign button is not displayed

  Scenario: The assign modal should display 500 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list" is defined for pending tasks
    And The assign status code 500 is defined for pending tasks
    When I visit the admin pending task details page
    And I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And The user list is not displayed
    And The assign button in the modal is disabled
    When I type "H" in the user input
    Then The user list is displayed
    When I click on "Helen Kelly" in the list
    Then The user list is not displayed
    And The user input is filled with "Helen Kelly"
    When I click on assign button in the modal
    Then I see "500" error message for "assigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: The assign modal should display 404 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list" is defined for pending tasks
    And The assign status code 404 is defined for pending tasks
    When I visit the admin pending task details page
    And I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And The user list is not displayed
    And The assign button in the modal is disabled
    When I type "H" in the user input
    Then The user list is displayed
    When I click on "Helen Kelly" in the list
    Then The user list is not displayed
    And The user input is filled with "Helen Kelly"
    When I click on assign button in the modal
    Then I see "404" error message for "assigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: The assign modal should display 403 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list" is defined for pending tasks
    And The assign status code 403 is defined for pending tasks
    When I visit the admin pending task details page
    And I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And The user list is not displayed
    And The assign button in the modal is disabled
    When I type "H" in the user input
    Then The user list is displayed
    When I click on "Helen Kelly" in the list
    Then The user list is not displayed
    And The user input is filled with "Helen Kelly"
    When I click on assign button in the modal
    Then I see "403" error message for "assigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: The assign modal should display information about typing more
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list with 20 elements" is defined for pending tasks
    When I visit the admin pending task details page
    Then The unassign button is not displayed
    When I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    And The user list is not displayed
    And The assign button in the modal is disabled
    When I type "U" in the user input
    Then The user list is displayed
    And The type more message is displayed and disabled
    When I type "s" in the user input
    Then The type more message is not displayed

  Scenario: The unassign task modal is opened and closed
    Given The response "empty done task" is defined for pending tasks
    And The response "refresh task not called" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    When I visit the admin pending task details page
    And I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    When I click on the cancel button
    Then The modal is closed

  Scenario: The unassign task modal unassigns the task correctly
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The response "unassign and refresh task" is defined for pending tasks
    When I visit the admin pending task details page
    Then The assign button is not displayed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    When I click on unassign button in the modal
    Then There is a confirmation for task being successfully unassigned
    And The unassign api call has the correct user id
    And There is no confirmation message for unassign
    And The unassigned page is refreshed
    And The cancel button is not displayed
    When I click on the close button
    Then The modal is closed
    And The assign button is displayed
    And The unassign button is not displayed

  Scenario: The unassign modal should display 500 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The assign status code 500 is defined for pending tasks
    When I visit the admin pending task details page
    Then The assign button is not displayed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    When I click on unassign button in the modal
    Then I see "500" error message for "unassigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: The unassign modal should display 404 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The assign status code 404 is defined for pending tasks
    When I visit the admin pending task details page
    Then The assign button is not displayed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    When I click on unassign button in the modal
    Then I see "404" error message for "unassigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: The unassign modal should display 403 error message
    Given The response "empty done task" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The assign status code 403 is defined for pending tasks
    When I visit the admin pending task details page
    Then The assign button is not displayed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    When I click on unassign button in the modal
    Then I see "403" error message for "unassigned"
    When I click on the cancel button
    Then The modal is closed
    When I click on unassign button
    Then The unassign modal is open and has a default state for "Request Vacation"
    And I don't see any error message

  Scenario: Do for button changes disabled status after task is assigned
    Given The response "empty done task" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    And The response "user list" is defined for pending tasks
    And The response "assign and refresh task" is defined for pending tasks
    When I visit the admin pending task details page
    Then The do for button is disabled
    When I click on assign button
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    When I click on assign button in the modal
    When I click on the close button
    Then The modal is closed
    And The do for button is enabled

  Scenario: The assign task modal is opened and closed
    Given The response "empty done task" is defined for pending tasks
    And The response "refresh task not called" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The response "task with form" is defined for pending tasks
    When I visit the admin pending task details page
    And I click on do for button
    Then The do for modal is open and has a default state for "Do Request Vacation for Helen Kelly"
    When I click on the cancel button
    Then The modal is closed

  Scenario: The assign task modal is opened and closed
    Given The response "empty done task" is defined for pending tasks
    And The response "refresh task not called" is defined for pending tasks
    And The response "default details" is defined for pending tasks
    And The response "task with form" is defined for pending tasks
    When I visit the admin pending task details page
    And I click on do for button
    Then The do for modal is open and has a default state for "Do Request Vacation for Helen Kelly"
    When I click on do task link
    Then The form is displayed
