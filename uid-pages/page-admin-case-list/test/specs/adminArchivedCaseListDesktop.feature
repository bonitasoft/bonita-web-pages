Feature: The admin archived case list in desktop resolution

  Scenario: The admin archived case list displays the correct attributes
    Given The filter response "no open cases" is defined for open cases
    And The filter response "default filter with headers" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then The archived case list have the correct information

  Scenario: The admin archived case list is able to switch between tabs
    Given The filter response "default filter" is defined for open cases
    And The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I click on "Archived cases" tab
    Then I see an archived case list page
    When I click on "Open cases" tab
    Then I see an open case list page
    When I click on "Archived cases" tab
    Then I see an archived case list page

  Scenario: The admin archived case list filtered by process name works correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "process name" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I put "Process 1 (1.0)" in "process name" filter field for archived cases
    Then The api call is made for "Process 1 (1.0)" for archived cases
    And A list of "3" items is displayed
    When I put "All processes (all versions)" in "process name" filter field for archived cases
    Then A list of "5" items is displayed
    When I put "Process 2 (1.0)" in "process name" filter field for archived cases
    Then The api call is made for "Process 2 (1.0)" for archived cases
    And No archived cases are available

  Scenario: The archived case id redirects to the case details correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    And The go to case details button is disabled
    When I search "6071" in caseId input
    Then The go to case details button is enabled
    And The view case details button at top has correct href with "6071"

  Scenario: The view archived case details button works correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    And The view case details button in the list has correct href with "2042"

  Scenario: The admin archived case list sort by works correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "sort by" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I put "Case ID (Asc)" in "sort by" filter field for archived cases
    Then The api call is made for "Case ID (Asc)" for archived cases
    When I put "Case ID (Desc)" in "sort by" filter field for archived cases
    Then The api call is made for "Case ID (Desc)" for archived cases
    When I put "Process name (Asc)" in "sort by" filter field for archived cases
    Then The api call is made for "Process name (Asc)" for archived cases
    When I put "Process name (Desc)" in "sort by" filter field for archived cases
    Then The api call is made for "Process name (Desc)" for archived cases
    When I put "Start date (Newest first)" in "sort by" filter field for archived cases
    Then The api call is made for "Start date (Newest first)" for archived cases
    When I put "Start date (Oldest first)" in "sort by" filter field for archived cases
    Then The api call is made for "Start date (Oldest first)" for archived cases

  Scenario: The admin archived case list search by name works correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "search by name" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I put "Process" in "search" filter field for archived cases
    Then The api call is made for "Process" for archived cases
    When I erase the search filter
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field for archived cases
    Then No archived cases are available

  Scenario: The refresh button works correctly for archived cases
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "refresh archived case list" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "10" items is displayed
    When I click on Load more archived cases button
    Then A list of "20" items is displayed
    When I click on refresh
    Then A list of "10" items is displayed

  Scenario: No archived cases display correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "no archived case" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then No archived cases are available

  Scenario: The delete archived case modal is opened and closed
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "refresh not called" is defined for archived cases
    And The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2042"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The delete open case modal deletes successfully
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "archived case deletion success" is defined for archived cases
    And The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2042"
    When I click on the "Delete" button in modal footer
    Then The deletion is successful
    And The archived case list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of "4" items is displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2048"

  Scenario: The modal should display generic 403 error message
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "403 during deletion" is defined for archived cases
    And The filter response "refresh not called" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "403" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2042"

  Scenario: The modal should display generic 404 error message
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "404 during deletion" is defined for archived cases
    And The filter response "refresh not called" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "404" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2042"

  Scenario: The modal should display generic 500 error message
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    And The filter response "500 during deletion" is defined for archived cases
    And The filter response "refresh not called" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    When I click on delete button for first case
    When I click on the "Delete" button in modal footer
    Then I see "500" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first case
    Then The delete archived case modal is open and has a default state for "Delete case ID: 2042"

  Scenario: The view archived case diagram button works correctly
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    When I visit the admin case list page
    And I wait for no open cases api call
    And I click on "Archived cases" tab
    Then A list of "5" items is displayed
    And The view archived case diagram button in the list has correct href with "6680445060902959515"-"6071"

  Scenario: The tab parameter for archived tab should be taken into account
    Given The filter response "no open cases" is defined for open cases
    And  The filter response "default filter" is defined for archived cases
    When I visit the admin case list page with "archived" tab query parameter
    Then I see an archived case list page