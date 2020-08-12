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

  Scenario: The create group modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The create group modal creates successfully
    Given The response "group creation success" is defined
    And The response "refresh list after create" is defined
    And The response "parent group list" is defined
    And The response "default filter" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"
    When I fill in the information
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group list is not displayed
    And The parent group input is filled with "Acme"
    And The "Create" button in modal is "enabled"
    When I click on the "Create" button in modal
    Then The creation is successful
    And The groups list is refreshed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    And A list of 9 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The create group modal should display information about typing more
    Given The response "default filter" is defined
    And The response "parent group list with 20 groups" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"
    When I fill in the information
    And I type "A" in the parent group input
    Then The parent group list is displayed
    And The type more message is displayed and disabled
    When I type "u" in the parent group input
    Then The type more message is not displayed
    When I remove "u" from the parent group input
    Then The parent group list is displayed
    And The type more message is displayed and disabled

  Scenario: The modal should display already exists error message
    Given The response "default filter" is defined
    And The response "already exists during creation" is defined
    And The response "refresh not called" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    And I fill in the information
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Create" button in modal
    Then I see "already exists" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during creation" is defined
    And The response "refresh not called" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    And I fill in the information
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Create" button in modal
    Then I see "403" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during creation" is defined
    And The response "refresh not called" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    And I fill in the information
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Create" button in modal
    Then I see "500" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"