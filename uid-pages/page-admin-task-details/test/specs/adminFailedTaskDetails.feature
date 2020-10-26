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
    When I click on "Add comment" button
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
    When I click on "Close" button in the modal
    Then There is no modal displayed
    When I click on second failed connector button
    Then The failed connector modal is opened for "secondFailedConnector"

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
    And I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed

  Scenario: The skip task modal skips the task correctly
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "skip and refresh task" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on "Skip" button in the modal
    Then There is a confirmation for task being successfully skipped
    And The skipped failed task details page is refreshed
    And The cancel button is not displayed
    When I click on "Close" button in the modal
    Then There is no modal displayed
    And The task is skipped

  Scenario: The skip task modal should display generic 500 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "500" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on "Skip" button in the modal
    Then I see "500" error message for "skipped"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    And I don't see any error message

  Scenario: The skip task modal should display generic 403 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "403" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on "Skip" button in the modal
    Then I see "403" error message for "skipped"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    And I don't see any error message

  Scenario: The skipped task modal should display generic 404 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "403" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    When I click on "Skip" button in the modal
    Then I see "403" error message for "skipped"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Skip" button
    Then The skip modal is open and has a default state for "1 failed task"
    And I don't see any error message

  Scenario: The replay task modal is opened and closed
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed

  Scenario: The select all and reset work correctly in replay modal
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "three failed connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has three failed connectors
    When I click on "Replay all" button in the modal
    Then All connectors will be replayed
    When I click on "Skip all" button in the modal
    Then All connectors will be skipped
    When I replay the first connector
    Then Only the first connector will be replayed
    When I click on "Replay all" button in the modal
    Then All connectors will be replayed
    When I click on "Replay all" button in the modal
    Then All connectors will be replayed
    When I skip the first and the third connectors
    Then Only the first and the third connector will be skipped
    And I click on "Skip all" button in the modal
    Then All connectors will be skipped
    When I replay the first connector
    Then Only the first connector will be replayed
    And I click on "Skip all" button in the modal
    Then All connectors will be skipped
    And I click on "Skip all" button in the modal
    Then All connectors will be skipped
    And I click on "Replay all" button in the modal
    Then All connectors will be replayed
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Replay" button
    Then The replay modal is open and has three failed connectors

  Scenario: The replay task modal replays the task correctly
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "replay success" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I replay the first connector
    Then The replay button in modal footer is disabled
    When I replay the second connector
    And I click on "Replay" button in the modal footer
    Then There is a confirmation for task being successfully replayed
    And The failed task details page is refreshed
    When I click on "Close" button in the modal
    Then There is no modal displayed
    And There are no possible actions
    And The page has initializing state

  Scenario: The replay task modal replays the task correctly when skipping a connector
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "replay success" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    And The response "less connectors after replay" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I replay the first connector
    And I skip the second connector
    And I click on "Replay" button in the modal footer
    Then There is a confirmation for task being successfully replayed with second connector skipped
    And The failed task details page is refreshed
    When I click on "Close" button in the modal
    And There are no possible actions
    And The page has executing state

  Scenario: The replay task modal should display generic 500 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "500 during replay" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I replay the first connector
    And I replay the second connector
    When I click on "Replay" button in the modal footer
    Then I see "500" error message for "replayed"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    Then There is no modal displayed
    When I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"

  Scenario: The replay task modal should display generic 403 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "403 during replay" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I replay the first connector
    And I replay the second connector
    And I click on "Replay" button in the modal footer
    Then I see "403" error message for "replayed"
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"

  Scenario: The replay task modal should display generic 404 error message
    Given The response "empty done task" is defined for failed tasks
    And The response "default details" is defined for failed tasks
    And The response "404 during replay" is defined for failed tasks
    And The response "refresh task not called" is defined for failed tasks
    And The response "connectors" is defined for failed tasks
    When I visit the admin failed task details page
    And I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
    When I replay the first connector
    And I replay the second connector
    When I click on "Replay" button in the modal footer
    Then I see 404 error message when replaying task
    When I click on "Cancel" button in the modal
    Then There is no modal displayed
    When I click on "Replay" button
    Then The replay modal is open and has a default state for "1 failed task"
