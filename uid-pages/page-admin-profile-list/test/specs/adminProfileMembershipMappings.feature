Feature: The admin profiles mapping with memberships in desktop resolution

  Scenario: The edit membership mapping modal is opened and closed
    Given The response "default filter with headers" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    Then A list of 8 items is displayed
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit membership mapping modal changes profile id correctly
    Given The response "default filter with headers" is defined
    And The response "mapping" is defined
    And The response "membership list" is defined
    And The response "add membership and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    Then The role input in membership is filled with "Executive"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    When I click on the "Add" button in modal
    Then The api call has the correct information: "4", "101", "1" for memberships mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on show organization mapping button for second profile without closing the first
    Then I see the mapping information for second profile
    When I click on edit membership mapping button for second profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Administrator" profile
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    Then The role input in membership is filled with "Executive"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    And I click on the "Add" button in modal
    Then The api call has the correct information: "4", "2", "1" for memberships mapping
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit membership mapping search works correctly
    Given The response "default filter with headers" is defined
    And The response "mapping" is defined
    And The response "search mapped membership" is defined
    When I visit the admin profiles page
    When I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    When The mapped membership search input is filled with "Executive"
    Then The api call is made for "Executive"
    When I erase the search filter in the modal
    When The search input is filled with "Search term with no match"
    Then No membership mappings are displayed

  Scenario: Load more mapped memberships button works correctly for membership mapping
    Given The response "default filter with headers" is defined
    And The response "membership mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The load more membership mapped button is not disabled
    And A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    And A list of 20 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 28 "Memberships" mapped is displayed
    And The load more membership mapped button is disabled

  Scenario: Load more mapped memberships is disabled when result is a multiple of count
    Given The response "default filter with headers" is defined
    And The response "membership mapping 20 load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The load more membership mapped button is not disabled
    And A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed
    And The load more membership mapped button is disabled

  Scenario: Load more mapped memberships resets correctly after the limitation is triggered
    Given The response "default filter with headers" is defined
    And The response "membership mapping 30 load more" is defined
    And The response "search mapped membership during limitation" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 30 "Memberships" mapped is displayed
    And The load more membership mapped button is disabled
    When The mapped membership search input is filled with "E"
    Then A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed

  Scenario: Load more mapped membership resets correctly after modal is reopened
    Given The response "default filter with headers" is defined
    And The response "membership mapping load more" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed
    When I click on the "Close" button in modal
    And I click on edit membership mapping button for first profile
    Then A list of 10 "Memberships" mapped is displayed

  Scenario: Load more mapped memberships resets correctly after we change the list of memberships mapped
    Given The response "default filter with headers" is defined
    And The response "membership mapping load more" is defined
    And The response "membership list" is defined
    And The response "add membership and refresh list" is defined
    And The response "remove membership and refresh list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive" in the list
    Then The role input in membership is filled with "Executive"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    And I click on the "Add" button in modal
    Then A list of 10 "Memberships" mapped is displayed
    When I click on Load more memberships mapped button
    Then A list of 20 "Memberships" mapped is displayed
    When I click on the remove "membership" button in modal
    And A list of 10 "Memberships" mapped is displayed

  Scenario: The memberships mapping modal should display information about typing more
    Given The response "default filter with headers" is defined
    And The response "mapping" is defined
    And The response "membership list with 10 elements" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The "role selection" list is not displayed
    When I type "E" in the role selection input
    Then The "role" list is displayed
    And The type more message is displayed and disabled
    When I type "x" in the selection input
    Then The type more message is not displayed
    When I click on "Executive Assistants" in the list
    Then The role input in membership is filled with "Executive Assistants"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    And The type more message is displayed and disabled
    When I type "c" in the group selection input
    Then The type more message is not displayed

  Scenario: The edit membership mapping modal adds memberships successfully
    Given The response "default filter with headers" is defined
    And The response "membership list" is defined
    And The response "refresh mapped membership list" is defined
    And The response "add membership and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    Then The role input in membership is filled with "Executive Assistants"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    When The mapped membership search input is filled with "Acme"
    And I erase one character
    Then The "membership" list is displayed
    And The add button is disabled
    When I click on "Executive Assistants" in the list
    Then The "membership" list is not displayed
    When I click on the "Add" button in modal
    Then There is a confirmation for a membership mapping being added
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The api call has the correct information: "14", "101", "1" for memberships mapping
    And The list of membership mappings is refreshed
    And The page is refreshed
    And The mapped membership search input has the value "Acme"
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The "membership" list is not displayed
    And The role input in membership is filled with ""
    And The group input in membership is filled with ""

  Scenario: The edit membership mapping modal removes memberships successfully
    Given The response "default filter with headers" is defined
    And The response "refresh mapped membership list" is defined
    And The response "remove membership and refresh list" is defined
    And The response "mapping" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    Then I see the mapping information for first profile
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I click on the remove "membership" button in modal
    Then There is a confirmation for a membership mapping being removed
    When I wait for 2000
    And I click inside the modal
    Then There is no error or success
    And The list of membership mappings is refreshed
    And The page is refreshed
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed

  Scenario: The edit membership mapping modal should display generic 500 error message
    Given The response "default filter with headers" is defined
    And The response "500 during edit membership mapping" is defined
    And The response "membership list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I click on the remove "membership" button in modal
    Then I see "500" membership mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "500" membership mapping error message
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    And I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "500" membership mapping error message

  Scenario: The edit membership mapping modal should display generic 403 error message
    Given The response "default filter with headers" is defined
    And The response "403 during edit membership mapping" is defined
    And The response "membership list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I click on the remove "membership" button in modal
    Then I see "403" membership mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "403" membership mapping error message
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    And I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "403" membership mapping error message

  Scenario: The edit membership mapping modal should display membership already exists error message
    Given The response "default filter with headers" is defined
    And The response "membership already exists during edit membership mapping" is defined
    And The response "membership list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    Then The role input in membership is filled with "Executive Assistants"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    When I click on the "Add" button in modal
    Then I see "membership already exists" membership mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "membership already exists" membership mapping error message
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed

  Scenario: The edit membership mapping modal should display membership does not exist error message
    Given The response "default filter with headers" is defined
    And The response "membership does not exist during edit membership mapping" is defined
    And The response "membership list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I type "E" in the role selection input
    Then The "role" list is displayed
    When I click on "Executive Assistants" in the list
    Then The role input in membership is filled with "Executive Assistants"
    When I type "A" in the group selection input
    Then The "group" list is displayed
    When I click on "Acme" in the list
    Then The group input in membership is filled with "Acme"
    And I click on the "Add" button in modal
    Then I see "membership does not exist" membership mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "membership does not exist" membership mapping error message
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed

  Scenario: The edit membership mapping modal should display member does not exist error message
    Given The response "default filter with headers" is defined
    And The response "member does not exist during edit membership mapping" is defined
    And The response "membership list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed
    When The mapped membership search input is filled with "A"
    And I type "E" in the role selection input
    And I click on "Executive Assistants" in the list
    And I type "A" in the group selection input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "member does not exist" membership mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I see "member does not exist" membership mapping error message
    And The mapped membership search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit membership mapping button for first profile
    Then The edit membership mapping modal is open and has a default state for "Edit membership mapping of Custom profile 1" profile
    And The mapped membership list is displayed