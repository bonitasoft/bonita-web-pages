Feature: The Admin Profiles in desktop resolution

  Scenario: The profiles displays the correct attributes
    Given The response "default filter with headers" is defined
    When I visit the admin profiles page
    Then The profiles page has the correct information

  Scenario: The profiles list sort by works correctly
    Given The response "default filter with headers" is defined
    And The response "sort by" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"

  Scenario: The profiles list search works correctly
    Given The response "default filter with headers" is defined
    And The response "search" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I put "Administrator" in "search" filter field
    Then The api call is made for "Administrator"
    And A list of 1 items is displayed
    When I erase the search filter
    And I put "&Speci@lProfile" in "search" filter field
    Then The api call is made for "&Speci@lProfile"
    And A list of 1 items is displayed
    When I erase the search filter
    Then A list of 8 items is displayed
    When I put "Search term with no match" in "search" filter field
    Then No profiles are displayed

  Scenario: The delete profile modal is opened and closed
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on delete button for first profile
    Then The delete modal is open and has a default state for "Delete Custom profile 1"
    When I click on the "Cancel" button in modal footer
    Then There is no modal displayed

  Scenario: The delete profile modal deletes successfully
    Given The response "profile deletion success" is defined
    And The response "refresh list after delete" is defined
    And The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    And The response "default filter with headers" is defined
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
    And The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    And The response "default filter with headers" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on edit button for first profile
    Then The edit modal is open and has a default state for "Edit profile Custom profile 1" for profile 1
    When I click on the "Cancel" button in modal
    Then There is no modal displayed

  Scenario: The edit profile modal shows different information when opening another profile
    Given The response "refresh not called" is defined
    And The response "default filter with headers" is defined
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
    And The response "default filter with headers" is defined
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
    And The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    Then I can export a profile

  Scenario: The organization mapping show and hide button works correctly
    Given The response "default filter with headers" is defined
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

  Scenario: The do for button is not displayed when feature does not exist
    Given The response "default filter with missing features" is defined
    When I visit the admin profiles page
    Then Some features are not available