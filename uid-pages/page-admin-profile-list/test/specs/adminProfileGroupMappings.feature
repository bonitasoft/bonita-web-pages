Feature: The admin profiles mapping with groups in desktop resolution

  Scenario: The edit group mapping modal is opened and closed
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    And The search input is filled with "&Speci@lGroup"
    Then The api call is made for "&Speci@lGroup"
    When I erase the search filter in the modal
    And The search input is filled with "Search term with no match"
    Then No group mappings are displayed

  Scenario: The groups mapping modal should display information about typing more
    Given The response "default filter with headers" is defined
    And The response "mapping" is defined
    And The response "group list with 10 elements" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The "group selection" list is not displayed
    When I type "A" in the selection input
    Then The "group" list is displayed
    And The type more message is displayed and disabled
    When I type "s" in the selection input
    Then The type more message is not displayed

  Scenario: The edit group mapping modal adds groups successfully
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Then I don't see "500" group mapping error message
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

  Scenario: The edit group mapping modal should display generic 404 error message
    Given The response "default filter with headers" is defined
    And The response "404 during edit group mapping" is defined
    And The response "group list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When The search input is filled with "A"
    And I click on the remove "group" button in modal
    Then I see "404" group mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I don't see "404" group mapping error message
    And The search input has the value "A"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit group mapping button for first profile
    Then The edit group mapping modal is open and has a default state for "Edit group mapping of Custom profile 1" profile
    And The mapped group list is displayed
    When I type "A" in the selection input
    And I click on "Acme" in the list
    And I click on the "Add" button in modal
    Then I see "404" group mapping error message

  Scenario: The edit group mapping modal should display generic 403 error message
    Given The response "default filter with headers" is defined
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
    Then I don't see "403" group mapping error message
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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
    Given The response "default filter with headers" is defined
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