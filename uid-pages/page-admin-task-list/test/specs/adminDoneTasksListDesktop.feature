Feature: The done tasks list in desktop resolution

  Scenario: The done tasks list displays the correct attributes
    Given The filter response "default filter" is defined for done tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    Then I see the failed flow nodes page
    When I click on "Done tasks" tab
    Then The done tasks list have the correct information
    And The done tasks list have the correct item shown number

  Scenario: Switching between tabs works correctly
    Given The filter response "default filter" is defined for done tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    Then I see the failed flow nodes page
    When I click on "Done tasks" tab
    Then I see the done tasks page
    When I click on "Failed flow nodes" tab
    Then I see the failed flow nodes page

  Scenario: The done tasks list filtered by process name works correctly
    Given The filter response "default filter" is defined for done tasks
    And The filter response "process name" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "5" items is displayed
    When I put "generateRandomCases (1.0)" in "process name" filter field for done tasks
    Then The api call is made for "generateRandomCases (1.0)" for done tasks
    And A list of "3" items is displayed
    When I put "All processes (all versions)" in "process name" filter field for done tasks
    Then A list of "5" items is displayed
    When I put "New vacation request with means of transportation (2.0)" in "process name" filter field for done tasks
    Then The api call is made for "New vacation request with means of transportation (2.0)" for done tasks
    And No done tasks are available

  Scenario: The done tasks list sort by works correctly
    Given The filter response "default filter" is defined for done tasks
    And The filter response "sort by" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "5" items is displayed
    When I put "Original ID (Asc)" in "sort by" filter field for done tasks
    Then The api call is made for "Original ID (Asc)" for done tasks
    When I put "Original ID (Desc)" in "sort by" filter field for done tasks
    Then The api call is made for "Original ID (Desc)" for done tasks
    When I put "Priority (Lowest - Highest)" in "sort by" filter field for done tasks
    Then The api call is made for "Priority (Lowest - Highest)" for done tasks
    When I put "Priority (Highest - Lowest)" in "sort by" filter field for done tasks
    Then The api call is made for "Priority (Highest - Lowest)" for done tasks
    When I put "Display name (Asc)" in "sort by" filter field for done tasks
    Then The api call is made for "Display name (Asc)" for done tasks
    When I put "Display name (Desc)" in "sort by" filter field for done tasks
    Then The api call is made for "Display name (Desc)" for done tasks
    When I put "Done on (Newest first)" in "sort by" filter field for done tasks
    Then The api call is made for "Done on (Newest first)" for done tasks
    When I put "Done on (Oldest first)" in "sort by" filter field for done tasks
    Then The api call is made for "Done on (Oldest first)" for done tasks
    When I put "Case ID (Asc)" in "sort by" filter field for done tasks
    Then The api call is made for "Case ID (Asc)" for done tasks
    When I put "Case ID (Desc)" in "sort by" filter field for done tasks
    Then The api call is made for "Case ID (Desc)" for done tasks

  Scenario: The done tasks list search by name works correctly
    Given The filter response "default filter" is defined for done tasks
    And The filter response "search by name" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "5" items is displayed
    When I put "Alowscenario" in "search" filter field for done tasks
    Then The api call is made for "Alowscenario" for done tasks
    When I erase the search filter
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field for done tasks
    Then No done tasks are available

  Scenario: The done tasks row has the correct link to flow node details
    Given The filter response "default filter" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then The more button has correct href with "140081" for done tasks

  Scenario: Load more button works correctly
    Given The filter response "enable load more" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more tasks button
    Then A list of "20" items is displayed
    When I click on Load more tasks button
    Then A list of "30" items is displayed
    When I click on Load more tasks button
    Then A list of "35" items is displayed
    And The load more tasks button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more tasks button
    Then A list of "20" items is displayed
    And The load more tasks button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The filter response "enable 30 load more" is defined for done tasks
    And The filter response "sort during limitation" is defined for done tasks
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "10" items is displayed
    When I click on Load more tasks button
    Then A list of "20" items is displayed
    When I click on Load more tasks button
    Then A list of "30" items is displayed
    And The load more tasks button is disabled
    When I put "Display name (Desc)" in "sort by" filter field for done tasks
    Then A list of "10" items is displayed
    When I click on Load more tasks button
    Then A list of "20" items is displayed

  Scenario: Load more button has the correct text
    Given The filter response "default filter" is defined for done tasks
    And The filter response "default filter" is defined
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then A list of "5" items is displayed
    And The load more button has the correct text

  Scenario: No done task display correctly
    Given The filter response "default filter" is defined
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then No done tasks are available

  Scenario: The done task list search by caseId works correctly
    Given The filter response "filter by caseId" is defined for done tasks
    When I visit admin task list page with caseId "2001" in URL parameter
    Then The api call is made for "2001" for done tasks
    When I erase the caseId filter
    And I put "3001" in "caseId" filter field for done tasks
    Then The api call is made for "3001" for done tasks

  Scenario: The failed flow nodes list process filter is disabled
    Given The filter response "empty process list" is defined
    When I visit admin task list page
    And I click on "Done tasks" tab
    Then The filter by process is disabled