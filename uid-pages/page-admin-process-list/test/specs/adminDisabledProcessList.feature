Feature: The disabled process list in desktop resolution

  Scenario: The disabled process list displays the correct attributes
    Given The filter response "default filter" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then The disabled process list have the correct information
    And The disabled process list have the correct item shown number

  Scenario: The disabled process list filtered by state works correctly
    Given The filter response "default filter" is defined for disabled processes
    And The filter response "state" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then A list of "5" items is displayed
    When I put "Resolved only" in "state" filter field in disabled processes list
    Then The api call is made for "Resolved only" processes
    And A list of "3" items is displayed
    When I put "Resolved and unresolved" in "state" filter field in disabled processes list
    And A list of "5" items is displayed
