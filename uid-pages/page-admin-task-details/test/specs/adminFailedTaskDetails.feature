Feature: The Admin Failed Task Details in desktop resolution

  Scenario: The admin task details displays the correct attributes for failed tasks
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    When I visit the admin failed task details page
    Then The failed task details have the correct information

  Scenario: The admin task details has the correct link to task list
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    When I visit the admin failed task details page
    Then The back button has correct href

  Scenario: The admin failed task details display comments correctly
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "comments" is defined for failed tasks
    When I visit the admin failed task details page
    Then The comments have the correct information
    And "No (more) comments to display" is shown at the end of the comments
    And There is no "System comment"

  Scenario: The admin failed task details should add a new comment
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "comments" is defined for failed tasks
    And The response "add new comment" is defined for failed tasks
    When I visit the admin failed task details page
    Then The comments have the correct information
    And The add comment button is "disabled"
    When I fill in the new comment
    Then The add comment button is "enabled"
    When I click on add comment button
    Then There is a new comment
    And The new comment input is empty
    Then The add comment button is "disabled"

  Scenario: The admin failed task details displays the connectors correctly
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    Then The connectors section have the correct information

  Scenario: The failed connector modal displays the correct attributes
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    And The response "failure connector" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on failed connector button
    Then The failed connector modal is opened for "failedConnectorName"
    And The modal has the correct information
    When I click on close button in the modal
    Then The failed connector modal is closed

  Scenario: The admin archived failed task details does not have the connectors
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin done task details page
    Then The connectors section is empty

  Scenario: The skip task modal is opened and closed
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on skip button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on cancel button in the modal
    Then The skip modal is closed

  Scenario: The skip task modal skips the task correctly
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "skip and refresh task" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on skip button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on skip button in the modal
    Then There is a confirmation for task being successfully skipped
    And The skipped failed task details page is refreshed
    And The cancel button is not displayed
    When I click on the close button
    Then The skip modal is closed
    And The task is skipped
# TODO
#  Scenario: The assign modal should display 500 error message
#    Given The response "empty done task" is defined for pending tasks
#    And The response "default unassigned details" is defined for pending tasks
#    And The response "user list" is defined for pending tasks
#    And The assign status code 500 is defined for pending tasks
#    When I visit the admin pending task details page
#    And I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And The user list is not displayed
#    And The assign button in the modal is disabled
#    When I type "H" in the user input
#    Then The user list is displayed
#    When I click on "Helen Kelly" in the list
#    Then The user list is not displayed
#    And The user input is filled with "Helen Kelly"
#    When I click on assign button in the modal
#    Then I see "500" error message for "assigned"
#    When I click on the cancel button
#    Then The assign modal is closed
#    When I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And I don't see any error message
#
#  Scenario: The assign modal should display 404 error message
#    Given The response "empty done task" is defined for pending tasks
#    And The response "default unassigned details" is defined for pending tasks
#    And The response "user list" is defined for pending tasks
#    And The assign status code 404 is defined for pending tasks
#    When I visit the admin pending task details page
#    And I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And The user list is not displayed
#    And The assign button in the modal is disabled
#    When I type "H" in the user input
#    Then The user list is displayed
#    When I click on "Helen Kelly" in the list
#    Then The user list is not displayed
#    And The user input is filled with "Helen Kelly"
#    When I click on assign button in the modal
#    Then I see "404" error message for "assigned"
#    When I click on the cancel button
#    Then The assign modal is closed
#    When I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And I don't see any error message
#
#  Scenario: The assign modal should display 403 error message
#    Given The response "empty done task" is defined for pending tasks
#    And The response "default unassigned details" is defined for pending tasks
#    And The response "user list" is defined for pending tasks
#    And The assign status code 403 is defined for pending tasks
#    When I visit the admin pending task details page
#    And I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And The user list is not displayed
#    And The assign button in the modal is disabled
#    When I type "H" in the user input
#    Then The user list is displayed
#    When I click on "Helen Kelly" in the list
#    Then The user list is not displayed
#    And The user input is filled with "Helen Kelly"
#    When I click on assign button in the modal
#    Then I see "403" error message for "assigned"
#    When I click on the cancel button
#    Then The assign modal is closed
#    When I click on assign button
#    Then The assign modal is open and has a default state for "Request Vacation"
#    And I don't see any error message
