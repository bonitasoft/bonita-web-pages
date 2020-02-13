Feature: The user open case list in desktop resolution

  Scenario: The user case list is able to switch between tabs
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    Then A list of open cases is displayed
    When I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I click on "Open cases" tab
    Then A list of open cases is displayed

  Scenario: The user case list displays the correct attributes
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    Then The "open" cases have the correct information
    And The open case list have the correct item shown number
    When I click on "Archived cases" tab
    Then The "archived" cases have the correct information
    And The archived case list have the correct item shown number

  Scenario: The user open case list filter by process name works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The responses filtered by process name are defined for open cases
    And No open cases for "process name" are available response is defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I select "Another My Pool (1.0)" in "process name" filter for "open" cases
    Then I see only the filtered open cases by "process name"
    And I don't see the cases that are unmatched by the "process name" filter
    When I select "All processes (all versions)" in "process name" filter for "open" cases
    Then A list of open cases is displayed
    When I select "Cancel Vacation Request (1.0)" in "process name" filter for "open" cases
    Then No open cases are available

  Scenario: The user archived case list filter by process name works correctly
    Given A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The responses filtered by process name are defined for archived cases
    And No archived cases for "process name" are available response is defined
    When I visit the user case list page
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I select "Another My Pool (1.0)" in "process name" filter for "archived" cases
    Then I see only the filtered archived cases by "process name"
    And I don't see the cases that are unmatched by the "process name" filter
    When I select "All processes (all versions)" in "process name" filter for "archived" cases
    Then A list of archived cases is displayed
    When I select "Cancel Vacation Request (1.0)" in "process name" filter for "archived" cases
    Then No archived cases are available

  Scenario: The user open case list sort by works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And A list of open cases sorted by "openCasesSortedByCaseIdAsc" is available
    And A list of open cases sorted by "openCasesSortedByCaseIdDesc" is available
    And A list of open cases sorted by "openCasesSortedByProcessNameAsc" is available
    And A list of open cases sorted by "openCasesSortedByProcessNameDesc" is available
    And A list of open cases sorted by "openCasesSortedByStartDateNew" is available
    And A list of open cases sorted by "openCases" is available
    When I visit the user case list page
    Then A list of open cases is displayed
    When I select "Case ID (Asc)" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCasesSortedByCaseIdAsc" is displayed
    When I select "Case ID (Desc)" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCasesSortedByCaseIdDesc" is displayed
    When I select "Process name (Asc)" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCasesSortedByProcessNameAsc" is displayed
    When I select "Process name (Desc)" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCasesSortedByProcessNameDesc" is displayed
    When I select "Start date - newest first" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCasesSortedByStartDateNew" is displayed
    When I select "Start date - oldest first" in "open cases sort by" filter for "open" cases
    Then A list of open cases sorted by "openCases" is displayed

  Scenario: The user archived case list sort by works correctly
    Given A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdAsc" is available
    And A list of archived cases sorted by "archivedCasesSortedByOriginalCaseIdDesc" is available
    And A list of archived cases sorted by "archivedCasesSortedByProcessNameAsc" is available
    And A list of archived cases sorted by "archivedCasesSortedByProcessNameDesc" is available
    And A list of archived cases sorted by "archivedCasesSortedByStartDateNew" is available
    And A list of archived cases sorted by "archivedCases" is available
    And A list of archived cases sorted by "archivedCasesSortedByEndDateNew" is available
    And A list of archived cases sorted by "archivedCasesSortedByEndDateOld" is available
    When I visit the user case list page
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
    When I select "Start date - newest first" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByStartDateNew" is displayed
    When I select "Start date - oldest first" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCases" is displayed
    When I select "End date - newest first" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByEndDateNew" is displayed
    When I select "End date - oldest first" in "archived cases sort by" filter for "archived" cases
    Then A list of archived cases sorted by "archivedCasesSortedByEndDateOld" is displayed

  Scenario: Search by process name and search keys works correctly for open cases
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses search are defined for open cases
    And No open cases for "search" are available response is defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I search "Pool3" in search filter
    Then I see only the filtered open cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    And I erase the search filter
    When I search "Long Search Value 5" in search filter
    Then I see only the filtered open cases by "search"
    And I don't see the cases that are unmatched by the "search" filter
    And I erase the search filter
    When I search "Incorrect" in search filter
    Then No open cases are available

  Scenario: Search by process name and search keys works correctly for archived cases
    Given A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses search are defined for archived cases
    And No archived cases for "search" are available response is defined
    When I visit the user case list page
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
    Then No archived cases are available

  Scenario: Show open cases only started by me works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter response only started by me is defined for open cases
    When I visit the user case list page
    Then A list of open cases is displayed
    When I filter only started by me
    Then I see only the filtered open cases by "started by me"
    And I don't see the cases that are unmatched by the "started by me" filter

  Scenario: Show archived cases only started by me works correctly
    Given A list of archived cases is available
    And A user session is available
    And A list of processes is available
    And The filter response only started by me is defined for archived cases
    When I visit the user case list page
    And I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I filter only started by me
    Then I see only the filtered archived cases by "started by me"
    And I don't see the cases that are unmatched by the "started by me" filter

  Scenario: Load more open cases button works correctly
    Given A list of open cases with several pages is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    Then A list of "10" cases is displayed
    When I click on Load more cases button
    Then A list of "20" cases is displayed
    When I click on Load more cases button
    Then A list of "25" cases is displayed
    And The Load more cases button is disabled

  Scenario: Load more archived cases button works correctly
    Given A list of archived cases with several pages is available
    And A list of open cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    And I click on "Archived cases" tab
    Then A list of "10" cases is displayed
    When I click on Load more cases button
    Then A list of "20" cases is displayed
    When I click on Load more cases button
    Then A list of "24" cases is displayed
    And The Load more cases button is disabled

  Scenario: The refresh button works correctly for open cases
    Given A list of open cases with several pages is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    Then A list of "10" cases is displayed
    When I click on Load more cases button
    Then A list of "20" cases is displayed
    When I click on refresh
    Then A list of "10" cases is displayed

  Scenario: The refresh button works correctly for archived cases
    Given A list of archived cases with several pages is available
    And A list of open cases is available
    And A user session is available
    And A list of processes is available
    When I visit the user case list page
    And I click on "Archived cases" tab
    Then A list of "10" cases is displayed
    When I click on Load more cases button
    Then A list of "20" cases is displayed
    When I click on refresh
    Then A list of "10" cases is displayed

  Scenario: Loading should be displayed on page load
    When I visit the user case list page
    Then No open cases are available
    And The loading text is displayed