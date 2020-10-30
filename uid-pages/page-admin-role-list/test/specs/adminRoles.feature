Feature: The Admin Roles in desktop resolution

  Scenario: The roles displays the correct attributes
    Given The response "default filter" is defined
    When I visit the admin roles page
    Then The roles page have the correct information

  Scenario: Load more button works correctly
    Given The response "enable load more" is defined
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
    And The load more roles button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The response "enable 30 load more" is defined
    And The response "sort during limitation" is defined
    When I visit the admin roles page
    Then A list of 10 roles is displayed
    When I click on Load more roles button
    Then A list of 20 roles is displayed
    When I click on Load more roles button
    Then A list of 30 roles is displayed
    And The load more roles button is disabled
    When I put "Display name (Desc)" in "sort by" filter field
    Then A list of 10 roles is displayed
    When I click on Load more roles button
    Then A list of 20 roles is displayed

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
    And The response "refresh list after create" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"
    When I fill in the information
    Then The "Create" button in modal is "enabled"
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
    And The "Create" button in modal is "disabled"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display already exists error message
    Given The response "default filter" is defined
    And The response "already exists during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "already exists" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "403" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on create button
    And I fill in the information
    And I click on the "Create" button in modal
    Then I see "500" error message for "created"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a role"

  Scenario: The delete role modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Member"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The delete role modal deletes successfully
    Given The response "role deletion success" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Member"
    When I click on the "Delete" button in modal
    Then The deletion is successful
    And The roles list is refreshed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    And A list of 7 roles is displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Role11"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on delete button for first role
    And I click on the "Delete" button in modal
    Then I see "403" error message for "deleted"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Member"

  Scenario: The modal should display not exists error message
    Given The response "default filter" is defined
    And The response "not exists during delete" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on delete button for first role
    And I click on the "Delete" button in modal
    Then I see "not exists during delete" error message for "deleted"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Member"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on delete button for first role
    And I click on the "Delete" button in modal
    Then I see "500" error message for "deleted"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on delete button for first role
    Then The delete modal is open and has a default state for "Delete Member"

  Scenario: The user list modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    And The response "empty user list" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The user list modal is open and has no users for "Users mapped to the role Member"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The user list modal displays a list
    Given The response "default filter" is defined
    And The response "user list" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The user list modal is open and has users for "Users mapped to the role Member"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The user list modal displays a list
    Given The response "default filter" is defined
    And The response "user list" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The user list modal is open and has users for "Users mapped to the role Member"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The user list search works correctly
    Given The response "default filter" is defined
    And The response "user list" is defined
    And The response "user list search" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The user list modal is open and has users for "Users mapped to the role Member"
    When I put "Virginie" in user list search filter field
    Then The api call is made for "Virginie"
    And Only one user is displayed
    When I erase the user search filter
    Then The user list modal is open and has users for "Users mapped to the role Member"
    When I put "Search term with no match" in user list search filter field
    Then No users are available

  Scenario: Load more users button works correctly
    Given The response "user list load more" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then A list of 10 users is displayed
    When I click on Load more users button
    Then A list of 20 users is displayed
    When I click on Load more users button
    Then A list of 30 users is displayed
    When I click on Load more users button
    Then A list of 35 users is displayed
    And The load more users button is disabled

  Scenario: [Limitation] Load more users is not disabled when result is a multiple of count
    Given The response "user list 20 load more" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then A list of 10 users is displayed
    When I click on Load more users button
    Then A list of 20 users is displayed
    And The load more users button is disabled

  Scenario: Load more users resets correctly after the limitation is triggered
    Given The response "user list 30 load more" is defined
    And The response "default filter" is defined
    And The response "user search during limitation" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then A list of 10 users is displayed
    When I click on Load more users button
    Then A list of 20 users is displayed
    When I click on Load more users button
    Then A list of 30 users is displayed
    And The load more users button is disabled
    When I put "Virginie" in user list search filter field
    Then A list of 10 users is displayed
    When I click on Load more users button
    Then A list of 20 users is displayed

  Scenario: The user list modal resets when open for a different role
    Given The response "default filter" is defined
    And The response "user list for two roles" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The user list modal is open and has no users for "Users mapped to the role Member"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on user button for second role
    Then The user list modal is open and has users for "Users mapped to the role Role11"

  Scenario: The user list modal navigates to the user details
    Given The response "default filter" is defined
    And The response "user list" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on user button for first role
    Then The first user details link has the correct url

  Scenario: The edit role modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The edit role modal has different information when opening a second role
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for second role
    Then The edit modal is open and has a default state for "Edit role Role11" for role 2

  Scenario: The edit role modal edits successfully
    Given The response "role edition success" is defined
    And The response "refresh list after edit" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1
    When I edit the information for first role
    And I click on the "Save" button in modal
    Then The edition is successful
    And The roles list is refreshed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    And A list of 8 roles is displayed
    And The first role has a different name
    When I click on edit button for first role
    Then The edit modal is open and has a edited state for "Edit role New member"

  Scenario: The edit role modal requires name
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    And I clear the name
    Then There is a error message about name being required
    And The "Save" button in modal is "disabled"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1

  Scenario: The edit modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "403" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1

  Scenario: The edit modal should display generic 404 error message
    Given The response "default filter" is defined
    And The response "404 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "404" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1

  Scenario: The edit modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I click on edit button for first role
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "500" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first role
    Then The edit modal is open and has a default state for "Edit role Member" for role 1
