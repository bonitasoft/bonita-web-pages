Feature: The Admin Pending Task Details in desktop resolution

  Scenario: The admin task details displays the correct attributes for pending tasks
    Given The response "default details" is defined for pending tasks
    When I visit the admin pending task details page
    Then The pending task details have the correct information

