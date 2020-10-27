Feature: The admin profiles mapping with roles in desktop resolution

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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    And The load more role mapped button is disabled

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
    And I type "E" in the selection input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    And I click on the "Add" button in modal
    Then A list of 10 "Roles" mapped is displayed
    When I click on Load more roles mapped button
    Then A list of 20 "Roles" mapped is displayed
    When I click on the remove "role" button in modal
    Then A list of 10 "Roles" mapped is displayed

  Scenario: The roles mapping modal should display information about typing more
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "role list with 10 elements" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit role mapping button for first profile
    Then The edit role mapping modal is open and has a default state for "Edit role mapping of Custom profile 1" profile
    And The "role selection" list is not displayed
    When I type "E" in the selection input
    Then The "role" list is displayed
    And The type more message is displayed and disabled
    When I type "x" in the selection input
    Then The type more message is not displayed

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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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
    When I type "E" in the selection input
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