Feature: The Admin Groups in desktop resolution

  Scenario: The groups displays the correct attributes
    Given The response "default filter" is defined
    When I visit the admin groups page
    Then The groups page have the correct information

  Scenario: The groups list sort by works correctly
    Given The response "default filter" is defined
    And The response "sort by" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I put "Display name (Desc)" in "sort by" filter field
    Then The api call is made for "Display name (Desc)"
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Display name (Asc)" in "sort by" filter field
    Then The api call is made for "Display name (Asc)"

  Scenario: The groups list search works correctly
    Given The response "default filter" is defined
    And The response "search" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I put "Acme" in "search" filter field
    Then The api call is made for "Acme"
    And A list of 1 groups is displayed
    When I erase the search filter
    Then A list of 8 groups is displayed
    When I put "Search term with no match" in "search" filter field
    Then No groups are available

  Scenario: Load more button works correctly
    Given The response "enable load more" is defined
    When I visit the admin groups page
    Then A list of 10 groups is displayed
    When I click on Load more groups button
    Then A list of 20 groups is displayed
    When I click on Load more groups button
    Then A list of 30 groups is displayed
    When I click on Load more groups button
    Then A list of 38 groups is displayed
    And The load more groups button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The response "enable 20 load more" is defined
    When I visit the admin groups page
    Then A list of 10 groups is displayed
    When I click on Load more groups button
    Then A list of 20 groups is displayed
    When I click on Load more groups button
    And The load more groups button is disabled