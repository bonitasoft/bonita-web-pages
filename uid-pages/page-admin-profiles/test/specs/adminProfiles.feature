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

  Scenario: The delete profile modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The delete profile modal deletes successfully
    Given The response "profile deletion success" is defined
    And The response "refresh list after delete" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"
    When I click on the "Delete" button in modal footer
    Then The deletion is successful
    And The profiles list is refreshed
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of 7 profiles is displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete New Profile"

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    When I click on the "Delete" button in modal footer
    Then I see "403" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"

  Scenario: The modal should display generic 404 error message
    Given The response "default filter" is defined
    And The response "404 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    When I click on the "Delete" button in modal footer
    Then I see "404" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during deletion" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    When I click on the "Delete" button in modal footer
    Then I see "500" error message for "deleted"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"

  Scenario: The add profile modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    When I switch to import profiles
    Then The import profiles section shows the correct information
    When I switch to create a profile
    Then The name and description are empty
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The add profile modal creates successfully
    Given The response "profile creation success" is defined
    And The response "refresh list after create" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    And I fill in the name and description
    And I click on the "Add" button in modal footer
    Then The creation is successful
    And The profiles list is refreshed
    When I wait for 2000
    And I click inside the modal
    Then The success message does not disappear
    When I click on the "Close" button in modal footer
    Then There is no modal displayed
    And A list of 9 profiles is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    When I switch to create a profile
    Then The name and description are empty

  Scenario: The modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    And I fill in the name and description
    And I click on the "Add" button in modal footer
    Then I see "403" error message for "added"
    When I wait for 2000
    And I fill in the name and description
    Then There is no error or success
    And I click on the "Add" button in modal footer
    Then I see "403" error message for "added"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    When I switch to create a profile
    Then The name and description are empty

  Scenario: The modal should display already exists error message
    Given The response "default filter" is defined
    And The response "already exists during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    And I fill in the name and description
    And I click on the "Add" button in modal footer
    Then I see "already exists" error message for "added"
    When I wait for 2000
    And I fill in the name and description
    Then There is no error or success
    And I click on the "Add" button in modal footer
    Then I see "already exists" error message for "added"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    When I switch to create a profile
    Then The name and description are empty

  Scenario: The modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during creation" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    And I fill in the name and description
    And I click on the "Add" button in modal footer
    Then I see "500" error message for "added"
    When I wait for 2000
    And I fill in the name and description
    Then There is no error or success
    And I click on the "Add" button in modal footer
    Then I see "500" error message for "added"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed
    When I click on add button
    Then The add modal is open and has a default state for "Add profiles"
    When I switch to create a profile
    Then The name and description are empty

  Scenario: The edit profile modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The edit profile modal shows different information when opening another profile
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for fifth profile
    Then The edit modal is open and has a default state for "Edit profile aaa" for profile 5

  Scenario: The edit profile modal edits successfully
    Given The response "profile edition success" is defined
    And The response "refresh list after edit" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1
    When I edit the information for first profile
    And I click on the "Save" button in modal
    Then The edition is successful
    And The profiles list is refreshed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    And A list of 8 profiles is displayed
    And The first profile has a different name
    When I click on edit button for first profile
    Then The edit modal is open and has a edited state for "Edit profile New custom profile 1"

  Scenario: The edit profile modal requires name
    Given The response "refresh not called" is defined
    And The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    And I clear the name
    Then There is an error message about name being required
    And The "Save" button in modal is "disabled"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1

  Scenario: The edit modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "403" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1

  Scenario: The edit modal should display generic 404 error message
    Given The response "default filter" is defined
    And The response "404 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "404" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1

  Scenario: The edit modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during edition" is defined
    And The response "refresh not called" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    And I fill in the information
    And I click on the "Save" button in modal
    Then I see "500" error message for "updated"
    When I click on the "Cancel" button in modal
    Then There is no modal displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1

  Scenario: The export profile button works correctly
    Given The response "default filter" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    Then I can export a profile

  Scenario: The organization mapping show and hide button works correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    And The hide organization mapping button is displayed
    When I click on hide organization mapping button for first profile
    Then There is no mapping information displayed
    When I click on show organization mapping button for second profile
    Then I see the mapping information for second profile
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile

  Scenario: The edit user mapping modal is opened and closed
    Given The response "default filter" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit user mapping modal changes profile id correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "user list" is defined
    And The response "add user and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    When I type "H" in the user input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "USER", "101", "3"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on show organization mapping button for second profile without closing the first
    Then I see the mapping information for second profile
    When I click on edit user mapping button for second profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Administrator" profile
    When I type "H" in the user input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "USER", "2", "3"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit user mapping search works correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "search mapped user" is defined
    When I visit the admin profiles page
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    When The search input is filled with "Helen"
    Then The api call is made for "Helen"
    When I erase the search filter in the modal
    When The search input is filled with "Search term with no match"
    Then No user mappings are displayed

  Scenario: Load more mapped users button works correctly for user mapping
    Given The response "default filter" is defined
    And The response "user mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The load more user mapped button is not disabled
    And A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 28 "Users" mapped is displayed
    And The load more user mapped button is disabled

  Scenario: [Limitation] Load more mapped users is not disabled when result is a multiple of count
    Given The response "default filter" is defined
    And The response "user mapping 20 load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The load more user mapped button is not disabled
    And A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    And The load more user mapped button is not disabled
    When I click on Load more users mapped button
    Then The load more user mapped button is disabled

  Scenario: Load more mapped users resets correctly after the limitation is triggered
    Given The response "default filter" is defined
    And The response "user mapping 30 load more" is defined
    And The response "search mapped user during limitation" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 30 "Users" mapped is displayed
    When I click on Load more users mapped button
    And The load more user mapped button is disabled
    When The search input is filled with "H"
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed

  Scenario: Load more mapped users resets correctly after modal is reopened
    Given The response "default filter" is defined
    And The response "user mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    When I click on the "Close" button in modal
    And I click on edit user mapping button for first profile
    Then A list of 10 "Users" mapped is displayed

  Scenario: Load more mapped users resets correctly after we change the list of users mapped
    Given The response "default filter" is defined
    And The response "user mapping load more" is defined
    And The response "user list" is defined
    And The response "add user and refresh list" is defined
    And The response "remove user and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    And I type "H" in the user input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    When I click on the remove "user" button in modal
    Then A list of 10 "Users" mapped is displayed

  Scenario: The edit user mapping modal adds users successfully
    Given The response "default filter" is defined
    And The response "user list" is defined
    And The response "refresh mapped user list" is defined
    And The response "add user and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    When I type "H" in the user input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    Then The "user" list is not displayed
    And The user input is filled with "Helen Kelly"
    When The search input is filled with "H"
    And I erase one character
    Then The "user" list is displayed
    And The add button is disabled
    When I click on "Helen Kelly" in the list
    Then The "user" list is not displayed
    When I click on the "Add" button in modal
    Then There is a confirmation for a user mapping being added
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The api call has the correct information: "USER", "101", "3"
    And The list of user mappings is refreshed
    And The page is refreshed
    And The search input has the value "H"
    When I type "H" in the user input
    Then The "user" list is displayed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The "user" list is not displayed
    And The user input is filled with ""

  Scenario: The edit user mapping modal removes users successfully
    Given The response "default filter" is defined
    And The response "refresh mapped user list" is defined
    And The response "remove user and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    And I click on the remove "user" button in modal
    Then There is a confirmation for a user mapping being removed
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The list of user mappings is refreshed
    And The page is refreshed
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit user mapping modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    And I click on the remove "user" button in modal
    Then I see "500" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "500" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "500" user mapping error message

  Scenario: The edit user mapping modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    And I click on the remove "user" button in modal
    Then I see "403" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "403" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "403" user mapping error message

  Scenario: The edit user mapping modal should display user already exists error message
    Given The response "default filter" is defined
    And The response "user already exists during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "user already exists" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "user already exists" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed

  Scenario: The edit user mapping modal should display user does not exist error message
    Given The response "default filter" is defined
    And The response "user does not exist during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "user does not exist" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "user does not exist" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed

  Scenario: The edit user mapping modal should display member does not exist error message
    Given The response "default filter" is defined
    And The response "member does not exist during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When The search input is filled with "H"
    When I type "H" in the user input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "member does not exist" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "member does not exist" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed

  Scenario: The edit role mapping modal is opened and closed
    Given The response "default filter" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit role mapping modal changes profile id correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "role list" is defined
    And The response "add role and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    When I type "E" in the user input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "ROLE", "101", "4" for roles mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on show organization mapping button for second profile without closing the first
    Then I see the mapping information for second profile
    When I click on edit role mapping button for second profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Administrator" profile
    When I type "E" in the user input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "ROLE", "2", "4" for roles mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit role mapping search works correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "search mapped role" is defined
    When I visit the admin profiles page
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    When The search input is filled with "Executive"
    Then The api call is made for "Executive"
    When I erase the search filter in the modal
    When The search input is filled with "Search term with no match"
    Then No role mappings are displayed

  Scenario: Load more mapped roles button works correctly for role mapping
    Given The response "default filter" is defined
    And The response "role mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The load more role mapped button is not disabled
    And A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    And A list of 20 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 28 "Roles" mapped is displayed
    And The load more role mapped button is disabled

  Scenario: [Limitation] Load more mapped roles is not disabled when result is a multiple of count
    Given The response "default filter" is defined
    And The response "role mapping 20 load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The load more role mapped button is not disabled
    And A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    And The load more role mapped button is not disabled
    When I click on Load more roles mapped button
    Then The load more role mapped button is disabled

  Scenario: Load more mapped roles resets correctly after the limitation is triggered
    Given The response "default filter" is defined
    And The response "role mapping 30 load more" is defined
    And The response "search mapped role during limitation" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 30 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    And The load more role mapped button is disabled
    When The search input is filled with "E"
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed

  Scenario: Load more mapped role resets correctly after modal is reopened
    Given The response "default filter" is defined
    And The response "role mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    When I click on the "Close" button in modal
    And I click on edit role mapping button for first profile
    Then A list of 10 "Roles" mapped is displayed

  Scenario: Load more mapped roles resets correctly after we change the list of roles mapped
    Given The response "default filter" is defined
    And The response "role mapping load more" is defined
    And The response "role list" is defined
    And The response "add role and refresh list" is defined
    And The response "remove role and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    And I type "E" in the user input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    When I click on the remove "role" button in modal
    Then A list of 10 "Roles" mapped is displayed

  Scenario: The edit role mapping modal adds roles successfully
    Given The response "default filter" is defined
    And The response "role list" is defined
    And The response "refresh mapped role list" is defined
    And The response "add role and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    When I type "E" in the user input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    Then The "role" list is not displayed
    And The role input is filled with "Executive Assistants"
    When The search input is filled with "E"
    And I erase one character
    Then The "role" list is displayed
    And The add button is disabled
    When I click on "Executive Assistants" in the list
    Then The "role" list is not displayed
    When I click on the "Add" button in modal
    Then There is a confirmation for a role mapping being added
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The api call has the correct information: "ROLE", "101", "14" for roles mapping
    And The list of role mappings is refreshed
    And The page is refreshed
    And The search input has the value "E"
    When I type "E" in the user input
    Then The "role" list is displayed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The "role" list is not displayed
    And The role input is filled with ""

  Scenario: The edit role mapping modal removes roles successfully
    Given The response "default filter" is defined
    And The response "refresh mapped role list" is defined
    And The response "remove role and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    And I click on the remove "role" button in modal
    Then There is a confirmation for a role mapping being removed
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The list of role mappings is refreshed
    And The page is refreshed
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit role mapping modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during edit role mapping" is defined
    And The response "role list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    And I click on the remove "role" button in modal
    Then I see "500" role mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "500" role mapping error message
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When I type "E" in the user input
    And I click on "Executive Assistants" in the list
    And I click on the "Add" button in modal
    Then I see "500" role mapping error message

  Scenario: The edit role mapping modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edit role mapping" is defined
    And The response "role list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    And I click on the remove "role" button in modal
    Then I see "403" role mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "403" role mapping error message
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When I type "E" in the user input
    And I click on "Executive Assistants" in the list
    And I click on the "Add" button in modal
    Then I see "403" role mapping error message

  Scenario: The edit role mapping modal should display role already exists error message
    Given The response "default filter" is defined
    And The response "role already exists during edit role mapping" is defined
    And The response "role list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    When I type "E" in the user input
    And I click on "Executive Assistants" in the list
    And I click on the "Add" button in modal
    Then I see "role already exists" role mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "role already exists" role mapping error message
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed

  Scenario: The edit role mapping modal should display role does not exist error message
    Given The response "default filter" is defined
    And The response "role does not exist during edit role mapping" is defined
    And The response "role list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    When I type "E" in the user input
    And I click on "Executive Assistants" in the list
    And I click on the "Add" button in modal
    Then I see "role does not exist" role mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "role does not exist" role mapping error message
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed

  Scenario: The edit role mapping modal should display member does not exist error message
    Given The response "default filter" is defined
    And The response "member does not exist during edit role mapping" is defined
    And The response "role list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed
    When The search input is filled with "E"
    When I type "E" in the user input
    And I click on "Executive Assistants" in the list
    And I click on the "Add" button in modal
    Then I see "member does not exist" role mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "member does not exist" role mapping error message
    And The search input has the value "E"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The mapped role list is displayed

  Scenario: The edit group mapping modal is opened and closed
    Given The response "default filter" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit group mapping modal changes profile id correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "group list" is defined
    And The response "add group and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    When I type "A" in the user input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "GROUP", "101", "1" for groups mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on show organization mapping button for second profile without closing the first
    Then I see the mapping information for second profile
    When I click on edit group mapping button for second profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Administrator" profile
    When I type "A" in the user input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then The api call has the correct information: "GROUP", "2", "1" for groups mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit group mapping search works correctly
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "search mapped group" is defined
    When I visit the admin profiles page
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    When The search input is filled with "Acme"
    Then The api call is made for "Acme"
    When I erase the search filter in the modal
    When The search input is filled with "Search term with no match"
    Then No group mappings are displayed

  Scenario: Load more mapped groups button works correctly for role mapping
    Given The response "default filter" is defined
    And The response "group mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The load more group mapped button is not disabled
    And A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    And A list of 20 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 28 "Groups" mapped is displayed
    And The load more group mapped button is disabled

  Scenario: [Limitation] Load more mapped groups is not disabled when result is a multiple of count
    Given The response "default filter" is defined
    And The response "group mapping 20 load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The load more group mapped button is not disabled
    And A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    And The load more group mapped button is not disabled
    When I click on Load more groups mapped button
    Then The load more group mapped button is disabled

  Scenario: Load more mapped groups resets correctly after the limitation is triggered
    Given The response "default filter" is defined
    And The response "group mapping 30 load more" is defined
    And The response "search mapped group during limitation" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 30 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    And The load more group mapped button is disabled
    When The search input is filled with "A"
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed

  Scenario: Load more mapped group resets correctly after modal is reopened
    Given The response "default filter" is defined
    And The response "group mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    When I click on the "Close" button in modal
    And I click on edit group mapping button for first profile
    Then A list of 10 "Groups" mapped is displayed

  Scenario: Load more mapped groups resets correctly after we change the list of groups mapped
    Given The response "default filter" is defined
    And The response "group mapping load more" is defined
    And The response "group list" is defined
    And The response "add group and refresh list" is defined
    And The response "remove group and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    And I type "A" in the user input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    When I click on the remove "group" button in modal
    Then A list of 10 "Groups" mapped is displayed

  Scenario: The edit group mapping modal adds roles successfully
    Given The response "default filter" is defined
    And The response "group list" is defined
    And The response "refresh mapped group list" is defined
    And The response "add group and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    When I type "A" in the user input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The "group" list is not displayed
    And The group input is filled with "Acme"
    When The search input is filled with "A"
    And I erase one character
    Then The "group" list is displayed
    And The add button is disabled
    When I click on "Acme" in the list
    Then The "group" list is not displayed
    When I click on the "Add" button in modal
    Then There is a confirmation for a group mapping being added
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The api call has the correct information: "GROUP", "101", "1" for groups mapping
    And The list of group mappings is refreshed
    And The page is refreshed
    And The search input has the value "A"
    When I type "A" in the user input
    Then The "group" list is displayed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The "group" list is not displayed
    And The group input is filled with ""

  Scenario: The edit group mapping modal removes roles successfully
    Given The response "default filter" is defined
    And The response "refresh mapped group list" is defined
    And The response "remove group and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    And I click on the remove "group" button in modal
    Then There is a confirmation for a group mapping being removed
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The list of group mappings is refreshed
    And The page is refreshed
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit group mapping modal should display generic 500 error message
    Given The response "default filter" is defined
    And The response "500 during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    And I click on the remove "group" button in modal
    Then I see "500" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "500" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When I type "A" in the user input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "500" group mapping error message

  Scenario: The edit group mapping modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    And I click on the remove "group" button in modal
    Then I see "403" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "403" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When I type "A" in the user input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "403" group mapping error message

  Scenario: The edit group mapping modal should display group already exists error message
    Given The response "default filter" is defined
    And The response "group already exists during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    When I type "A" in the user input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "group already exists" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "group already exists" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed

  Scenario: The edit group mapping modal should display group does not exist error message
    Given The response "default filter" is defined
    And The response "group does not exist during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    When I type "A" in the user input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "group does not exist" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "group does not exist" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed

  Scenario: The edit group mapping modal should display member does not exist error message
    Given The response "default filter" is defined
    And The response "member does not exist during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    When I type "A" in the user input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "member does not exist" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "member does not exist" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed