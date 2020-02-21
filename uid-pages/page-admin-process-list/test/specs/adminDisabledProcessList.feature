Feature: The disabled process list in desktop resolution

  Scenario: The disabled process list displays the correct attributes
    Given The page response "default filter" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then The disabled process list have the correct information
    And The disabled process list have the correct item shown number

  Scenario: The disabled process list filtered by state works correctly
    Given The page response "default filter" is defined for disabled processes
    And The page response "state" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then A list of "5" items is displayed
    When I put "Resolved only" in "state" filter field in disabled processes list
    Then The api call is made for "Resolved only" processes
    And A list of "3" items is displayed
    When I put "Resolved and unresolved" in "state" filter field in disabled processes list
    And A list of "5" items is displayed

  Scenario: The enabled process modal is displayed and closed
    Given The page response "default filter" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    Then The "Enable" process modal is displayed for "Pool 1 (1.0)"
    And The correct text is shown in enable modal
    When I click on close button in the modal
    Then The modal is closed

  Scenario: The enable process modal should display enabling
    Given The page response "default filter" is defined for disabled processes
    And The page response "delay enable" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    And I click on "ok" button on the item "2"
    And I click on enable button in modal
    Then I see enabling message
    When I click on close button in the modal
    And I click on "ok" button on the item "2"
    Then The correct text is shown in enable modal

  Scenario: The enable button is disabled for unresolved processes
    Given The page response "default filter" is defined for disabled processes
    When I visit admin process list page
    And I click on Disabled tab
    Then The "ok" button is disabled for item "1"