Feature: The pending tasks list in desktop resolution

  Scenario: The pending tasks list displays the correct attributes
    Given The filter response "default filter with headers" is defined for pending tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    Then I see the failed flow nodes page
    When I click on "Pending tasks" tab
    Then The pending tasks list have the correct information
    And The pending tasks list have the correct item shown number

  Scenario: Switching between tabs works correctly
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    Then I see the failed flow nodes page
    When I click on "Pending tasks" tab
    Then I see the pending tasks page
    When I click on "Failed flow nodes" tab
    Then I see the failed flow nodes page

  Scenario: The pending tasks list filtered by process name works correctly
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "process name" is defined for pending tasks
    When I visit admin task list page
    When I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    When I put "generateRandomCases (1.0)" in "process name" filter field for pending tasks
    Then The api call is made for "generateRandomCases (1.0)" for pending tasks
    And A list of "3" items is displayed
    When I put "All processes (all versions)" in "process name" filter field for pending tasks
    Then A list of "5" items is displayed
    When I put "New vacation request with means of transportation (2.0)" in "process name" filter field for pending tasks
    Then The api call is made for "New vacation request with means of transportation (2.0)" for pending tasks
    And No pending tasks are available

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

  Scenario: The pending tasks list search by name works correctly
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "search by name" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    When I put "InvolveUser" in "search" filter field for pending tasks
    Then The api call is made for "InvolveUser" for pending tasks
    When I erase the search filter
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field for pending tasks
    Then No pending tasks are available

  Scenario: The refresh button works correctly for done tasks
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "enable load more" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more pending tasks button
    Then A list of "20" items is displayed
    When I click on refresh
    Then A list of "10" items is displayed

  Scenario: The pending tasks row has the correct link to pending task details
    Given The filter response "default filter" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then The more button has correct href with "100227"

  Scenario: Load more button works correctly
    And The filter response "enable load more" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "10" pending tasks is displayed out of "35"
    When I click on Load more pending tasks button
    Then A list of "20" pending tasks is displayed out of "35"
    When I click on Load more pending tasks button
    Then A list of "30" pending tasks is displayed out of "35"
    When I click on Load more pending tasks button
    Then A list of "35" pending tasks is displayed out of "35"
    And The load more pending tasks button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more pending tasks button
    Then A list of "20" items is displayed
    And The load more pending tasks button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The filter response "enable 30 load more" is defined for pending tasks
    And The filter response "sort during limitation" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more pending tasks button
    Then A list of "20" items is displayed
    When I click on Load more pending tasks button
    Then A list of "30" items is displayed
    And The load more pending tasks button is disabled
    When I put "Display name (Desc)" in "sort by" filter field for pending tasks
    Then A list of "10" items is displayed
    When I click on Load more pending tasks button
    Then A list of "20" items is displayed

  Scenario: Load more button has the correct text
    Given The filter response "default filter" is defined for pending tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    And The load more button has the correct text

  Scenario: No pending task display correctly
    Given The filter response "default filter" is defined
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then No pending tasks are available

  Scenario: The overdue date decorator displays correctly
    Given The filter response "default filter" is defined for pending tasks
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then A list of "5" items is displayed
    And "3" items in the list are overdue

  Scenario: The pending task list search by caseId works correctly
    Given The filter response "filter by caseId" is defined for pending tasks
    When I visit admin task list page with caseId "2001" in URL parameter
    And I click on "Pending tasks" tab
    Then The api call is made for "2001" for pending tasks
    When I erase the caseId filter
    And I put "3001" in "caseId" filter field for pending tasks
    Then The api call is made for "3001" for pending tasks

  Scenario: The failed flow nodes list process filter is disabled
    Given The filter response "empty process list" is defined
    When I visit admin task list page
    And I click on "Pending tasks" tab
    Then The filter by process is disabled