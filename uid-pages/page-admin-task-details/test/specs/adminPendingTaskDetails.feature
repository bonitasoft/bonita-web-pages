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
    Then The assign modal is open and has a default state
    When I click on the cancel button
    Then The assign modal is closed
    And The task is not refreshed

      ### Dropdown not displayed when modal opens
      ### Dropdown that shows when things are typed
      ### When we click on 1 of the names, the dropdown disappears
      ### When we click on 1 of the names, the input will have the name
      ### When we click on assign, the api call has the correct user Id
      ### When we click on assign, the task is refreshed
      ### The Assign button is hidden and unassign is displayed after assign
      ### When input field is cleared no dropdown is shown and assign button disabled
      ### Api call changes when we type a different
