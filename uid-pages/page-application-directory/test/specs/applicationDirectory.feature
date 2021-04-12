Feature: The Application Directory in desktop resolution

  Scenario: The application directory displays the correct attributes
    Given The response "default filter" is defined
    And The response "session" is defined
    When I visit the application directory page
    Then The application directory page has the correct information

  Scenario: The application directory search works correctly
    Given The response "default filter" is defined
    And The response "session" is defined
    And The response "search" is defined
    When I visit the application directory page
    Then A list of 5 items is displayed
    When I put "Bonita" in search filter field
    Then The api call is made for "Bonita"
    And A list of 1 items is displayed
    When I erase the search filter
    Then A list of 5 items is displayed
    When I put "Search term with no match" in search filter field
    Then No applications are displayed

  Scenario: Load more button works correctly
    Given The response "applications load more" is defined
    And The response "session" is defined
    When I visit the application directory page
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    When I click on Load more applications button
    Then A list of 30 items is displayed
    When I click on Load more applications button
    Then A list of 35 items is displayed
    And The load more applications button is disabled

  Scenario: Load more is disabled when result is a multiple of count
    Given The response "applications 20 load more" is defined
    And The response "session" is defined
    When I visit the application directory page
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    And The load more applications button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The response "applications 30 load more" is defined
    And The response "search during limitation" is defined
    And The response "session" is defined
    When I visit the application directory page
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed
    When I click on Load more applications button
    Then A list of 30 items is displayed
    And The load more applications button is disabled
    When I put "Bonita" in search filter field
    Then A list of 10 items is displayed
    When I click on Load more applications button
    Then A list of 20 items is displayed