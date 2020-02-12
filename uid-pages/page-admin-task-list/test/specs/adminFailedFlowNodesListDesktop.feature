Feature: The failed flow nodes list in desktop resolution

  Scenario: The failed flow nodes list displays the correct attributes
    Given The filter response "default filter" is defined
    When I visit admin task list page
    Then The failed flow nodes list have the correct information
    And The failed flow nodes list have the correct item shown number

  Scenario: The failed flow nodes list filtered by process name works correctly
    Given The filter response "default filter" is defined
    And The filter response "process name" is defined
    When I visit admin task list page
    Then A list of "5" items is displayed
    When I put "generateRandomCases (1.0)" in "process name" filter field
    Then The api call is made for "generateRandomCases (1.0)"
    And A list of "3" items is displayed
    When I put "All processes (all versions)" in "process name" filter field
    Then A list of "5" items is displayed
    When I put "New vacation request with means of transportation (2.0)" in "process name" filter field
    Then The api call is made for "New vacation request with means of transportation (2.0)"
    And No failed flow nodes are available

  Scenario: The failed flow nodes list sort by works correctly
    Given The filter response "default filter" is defined
    And The filter response "sort by" is defined
    When I visit admin task list page
    Then A list of "5" items is displayed
    When I put "Flow node name (Asc)" in "sort by" filter field
    Then The api call is made for "Flow node name (Asc)"
    When I put "Flow node name (Desc)" in "sort by" filter field
    Then The api call is made for "Flow node name (Desc)"
    When I put "Failed on (Newest first)" in "sort by" filter field
    Then The api call is made for "Failed on (Newest first)"
    When I put "Failed on (Oldest first)" in "sort by" filter field
    Then The api call is made for "Failed on (Oldest first)"

  Scenario: The failed flow nodes list search by name works correctly
    Given The filter response "default filter" is defined
    And The filter response "search by name" is defined
    When I visit admin task list page
    Then A list of "5" items is displayed
    When I put "Alowscenario" in "search" filter field
    Then The api call is made for "Alowscenario"
    When I erase the search filter
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field
    Then No failed flow nodes are available

  Scenario: The failed flow node row has the correct link to flow node details
    Given The filter response "default filter" is defined
    When I visit admin task list page
    Then The more button has correct href with "60002"

  Scenario: Load more button works correctly
    And The filter response "enable load more" is defined
    When I visit admin task list page
    Then A list of "10" items is displayed
    When I click on Load more flow nodes button
    Then A list of "20" items is displayed
    When I click on Load more flow nodes button
    Then A list of "30" items is displayed
    When I click on Load more flow nodes button
    Then A list of "35" items is displayed
    And The load more flow nodes button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined
    When I visit admin task list page
    Then A list of "10" items is displayed
    When I click on Load more flow nodes button
    Then A list of "20" items is displayed
    When I click on Load more flow nodes button
    Then The load more flow nodes button is disabled

  Scenario: Loading should be displayed on page load
    When I visit admin task list page
    Then No failed flow nodes are available
    And The loading text is displayed