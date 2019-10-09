Feature: The user open case list in desktop resolution

  Scenario: The user case list is able to switch between tabs
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    When I visit the user case list page
    Then A list of open cases is displayed
    When I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I click on "Open cases" tab
    Then A list of open cases is displayed

  Scenario: The user case list displays the correct Ids
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    When I visit the user case list page
    Then The "open" cases have the correct information
    When I click on "Archived cases" tab
    Then The "archived" cases have the correct information

  Scenario: The user case list filter by process name works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses process name are defined
    And No cases for "process name" are available response is defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I select "Another My Pool" in "process name" filter
    Then I see only the filtered open cases by "process name"
    And I don't see the cases that are unmatched by the "process name" filter
    When I select "All processes" in "process name" filter
    Then A list of open cases is displayed
    When I select "Cancel Vacation Request" in "process name" filter
    Then No cases are available

  Scenario: The user case list sort by works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses sort by are defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I select "Start date - newest first" in "sort by" filter
    Then I see the cases sorted by "Start date - newest first"
    When I select "Start date - oldest first" in "sort by" filter
    Then I see the cases sorted by "Start date - oldest first"
    When I select "Process name (Asc)" in "sort by" filter
    Then I see the cases sorted by "Process name (Asc)"
    When I select "Process name (Desc)" in "sort by" filter
    Then I see the cases sorted by "Process name (Desc)"

  Scenario: Search by process name and search keys works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses search are defined
    And No cases for "search" are available response is defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I search "Pool3" in "search" filter
    Then I see only the filtered open cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    When I search "Long Search Value 5" in "search" filter
    Then I see only the filtered open cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    When I search "Incorrect process name" in "search" filter
    Then No cases are available

  Scenario: Show cases only started by me works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter response only started by me is defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I filter only started by me
    Then I see only the filtered open cases by "started by me"
    And I don't see the cases that are unmatched by the "started by me" filter