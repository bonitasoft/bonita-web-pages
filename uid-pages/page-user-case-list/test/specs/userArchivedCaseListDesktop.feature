Feature: The user archived case list in desktop resolution

  Scenario: The user case list displays the correct attributes for archived cases
    Given A list of no open cases is available
    And A list of archived cases with headers is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then The "archived" cases have the correct information
    And The archived case list have the correct item shown number

  Scenario: The user archived case list filter by process name works correctly
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The responses filtered by process name are defined for archived cases
    And No archived cases for "process name" are available response is defined
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I select "Another My Pool (1.0)" in "process name" filter for "archived" cases
    Then I see only the filtered archived cases by "process name"
    And I don't see the cases that are unmatched by the "process name" filter
    When I select "All processes (all versions)" in "process name" filter for "archived" cases
    Then A list of filtered archived cases is displayed
    When I select "Cancel Vacation Request (1.0)" in "process name" filter for "archived" cases
    Then No cases are available

  Scenario: The user archived case list sort by works correctly
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdAsc" is available
    And A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdDesc" is available
    And A list of archived cases sorted by "archivedCasesSortedByProcessNameAsc" is available
    And A list of archived cases sorted by "archivedCasesSortedByProcessNameDesc" is available
    And A list of archived cases sorted by "archivedCasesSortedByStartDateNew" is available
    And A list of archived cases sorted by "archivedCasesSortedByStartDateOld" is available
    And A list of archived cases sorted by "archivedCasesSortedByEndDateNew" is available
    And A list of archived cases sorted by "archivedCasesSortedByEndDateOld" is available
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I select "Original case ID (Asc)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdAsc" is displayed
    When I select "Original case ID (Desc)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdDesc" is displayed
    When I select "Process name (Asc)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByProcessNameAsc" is displayed
    When I select "Process name (Desc)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByProcessNameDesc" is displayed
    When I select "Start date (Newest first)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByStartDateNew" is displayed
    When I select "Start date (Oldest first)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByStartDateOld" is displayed
    When I select "End date (Newest first)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByEndDateNew" is displayed
    When I select "End date (Oldest first)" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByEndDateOld" is displayed

  Scenario: Search by process name and search keys works correctly for archived cases
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses search are defined for archived cases
    And No archived cases for "search" are available response is defined
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I search "Pool3" in search filter
    Then I see only the filtered archived cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    And I erase the search filter
    When I search "Long Search Value 5" in search filter
    Then I see only the filtered archived cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    And I erase the search filter
    When I search "Incorrect" in search filter
    Then No cases are available

  Scenario: The view archived case details button works correctly
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    And The view case details button in the list has correct href with "1004"

  Scenario: The archived case id redirect to the case details correctly
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    And The go to case details button is disabled
    When I search "1004" in caseId input
    Then The go to case details button is enabled
    And The view case details button at top has correct href with "1004"

  Scenario: Show archived cases only started by me works correctly
    Given A list of no open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The filter response only started by me is defined for archived cases
    When I visit the user case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I filter only started by me
    Then I see only the filtered archived cases by "started by me"
    And I don't see the cases that are unmatched by the "started by me" filter

  Scenario: The refresh button works correctly for archived cases
    Given A list of archived cases with several pages is available
    And A list of open cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    Then A list of open cases is displayed
    When I click on "Archived cases" tab
    Then A list of "10" cases is displayed
    When I click on Load more cases button
    Then A list of "20" cases is displayed
    When I click on refresh
    Then A list of "10" cases is displayed