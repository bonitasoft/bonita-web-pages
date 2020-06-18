Feature: The Admin Pending Task Details in desktop resolution

#  Scenario: The admin task details displays the correct attributes for pending tasks
#    Given The response "empty done task" is defined for pending tasks
#    And The response "default details" is defined for pending tasks
#    When I visit the admin pending task details page
#    Then The pending task details have the correct information
#
#  Scenario: The admin pending task details displays the connectors correctly
#    Given The response "empty done task" is defined for pending tasks
#    And The response "default details" is defined for pending tasks
#    When I visit the admin pending task details page
#    Then The connectors section have the correct information for pending tasks

  Scenario: The assign task modal is opened and closed
    Given The response "empty done task" is defined for pending tasks
    And The response "refresh task not called" is defined for pending tasks
    And The response "default unassigned details" is defined for pending tasks
    When I visit the admin pending task details page
    And I click on assign button
    Then The assign modal is open and has a default state for "Request Vacation"
    When I click on the cancel button
    Then The assign modal is closed

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
    Then The assign modal is closed
    And The api call has the correct user id
    And The page is refreshed
    And The unassign button is displayed
    And The assign button is not displayed


      ### Dropdown not displayed when modal opens
      ### Dropdown that shows when things are typed
      ### When we click on 1 of the names, the dropdown disappears
      ### When we click on 1 of the names, the input will have the name
      ### When we click on assign, the api call has the correct user Id
      ### When we click on assign, the task is refreshed
      ### The Assign button is hidden and unassign is displayed after assign
      ### When input field is cleared no dropdown is shown and assign button disabled
      ### Api call changes when we type a different
      ### When the modal is re-opened, the default information is displayed
