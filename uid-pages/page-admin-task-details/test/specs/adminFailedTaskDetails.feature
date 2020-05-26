Feature: The Admin Failed Task Details in desktop resolution

#  Scenario: The admin task details displays the correct attributes for failed tasks
#    Given The response "default details" is defined for failed tasks
#    When I visit the admin failed task details page
#    Then The failed task details have the correct information
#
#  Scenario: The admin task details has the correct link to task list
#    Given The response "default details" is defined for failed tasks
#    When I visit the admin failed task details page
#    Then The back button has correct href
#
#  Scenario: The admin failed task details display comments correctly
#    Given The response "default details" is defined for failed tasks
#    And The response "comments" is defined for failed tasks
#    When I visit the admin failed task details page
#    Then The comments have the correct information
#    And "No (more) comments to display" is shown at the end of the comments
#    And There is no "System comment"
#
#  Scenario: The admin failed task details should add a new comment
#    Given The response "default details" is defined for failed tasks
#    And The response "comments" is defined for failed tasks
#    And The response "add new comment" is defined for failed tasks
#    When I visit the admin failed task details page
#    Then The comments have the correct information
#    And The add comment button is "disabled"
#    When I fill in the new comment
#    Then The add comment button is "enabled"
#    When I click on add comment button
#    Then There is a new comment
#    And The new comment input is empty
#    Then The add comment button is "disabled"

  Scenario: The admin failed task details displays the connectors correctly
    Given The response "default details" is defined for failed tasks
    And The response "failed connectors" is defined for failed tasks
    And The response "to be executed connectors" is defined for failed tasks
    And The response "executed connectors" is defined for failed tasks
    When I visit the admin failed task details page
    Then The connectors section have the correct information