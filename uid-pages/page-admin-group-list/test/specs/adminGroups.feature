Feature: The Admin Groups in desktop resolution

  Scenario: The groups displays the correct attributes
    Given The response "default filter with headers" is defined
    When I visit the admin groups page
    Then The groups page have the correct information

  Scenario: The groups list sort by works correctly
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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

  Scenario: The create group modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The create group modal creates successfully
    Given The response "group creation success" is defined
    And The response "refresh list after create" is defined
    And The response "parent group list" is defined
    And The response "default filter with headers" is defined
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
    When I click on the "Create" button in modal footer
    Then The creation is successful
    And The groups list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of 9 groups is displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The create group modal should display information about typing more
    Given The response "default filter with headers" is defined
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

  Scenario: The create modal should display already exists error message
    Given The response "default filter with headers" is defined
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
    When I click on the "Create" button in modal footer
    Then I see "already exists" error message for "created"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter with headers" is defined
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
    When I click on the "Create" button in modal footer
    Then I see "403" error message for "created"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter with headers" is defined
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
    When I click on the "Create" button in modal footer
    Then I see "500" error message for "created"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on create button
    Then The create modal is open and has a default state for "Create a group"

  Scenario: The user list modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    And The response "empty user list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on user button for first group
    Then The user list modal is open and has no users for "Users in the group Acme"
    When I click on the "Close" button in modal footer
    Then There is no modal displayed

  Scenario: The user list modal displays a list
    Given The response "default filter with headers" is defined
    And The response "user list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on user button for first group
    Then The user list modal is open and has 5 users for "Users in the group Acme"
    When I click on the "Close" button in modal footer
    Then There is no modal displayed

  Scenario: The user list search works correctly
    Given The response "default filter with headers" is defined
    And The response "user list" is defined
    And The response "user list search" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on user button for first group
    Then The user list modal is open and has 5 users for "Users in the group Acme"
    When I put "Virginie" in modal search filter field
    Then The api call is made for "Virginie"
    And Only one item is displayed
    When I erase the modal search filter
    Then The user list modal is open and has 5 users for "Users in the group Acme"
    When I put "Search term with no match" in modal search filter field
    Then No users are available
    And The search input is not disable

  Scenario: The user list modal resets when open for a different group
    Given The response "default filter with headers" is defined
    And The response "user list for two groups" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on user button for first group
    Then The user list modal is open and has 10 users for "Users in the group Acme"
    When I click on Load more users button
    Then A list of 18 items is displayed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    When I click on user button for second group
    Then The user list modal is open and has no users for "Users in the group Asia"

  Scenario: The user list modal navigates to the user details
    Given The response "default filter with headers" is defined
    And The response "user list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on user button for first group
    Then The first user details link has the correct url

  Scenario: The sub-group list modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    And The response "empty sub-group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on sub-group button for first group
    Then The sub-group list modal is open and has no sub-groups for "Sub-groups of Acme (/acme)"
    When I click on the "Close" button in modal footer
    Then There is no modal displayed

  Scenario: The sub-group list modal displays a list
    Given The response "default filter with headers" is defined
    And The response "sub-group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on sub-group button for first group
    Then The sub-group list modal is open and has 5 sub-groups for "Sub-groups of Acme (/acme)"
    When I click on the "Close" button in modal footer
    Then There is no modal displayed

  Scenario: The sub-group list search works correctly
    Given The response "default filter with headers" is defined
    And The response "sub-group list" is defined
    And The response "sub-group list search" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on sub-group button for first group
    Then The sub-group list modal is open and has 5 sub-groups for "Sub-groups of Acme (/acme)"
    When I put "Acme" in modal search filter field
    Then The api call is made for "Acme"
    And Only one item is displayed
    When I erase the modal search filter
    Then The sub-group list modal is open and has 5 sub-groups for "Sub-groups of Acme (/acme)"
    When I put "Search term with no match" in modal search filter field
    Then No "sub-groups" are available
    And The search input is not disable

  Scenario: The sub groups list modal resets when open for a different group
    Given The response "default filter with headers" is defined
    And The response "sub-groups list for two groups" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on sub-group button for first group
    Then The sub-group list modal is open and has 10 sub-groups for "Sub-groups of Acme (/acme)"
    When I click on Load more sub-groups button
    Then A list of 18 items is displayed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    When I click on sub-group button for second group
    Then The sub-group list modal is open and has no sub-groups for "Sub-groups of Asia"

  Scenario: The edit group modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    And The response "current parent information" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The edit group modal edits successfully
    Given The response "group edition success" is defined
    And The response "refresh list after edit" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    And The response "default filter with headers" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Asia" in the list
    Then The parent group list is not displayed
    And The parent group input is filled with "Asia"
    When I click on the "Save" button in modal footer
    Then The edition is successful
    And The groups list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Group display name", "Group name", "Group display name", "Group description", "Asia"

  Scenario: The edit group modal should display information about typing more
    Given The response "default filter with headers" is defined
    And The response "current parent information" is defined
    And The response "parent group list with 20 groups" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    And The type more message is displayed and disabled
    When I type "u" in the parent group input
    Then The type more message is not displayed
    When I remove "u" from the parent group input
    Then The parent group list is displayed
    And The type more message is displayed and disabled

  Scenario: The edit modal should display already exists error message
    Given The response "default filter with headers" is defined
    And The response "already exists during edition" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Save" button in modal footer
    Then I see "already exists" error message for "updated"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter with headers" is defined
    And The response "403 during edition" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Save" button in modal footer
    Then I see "403" error message for "updated"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"

  Scenario: The modal should display generic 404 error message
    Given The response "default filter with headers" is defined
    And The response "404 during edition" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Save" button in modal footer
    Then I see "404" error message for "updated"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter with headers" is defined
    And The response "500 during edition" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    When I erase all the information in edit modal
    And I fill in the information
    And I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "Save" button in modal footer
    Then I see "500" error message for "updated"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"

  Scenario: The cancel button for parent group works and gets reset correctly
    Given The response "default filter with headers" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    And The response "group edition success" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group input is filled with "Acme"
    When I click on the "remove" glyphicon button in modal body
    Then The parent group edition field should contain "Europe"
    When I click on the "pencil" glyphicon button in modal body
    Then The parent group edition field should contain ""
    And The parent group dropdown is not shown
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I click on the "pencil" glyphicon button in modal body
    Then The parent group edition field should contain ""
    And The parent group dropdown is not shown
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The edit group modal resets the old parent value correctly
    Given The response "group edition success" is defined
    And The response "refresh list after edit" is defined
    And The response "current parent information" is defined
    And The response "parent group list" is defined
    And The response "default filter with headers" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on the "remove" glyphicon button in modal body
    Then The parent group list is not displayed
    When I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Asia" in the list
    Then The parent group list is not displayed
    And The parent group input is filled with "Asia"
    When I click on the "remove" glyphicon button in modal body
    Then The parent group list is not displayed
    When I click on the "Save" button in modal footer
    Then The edition is successful with old parent
    And The groups list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed

  Scenario: The parent group selection is reset after opening the second modal
    Given The response "default filter with headers" is defined
    And The response "refresh not called" is defined
    And The response "current parent information" is defined
    And The response "current parent information for second group" is defined
    And The response "parent group list" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on edit button for first group
    Then The edit modal is open and has a default state for "Edit group Acme", "acme", "Acme", "This group represents the acme department of the ACME organization", "Europe"
    When I click on the "pencil" glyphicon button in modal body
    And I type "A" in the parent group input
    Then The parent group list is displayed
    When I click on "Acme" in the list
    Then The parent group edition field should contain "Acme"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on edit button for second group
    Then The edit modal is open and has a default state for "Edit group Asia", "asia", "Asia", "This group represents the asia department of the ACME organization", "Infrastructure"
    When I click on the "pencil" glyphicon button in modal body
    Then The parent group edition field should contain ""
    And The parent group dropdown is not shown

  Scenario: The delete group modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Acme"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The delete group modal deletes successfully
    Given The response "group deletion success" is defined
    And The response "refresh list after delete" is defined
    And The response "default filter with headers" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Acme"
    When I click on the "Delete" button in modal footer
    Then The deletion is successful
    And The groups list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of 7 groups is displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Asia"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter with headers" is defined
    And The response "403 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on delete button for first group
    When I click on the "Delete" button in modal footer
    Then I see "403" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Acme"

  Scenario: The modal should display generic 404 error message
    Given The response "default filter with headers" is defined
    And The response "404 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on delete button for first group
    When I click on the "Delete" button in modal footer
    Then I see "404" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Acme"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter with headers" is defined
    And The response "500 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin groups page
    Then A list of 8 groups is displayed
    When I click on delete button for first group
    When I click on the "Delete" button in modal footer
    Then I see "500" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first group
    Then The delete modal is open and has a default state for "Delete Acme"
