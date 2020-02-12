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

