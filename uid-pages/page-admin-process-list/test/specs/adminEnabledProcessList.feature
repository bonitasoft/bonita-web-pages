Feature: The enabled process list in desktop resolution

  Scenario: The enabled process list displays the correct attributes
    Given The filter response "default filter" is defined
    When I visit admin process list page
    Then The enabled process list have the correct information
    And The enabled process list have the correct item shown number

  Scenario: The enabled process list sort by works correctly
    Given The filter response "default filter" is defined
    And The filter response "sort by" is defined
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
    Given The filter response "default filter" is defined
    And The filter response "search" is defined
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

  Scenario: Load more button works correctly
    And The filter response "enable load more" is defined
    When I visit admin process list page
    Then A list of "10" items is displayed
    When I click on load more processes button
    Then A list of "20" items is displayed
    When I click on load more processes button
    Then A list of "30" items is displayed
    When I click on load more processes button
    Then A list of "35" items is displayed
    And The load more processes button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined
    When I visit admin process list page
    Then A list of "10" items is displayed
    When I click on load more processes button
    Then A list of "20" items is displayed
    When I click on load more processes button
    Then The load more processes button is disabled
