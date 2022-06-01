Feature: The admin profiles mapping with users in desktop resolution

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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    And The load more user mapped button is disabled

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
    And I type "H" in the selection input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Users" mapped is displayed
    When I click on Load more users mapped button
    Then A list of 20 "Users" mapped is displayed
    When I click on the remove "user" button in modal
    Then A list of 10 "Users" mapped is displayed

  Scenario: The users mapping modal should display information about typing more
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "user list with 10 elements" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The "user selection" list is not displayed
    When I type "U" in the selection input
    Then The "user" list is displayed
    And The type more message is displayed and disabled
    When I type "s" in the selection input
    Then The type more message is not displayed

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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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
    When I type "H" in the selection input
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