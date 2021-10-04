Feature: Test the load more fragment

  Scenario: The first API call is done correctly
    Given The filter response "default filter with headers" is defined
    When I visit the user list page
    Then The api call is made for "user list"

  Scenario: The no users message shown correctly
    Given The filter response "default filter with headers" is defined
    And The filter response "no users" is defined
    When I visit the user list page
    Then The api call is made for "user list"
    And The no users message is shown correctly

  Scenario: The users list sort by works correctly
    Given The filter response "default filter with headers" is defined
    And The filter response "sort by" is defined
    When I visit the user list page
    Then The api call is made for "user list"
    When I put "First" in "sort by" filter field
    Then The api call is made for "First"
    When I put "Last" in "sort by" filter field
    Then The api call is made for "Last"

  Scenario: Search by works correctly
    Given The filter response "default filter with headers" is defined
    And The filter response "search by" is defined
    When I visit the user list page
    Then The api call is made for "user list"
    When I put "Walter" in "search" filter field
    Then The api call is made for "Walter"
    When I erase the search filter
    Then The api call is made for "user list"
    When I put "Bates" in "search" filter field
    Then The api call is made for "Bates"
    When I erase the search filter
    When I put "walter.bates" in "search" filter field
    Then The api call is made for "walter.bates"
    When I erase the search filter
    When I put "Search term with no match" in "search" filter field
    Then The no users message is shown correctly

  Scenario: The users list count works correctly
    Given The filter response "default filter with headers" is defined
    And The filter response "count" is defined
    When I visit the user list page
    Then The api call is made for "user list"
    When I put "101" in "count" filter field
    Then The api call is made for "101"

  Scenario: Show inactive users works correctly
    Given The filter response "default filter with headers" is defined
    And The filter response "show inactive" is defined
    When I visit the user list page
    Then The api call is made for "user list"
    When I filter show inactive users
    Then The api call is made for "show inactive"

  Scenario: Load more users button works correctly
    Given The filter response "enable load more" is defined
    When I visit the user list page
    Then The api call is made for page 0 out of 3
    And The 10 of 35 users shown message displayed correctly
    When I click on Load more users button
    Then The api call is made for page 1 out of 3
    And The 20 of 35 users shown message displayed correctly
    When I click on Load more users button
    Then The api call is made for page 2 out of 3
    And The 30 of 35 users shown message displayed correctly
    When I click on Load more users button
    Then The api call is made for page 3 out of 3
    And The 35 of 35 users shown message displayed correctly
    And The Load more users button is disabled

  Scenario: Load more is disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined
    When I visit the user list page
    Then The api call is made for "0 of 20 users"
    When I click on Load more users button
    Then The api call is made for "1 of 20 users"
    And The Load more users button is disabled

  Scenario: Load more users resets correctly after the limitation is triggered
    Given The filter response "enable 30 load more" is defined
    And The filter response "user search during limitation" is defined
    When I visit the user list page
    Then The api call is made for "0 of 30 users"
    When I click on Load more users button
    Then The api call is made for "1 of 30 users"
    When I click on Load more users button
    Then The api call is made for "2 of 30 users"
    When I click on Load more users button
    Then The api call is made for "3 of 30 users"
    And The Load more users button is disabled
    When I put "Walter" in "search" filter field
    Then The api call is made for "Walter"
    When I click on Load more users button
    Then The api call is made for "search limitation"

  Scenario: The api makes the correct calls for URL switching between tabs
    Given The filter response "tabs" is defined
    When I visit the user list page
    Then The api call is made for "tab 1"
    When I click on "Tab 2"
    Then The api call is made for "tab 2"
    When I click on "Tab 1"
    Then The api call is made for "tab 1"