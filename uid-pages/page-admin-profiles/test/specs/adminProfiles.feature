Feature: The Admin Profiles in desktop resolution

  Scenario: The profiles displays the correct attributes
    Given The response "default filter" is defined
    When I visit the admin profiles page
    Then The profiles page has the correct information

  Scenario: The profiles list sort by works correctly
    Given The response "default filter" is defined
    And The response "sort by" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"

  Scenario: The profiles list search works correctly
    Given The response "default filter" is defined
    And The response "search" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I put "Administrator" in "search" filter field
    Then The api call is made for "Administrator"
    And A list of 1 items is displayed
    When I erase the search filter
    Then A list of 8 items is displayed
    When I put "Search term with no match" in "search" filter field
    Then No profiles are displayed

  Scenario: Load more button works correctly
    Given The response "profiles load more" is defined
    When I visit the admin profiles page
    Then A list of 10 items is displayed
    When I click on Load more profiles button
    Then A list of 20 items is displayed
    When I click on Load more profiles button
    Then A list of 30 items is displayed
    When I click on Load more profiles button
    Then A list of 38 items is displayed
    And The load more profiles button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The response "profiles 20 load more" is defined
    When I visit the admin profiles page
    Then A list of 10 items is displayed
    When I click on Load more profiles button
    Then A list of 20 items is displayed
    When I click on Load more profiles button
    And The load more profiles button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The response "profiles 30 load more" is defined
    And The response "sort during limitation" is defined
    When I visit the admin profiles page
    Then A list of 10 items is displayed
    When I click on Load more profiles button
    Then A list of 20 items is displayed
    When I click on Load more profiles button
    Then A list of 30 items is displayed
    When I click on Load more profiles button
    And The load more profiles button is disabled
    When I put "Name (Desc)" in "sort by" filter field
    Then A list of 10 items is displayed
    When I click on Load more profiles button
    Then A list of 20 items is displayed
