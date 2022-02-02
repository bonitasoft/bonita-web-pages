Feature: The disabled process list in desktop resolution

  Scenario: The disabled process list displays the correct attributes
    Given The page response "default filter with headers" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then The disabled process list have the correct information

  Scenario: The disabled process list filtered by state works correctly
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "state" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then A list of "5" items is displayed
    When I put "Resolved only" in "state" filter field in disabled processes list
    Then The api call is made for "Resolved only" processes
    And A list of "3" items is displayed
    When I put "Resolved and unresolved" in "state" filter field in disabled processes list
    And A list of "5" items is displayed

  Scenario: The disabled process list sort by works correctly
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "sort by" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then A list of "5" items is displayed
    When I put "Name (Asc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Name (Asc)" processes
    When I put "Name (Desc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Name (Desc)" processes
    When I put "Display name (Asc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Display name (Asc)" processes
    When I put "Display name (Desc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Display name (Desc)" processes
    When I put "Version (Asc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Version (Asc)" processes
    When I put "Version (Desc)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Version (Desc)" processes
    When I put "Installed on (Newest first)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Installed on (Newest first)" processes
    When I put "Installed on (Oldest first)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Installed on (Oldest first)" processes
    When I put "Updated on (Newest first)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Updated on (Newest first)" processes
    When I put "Updated on (Oldest first)" in "sort by" filter field in disabled processes list
    Then The api call is made for "Updated on (Oldest first)" processes

  Scenario: The disabled process list search by name, display name or version works correctly
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "search" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then A list of "5" items is displayed
    When I put "VacationRequest" in "search" filter field in disabled processes list
    Then The api call is made for "VacationRequest" processes
    When I erase the search filter in disabled processes list
    When I put "New" in "search" filter field in disabled processes list
    Then The api call is made for "New" processes
    When I erase the search filter in disabled processes list
    When I put "1.0" in "search" filter field in disabled processes list
    Then The api call is made for "1.0" processes
    When I erase the search filter in disabled processes list
    Then A list of "5" items is displayed
    When I put "Search term with no match" in "search" filter field in disabled processes list
    Then No disabled processes are available

  Scenario: The enable process modal is displayed and closed
    Given The page response "default filter with headers" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    Then The "Enable" process modal is displayed for "Pool 1 (1.0)"
    And The correct text is shown in enable modal
    When I click on "Cancel" button in the modal
    Then The modal is closed

  Scenario: The enable process modal should enable a process
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "enable process" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    Then The "Enable" process modal is displayed for "Pool 1 (1.0)"
    And The correct text is shown in enable modal
    When I click on enable button in modal
    Then The api call is made for "refresh list" processes
    When I click on "Close" button in the modal
    And The modal is closed

  Scenario: The enable process modal should display 500 error message
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "enable state code 500" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    And I click on enable button in modal
    Then I see "500" error message for disabled processes
    When I click on "Cancel" button in the modal
    And I click on "ok" button on the item "2"
    Then The correct text is shown in enable modal

  Scenario: The enable process modal should display 404 error message
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "enable state code 404" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    And I click on enable button in modal
    Then I see "404" error message for disabled processes
    When I click on "Cancel" button in the modal
    And I click on "ok" button on the item "2"
    Then The correct text is shown in enable modal

  Scenario: The enable process modal should display 403 error message
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "enable state code 403" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    And I click on enable button in modal
    Then I see "403" error message for disabled processes
    When I click on "Cancel" button in the modal
    And I click on "ok" button on the item "2"
    Then The correct text is shown in enable modal

  Scenario: The enable process modal should display enabling
    Given The page response "default filter with headers" is defined for disabled processes
    And The page response "delay enable" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    And I click on enable button in modal
    Then I see enabling message
    When I click on "Cancel" button in the modal
    And I click on "ok" button on the item "2"
    Then The correct text is shown in enable modal

  Scenario: The refresh button works correctly
    Given The page response "refresh disabled process list" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on refresh button
    Then The api call is made for "refresh disabled process list" processes

  Scenario: The enable button is disabled for unresolved processes
    Given The page response "default filter with headers" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then The "ok" button is disabled for item "1"