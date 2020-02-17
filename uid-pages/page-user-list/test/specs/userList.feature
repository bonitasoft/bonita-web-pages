Feature: The users list in desktop resolution

  Scenario: The users list displays the correct attributes
    Given The filter response "default filter" is defined
    When I visit the user list page
    Then The users have the correct information
    And The user list have the correct item shown number

  Scenario: The users list sort by works correctly
    Given The filter response "default filter" is defined
    And The filter response "sort by" is defined
    When I visit the user list page
    Then A list of "5" users is displayed
    When I put "First name (Asc)" in "sort by" filter field
    Then The api call is made for "First name (Asc)"
    When I put "First name (Desc)" in "sort by" filter field
    Then The api call is made for "First name (Desc)"
    When I put "Last name (Asc)" in "sort by" filter field
    Then The api call is made for "Last name (Asc)"
    When I put "Last name (Desc)" in "sort by" filter field
    Then The api call is made for "Last name (Desc)"

  Scenario: Search by works correctly
    Given The filter response "default filter" is defined
    And The filter response "search by" is defined
    When I visit the user list page
    Then A list of "5" users is displayed
    When I put "Walter" in "search" filter field
    Then The api call is made for "Walter"
    When I erase the search filter
    Then A list of "5" users is displayed
    When I put "Bates" in "search" filter field
    Then The api call is made for "Bates"
    When I erase the search filter
    When I put "walter.bates" in "search" filter field
    Then The api call is made for "walter.bates"
    When I erase the search filter
    When I put "Search term with no match" in "search" filter field
    Then No users are available

  Scenario: Show inactive users works correctly
    Given The filter response "default filter" is defined
    And The filter response "show inactive" is defined
    When I visit the user list page
    Then A list of "5" users is displayed
    When I filter show inactive users
    Then The api call is made for "show inactive"

  Scenario: Load more users button works correctly
    Given The filter response "enable load more" is defined
    When I visit the user list page
    Then A list of "10" users is displayed
    When I click on Load more users button
    Then A list of "20" users is displayed
    When I click on Load more users button
    Then A list of "30" users is displayed
    When I click on Load more users button
    Then A list of "35" users is displayed
    And The Load more users button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined
    When I visit the user list page
    Then A list of "10" users is displayed
    When I click on Load more users button
    Then A list of "20" users is displayed
    When I click on Load more users button
    Then The Load more users button is disabled

  Scenario: Loading should be displayed on page load
    When I visit the user list page
    Then No users are available
    And The loading text is displayed