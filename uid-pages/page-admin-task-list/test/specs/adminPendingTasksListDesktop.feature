Feature: The pending tasks list in desktop resolution

  Scenario: The pending tasks list displays the correct attributes
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    Then I see the failed flow nodes page
    When I click on "Pending tasks" tab
    Then The pending tasks list have the correct information

  Scenario: The pending tasks list sort by works correctly
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "sort by" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    When I put "Display name (Asc)" in "sort by" filter field for pending tasks
    Then The api call is made for "Display name (Asc)" for pending tasks
    When I put "Display name (Desc)" in "sort by" filter field for pending tasks
    Then The api call is made for "Display name (Desc)" for pending tasks
    When I put "Due date (Closest first)" in "sort by" filter field for pending tasks
    Then The api call is made for "Due date (Closest first)" for pending tasks
    When I put "Due date (Furthest first)" in "sort by" filter field for pending tasks
    Then The api call is made for "Due date (Furthest first)" for pending tasks
    When I put "Priority (Lowest - Highest)" in "sort by" filter field for pending tasks
    Then The api call is made for "Priority (Lowest - Highest)" for pending tasks
    When I put "Priority (Highest - Lowest)" in "sort by" filter field for pending tasks
    Then The api call is made for "Priority (Highest - Lowest)" for pending tasks

  Scenario: Load more button has the correct text
    Given The filter response "default filter" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    And The load more button has the correct text

  Scenario: No pending task display correctly
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then No pending tasks are available

  Scenario: The overdue date decorator displays correctly
    Given The filter response "default filter" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    And "3" items in the list are overdue

