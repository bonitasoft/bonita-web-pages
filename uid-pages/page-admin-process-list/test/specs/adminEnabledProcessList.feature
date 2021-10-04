Feature: The enabled process list in desktop resolution

  Scenario: The enabled process list displays the correct attributes
    Given The page response "default filter with headers" is defined
    And The page response "disabled process api is not called" is defined
    When I visit admin process list page
    Then The enabled process list have the correct information

  Scenario: The enabled process list filtered by state works correctly
    Given The page response "default filter with headers" is defined
    And The page response "state" is defined
    When I visit admin process list page
    Then A list of "5" items is displayed
    When I put "Resolved only" in "state" filter field
    Then A list of "3" items is displayed
    When I put "Resolved and unresolved" in "state" filter field
    And A list of "5" items is displayed

  Scenario: The enabled process list sort by works correctly
    Given The page response "default filter with headers" is defined
    And The page response "sort by" is defined
    When I visit admin process list page
    Then A list of "5" items is displayed
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Display name (Asc)" in "sort by" filter field
    Then The api call is made for "Display name (Asc)"
    When I put "Display name (Desc)" in "sort by" filter field
    Then The api call is made for "Display name (Desc)"
    When I put "Version (Asc)" in "sort by" filter field
    Then The api call is made for "Version (Asc)"
    When I put "Version (Desc)" in "sort by" filter field
    Then The api call is made for "Version (Desc)"
    When I put "Installed on (Newest first)" in "sort by" filter field
    Then The api call is made for "Installed on (Newest first)"
    When I put "Installed on (Oldest first)" in "sort by" filter field
    Then The api call is made for "Installed on (Oldest first)"
    When I put "Updated on (Newest first)" in "sort by" filter field
    Then The api call is made for "Updated on (Newest first)"
    When I put "Updated on (Oldest first)" in "sort by" filter field
    Then The api call is made for "Updated on (Oldest first)"

  Scenario: The enabled process list search by name, display name or version works correctly
    Given The page response "default filter with headers" is defined
    And The page response "search" is defined
    When I visit admin process list page
    Then A list of "5" items is displayed
    When I put "Pool3" in "search" filter field
    Then The api call is made for "Pool3"
    When I erase the search filter
    When I put "New" in "search" filter field
    Then The api call is made for "New"
    When I erase the search filter
    When I put "1.0" in "search" filter field
    Then The api call is made for "1.0"
    When I erase the search filter
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field
    Then No enabled processes are available

  Scenario: The disable process modal is displayed and closed
    Given The page response "default filter with headers" is defined
    When I visit admin process list page
    And I click on "ban-circle" button on the item "1"
    Then The "Disable" process modal is displayed for "VacationRequest (2.0)"
    When I click on "Cancel" button in the modal
    Then The modal is closed

  Scenario: The disable process modal should disable a process
    Given The page response "default filter with headers" is defined
    And The page response "disable process" is defined
    When I visit admin process list page
    And I click on "ban-circle" button on the item "1"
    Then The "Disable" process modal is displayed for "VacationRequest (2.0)"
    And The correct text is shown in disable modal
    When I click on disable button in modal
    Then The api call is made for "refresh list"
    When I click on "Close" button in the modal
    And The modal is closed

  Scenario: The disable process modal should display 500 error message
    Given The page response "default filter with headers" is defined
    And The page response "disable state code 500" is defined
    And The page response "refresh not called" is defined
    When I visit admin process list page
    Then A list of "5" items is displayed
    And I click on "ban-circle" button on the item "1"
    And I click on disable button in modal
    Then I see "500" error message
    When I click on "Cancel" button in the modal
    Then The modal is closed
    When I click on "ban-circle" button on the item "1"
    Then The correct text is shown in disable modal

  Scenario: The disable process modal should display 403 error message
    Given The page response "default filter with headers" is defined
    And The page response "disable state code 403" is defined
    When I visit admin process list page
    And I click on "ban-circle" button on the item "1"
    And I click on disable button in modal
    Then I see "403" error message
    When I click on "Cancel" button in the modal
    And I click on "ban-circle" button on the item "1"
    Then The correct text is shown in disable modal

  Scenario: The disable process modal should display disabling
    Given The page response "default filter with headers" is defined
    And The page response "delay disable" is defined
    When I visit admin process list page
    And I click on "ban-circle" button on the item "1"
    And I click on disable button in modal
    Then I see disabling message
    When I click on "Cancel" button in the modal
    And I click on "ban-circle" button on the item "1"
    Then The correct text is shown in disable modal

  Scenario: The refresh button works correctly
    Given The page response "refresh enabled process list" is defined
    When I visit admin process list page
    And I click on refresh button
    Then The api call is made for "refresh enabled process list"

  Scenario: The install modal is displayed and closed
    When I visit admin process list page
    And I click on install button in the page
    Then The modal "Install" button is disabled
    When I click on "Cancel" button in the modal
    Then The modal is closed