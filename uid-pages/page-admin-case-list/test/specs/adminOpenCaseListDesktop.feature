Feature: The admin open case list in desktop resolution

  Scenario: The admin open case list displays the correct attributes
    Given The filter response "default filter with headers" is defined for open cases
    When I visit the admin case list page
    Then The open case list have the correct information

  Scenario: The admin open case list is able to switch between tabs
    Given The filter response "default filter" is defined for open cases
    And The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    Then I see an open case list page
    When I click on "Archived cases" tab
    Then I see an archived case list page
    When I click on "Open cases" tab
    Then I see an open case list page

  Scenario: The admin open case list filtered by process name works correctly
    Given The filter response "default filter" is defined for open cases
    And The filter response "process name" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I put "Process" in "process name" filter field for open cases
    Then The long process name is displayed correctly
    When I click on "Process 1" in process dropdown
    Then The api call is made for "Process 1 (1.0)" for open cases
    And A list of "2" items is displayed
    When I clear the process name filter
    Then A list of "5" items is displayed
    When I put "Process" in "process name" filter field for open cases
    And I click on "Process 2" in process dropdown
    Then The api call is made for "Process 2 (1.0)" for open cases
    And No open cases are available

  Scenario: The open case id redirects to the case details correctly
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    And The go to case details button is disabled
    When I search "3001" in caseId input
    Then The go to case details button is enabled
    And The view case details button at top has correct href with "3001"

  Scenario: The view open case details button works correctly
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    And The view case details button in the list has correct href with "3001"

  Scenario: The admin open case list sort by works correctly
    Given The filter response "default filter" is defined for open cases
    And The filter response "sort by" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I put "Case ID (Asc)" in "sort by" filter field for open cases
    Then The api call is made for "Case ID (Asc)" for open cases
    When I put "Case ID (Desc)" in "sort by" filter field for open cases
    Then The api call is made for "Case ID (Desc)" for open cases
    When I put "Process name (Asc)" in "sort by" filter field for open cases
    Then The api call is made for "Process name (Asc)" for open cases
    When I put "Process name (Desc)" in "sort by" filter field for open cases
    Then The api call is made for "Process name (Desc)" for open cases
    When I put "Start date (Newest first)" in "sort by" filter field for open cases
    Then The api call is made for "Start date (Newest first)" for open cases
    When I put "Start date (Oldest first)" in "sort by" filter field for open cases
    Then The api call is made for "Start date (Oldest first)" for open cases

 Scenario: The admin open case list search by name works correctly
   Given The filter response "default filter" is defined for open cases
   And The filter response "search by name" is defined for open cases
   When I visit the admin case list page
   Then I see an open case list page
   And A list of "5" items is displayed
   When I put "Process" in "search" filter field for open cases
   Then The api call is made for "Process" for open cases
   When I erase the search filter
   When I put "&Special" in "search" filter field for open cases
   Then The api call is made for "&Special" for open cases
   When I erase the search filter
   Then A list of "5" items is displayed
   When I put "Search term with no match" in "search" filter field for open cases
   Then No open cases are available

  Scenario: The admin open case list filter by case states works correctly
    Given The filter response "default filter" is defined for open cases
    And The filter response "case state" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I put "With failures" in "case state" filter field for open cases
    Then The api call is made for "With failures" for open cases
    And A list of "3" items is displayed
    When I put "All states" in "case state" filter field for open cases
    And A list of "5" items is displayed

  Scenario: The refresh button works correctly for open cases
    Given The filter response "default filter" is defined for open cases
    And The filter response "refresh open case list" is defined for open cases
    And The viewport is bigger than usual
    When I visit the admin case list page
    Then A list of "10" items is displayed
    When I click on Load more open cases button
    Then A list of "20" items is displayed
    When I click on refresh
    Then A list of "10" items is displayed

  Scenario: The delete open case modal is opened and closed
    Given The filter response "refresh not called" is defined for open cases
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3001"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The delete open case modal deletes successfully
    Given The filter response "open case deletion success" is defined for open cases
    And The filter response "default filter" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3001"
    When I click on the "Delete" button in modal footer
    Then The deletion is successful
    And The open case list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of "4" items is displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3002"

  Scenario: The modal should display generic 403 error message
    Given The filter response "default filter" is defined for open cases
    And The filter response "403 during deletion" is defined for open cases
    And The filter response "refresh not called" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "403" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3001"

  Scenario: The modal should display generic 404 error message
    Given The filter response "default filter" is defined for open cases
    And The filter response "404 during deletion" is defined for open cases
    And The filter response "refresh not called" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "404" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3001"

  Scenario: The modal should display generic 500 error message
    Given The filter response "default filter" is defined for open cases
    And The filter response "500 during deletion" is defined for open cases
    And The filter response "refresh not called" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "500" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete open case modal is open and has a default state for "Delete case ID: 3001"

  Scenario: The view open case diagram button works correctly
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And A list of "5" items is displayed
    And The view open case diagram button in the list has correct href with "7724628355784275506"-"3001"

  Scenario: The tab parameter for open tab should be taken into account
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page with the following url parameters
       | tab | open |
    Then I see an open case list page

  Scenario: The tab parameter for unknownValue tab should be taken into account
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page with the following url parameters
       | tab | unknownValue |
    Then I see an open case list page

  Scenario: The caseStateFilter parameter for cases with error should be taken into account
    Given The filter response "open cases with errors" is defined for open cases
    When I visit the admin case list page with the following url parameters
       | caseStateFilter | error |
    Then The api call is made for open cases with errors

  Scenario: The caseStateFilter parameter for unknownValue should be taken into account
    Given The filter response "default filter" is defined for open cases
    When I visit the admin case list page with the following url parameters
       | caseStateFilter | unknownValue |
    Then The api call is made for the default request

 Scenario: The processId parameter should be taken into account
   Given The filter response "processId filter" is defined for open cases
   When I visit the admin case list page with the following url parameters
       | processId | 4778742813773463488 |
   Then The api call is made with processId filter
   And The process filter contains the name of the process from url

  Scenario: The processId parameter shouldn't be taken into account when the user selects a different process
    Given The filter response "processId filter" is defined for open cases
   When I visit the admin case list page with the following url parameters
       | processId | 4778742813773463488 |
    Then The api call is made with processId filter
    And The process filter contains the name of the process from url
    When I clear the process name filter
    And I put "Process" in "process name" filter field for open cases
    And I click on "Process 1" in process dropdown
    Then The api call is made with a different processId

  Scenario: The case visu button in open case list is not displayed when features does not exist
    Given The filter response "default filter without features" is defined for open cases
    When I visit the admin case list page
    Then I see an open case list page
    And There is no "case visu" button in the open case list

  Scenario: The open case list header is visible when there is no item displayed
    Given The filter response "process name" is defined for open cases
    When I visit the admin case list page
    Then The open case item header is displayed correctly
    And No open cases are available
    
  Scenario: The url search parameters are synchronized with the filters states
   Given The filter response "default filter" is defined for open cases
   And The filter response "process name" is defined for open cases
   When I visit the admin case list page
   And I click on "Archived cases" tab
   Then "tab" url parameter is set to "archived"
   When I click on "Open cases" tab
   Then "tab" url parameter is absent or empty
   And "caseStateFilter" url parameter is absent or empty
   And "processId" url parameter is absent or empty
   When I put "With failures" in "case state" filter field for open cases
   Then "caseStateFilter" url parameter is set to "error"
   When I put "All states" in "case state" filter field for open cases
   Then "caseStateFilter" url parameter is set to "allStates"
   When I put "Process" in "process name" filter field for open cases
   And I click on "Process 1" in process dropdown
   Then "processId" url parameter is set to "7724628355784275506"
   When I clear the process name filter
   Then "processId" url parameter is absent or empty

 Scenario: Open case admin page with valued url parameters for filters
   Given The filter response "default filter" is defined for open cases
   And The filter response "processId filter" is defined for open cases
   When I visit the admin case list page with the following url parameters
       | caseStateFilter | error               |
       | processId       | 4778742813773463488 |
   Then The process name filter is set to "Process 2"
   And The case state filter is set to "With failures"

  Scenario: Open case admin page with all filters in url
    Given The filter response "case list with all filters" is defined for open cases
    And The filter response "processId filter" is defined for open cases
    When I visit the admin case list page with the following url parameters
      | tab             | open                |
      | processId       | 4778742813773463488 |
      | sort            | ASC                 |
      | search          | Pool                |
      | caseStateFilter | error               |
    Then The API call is made with all filters
    And The process name filter is set to "Process 2"
    And The sort filter is set to "Case ID (Asc)"
    And The search filter is set to "Pool"
    And The case state filter is set to "With failures"
    