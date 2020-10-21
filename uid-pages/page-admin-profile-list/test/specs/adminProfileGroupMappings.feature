Feature: The Admin Profiles in desktop resolution

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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
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
    And The load more group mapped button is disabled

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
    And I type "A" in the selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Groups" mapped is displayed
    When I click on Load more groups mapped button
    Then A list of 20 "Groups" mapped is displayed
    When I click on the remove "group" button in modal
    Then A list of 10 "Groups" mapped is displayed

  Scenario: The edit group mapping modal adds groups successfully
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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
    Then The "group" list is displayed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The "group" list is not displayed
    And The group input is filled with ""

  Scenario: The edit group mapping modal removes groups successfully
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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
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
    When I type "A" in the selection input
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
