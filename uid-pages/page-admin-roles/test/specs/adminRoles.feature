Feature: The Admin Roles in desktop resolution

  Scenario: The roles displays the correct attributes
    Given The response "default filter" is defined
    When I visit the admin roles page
    Then The roles page have the correct information

  Scenario: Load more button works correctly
    And The response "enable load more" is defined
    When I visit the admin roles page
    Then A list of 10 roles is displayed
    When I click on Load more roles button
    Then A list of 20 roles is displayed
    When I click on Load more roles button
    Then A list of 30 roles is displayed
    When I click on Load more roles button
    Then A list of 38 roles is displayed
    And The load more roles button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The response "enable 20 load more" is defined
    When I visit the admin roles page
    Then A list of 10 roles is displayed
    When I click on Load more roles button
    Then A list of 20 roles is displayed
    When I click on Load more roles button
    And The load more roles button is disabled

  Scenario: The roles list sort by works correctly
    Given The response "default filter" is defined
    And The response "sort by" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I put "Display name (Desc)" in "sort by" filter field
    Then The api call is made for "Display name (Desc)"
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Display name (Asc)" in "sort by" filter field
    Then The api call is made for "Display name (Asc)"

  Scenario: The roles list search works correctly
    Given The response "default filter" is defined
    And The response "search" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I put "Member" in "search" filter field
    Then The api call is made for "Member"
    And A list of 1 roles is displayed
    When I erase the search filter
    Then A list of 8 roles is displayed
    When I put "Search term with no match" in "search" filter field
    Then No roles are available

  Scenario: The create role modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The create role modal creates successfully
    Given The response "role creation success" is defined
    And The response "refresh list" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"
    When I fill in the information
    Then The create button in modal is enabled
    When I click on the "Create" button in modal
    Then The creation is successful
    And The roles list is refreshed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    And A list of 9 roles is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The create role modal requires name
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the name
    And I clear the name
    Then There is a error message about name being required
    And The create button in modal is disabled
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display already exists error message
    Given The response "default filter" is defined
    And The response "already exists" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "already exists" error message
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "403" error message
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "500" error message
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"
