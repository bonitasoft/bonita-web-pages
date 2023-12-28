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
    When I type "H" in the user selection input
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
    When I type "H" in the user selection input
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
    When I type "Helen" in search input
    Then The api call is made for "Helen"
    When I erase the search filter in the modal
    And I type "&Speci@lUser" in search input
    Then The api call is made for "&Speci@lUser"
    When I erase the search filter in the modal
    And I type "Search term with no match" in search input
    Then No user mappings are displayed

  Scenario: The users mapping modal should display information about typing more
    Given The response "default filter" is defined
    And The response "mapping" is defined
    And The response "user list with 10 elements" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The "user selection" list is not displayed
    When I type "U" in the user selection input
    Then The "user" list is displayed
    And The type more message is displayed and disabled
    When I type "s" in the user selection input
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
    When I type "H" in the user selection input
    Then The "user" list is displayed
    When I click on "Helen Kelly" in the list
    Then The "user" list is not displayed
    And The user input is filled with "Helen Kelly"
    When I type "H" in search input
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
    When I type "H" in the user selection input
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
    When I type "H" in search input
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
    When I type "H" in search input
    And I click on the remove "user" button in modal
    Then I see "500" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I don't see "500" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in the user selection input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "500" user mapping error message

  Scenario: The edit user mapping modal should display generic 404 error message
    Given The response "default filter" is defined
    And The response "404 during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in search input
    And I click on the remove "user" button in modal
    Then I see "404" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I don't see "404" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in the user selection input
    And I click on "Helen Kelly" in the list
    And I click on the "Add" button in modal
    Then I see "404" user mapping error message

  Scenario: The edit user mapping modal should display generic 403 error message
    Given The response "default filter" is defined
    And The response "403 during edit user mapping" is defined
    And The response "user list" is defined
    When I visit the admin profiles page
    And I click on show organization mapping button for first profile
    And I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in search input
    And I click on the remove "user" button in modal
    Then I see "403" user mapping error message
    When I wait for 2000
    And I click inside the modal
    Then I don't see "403" user mapping error message
    And The search input has the value "H"
    When I click on the "Close" button in modal
    Then There is no modal displayed
    When I click on edit user mapping button for first profile
    Then The edit user mapping modal is open and has a default state for "Edit user mapping of Custom profile 1" profile
    And The mapped user list is displayed
    When I type "H" in the user selection input
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
    When I type "H" in search input
    When I type "H" in the user selection input
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
    When I type "H" in search input
    When I type "H" in the user selection input
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
    When I type "H" in search input
    When I type "H" in the user selection input
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