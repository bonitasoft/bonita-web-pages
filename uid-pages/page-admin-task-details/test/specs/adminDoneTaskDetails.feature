Feature: The Admin Done Task Details in desktop resolution

  Scenario: The admin done task details displays the correct attributes
    Given The response "default details" is defined for done tasks
    When I visit the admin done task details page
    Then The done task details have the correct information

  Scenario: The admin done task details display comments correctly
    Given The response "default details" is defined for done tasks
    And The response "archived comments" is defined for done tasks
    When I visit the admin done task details page
    Then The state is "completed"
    And The input placeholder is "Comments cannot be added to archived cases"
    And The input placeholder is not "Type new comment"
    And The add comment button is "disabled"
