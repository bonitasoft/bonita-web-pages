Feature: The user open case list in desktop resolution

  Scenario: The user case list is able to switch between tabs
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    When I visit the user case list page
    Then A list of open cases is displayed
    When I click on "Archived cases" tab
    Then A list of archived cases is displayed
    When I click on "Open cases" tab
    Then A list of open cases is displayed

  Scenario: The user case list displays the correct Ids
    Given A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    When I visit the user case list page
    Then The "open" cases have the correct Ids
    When I click on "Archived cases" tab
    Then The "archived" cases have the correct Ids

  Scenario: The user case list filter by process name works correctly
    Given A list of open cases is available
    And A user session is available
    And A list of processes is available
    And The filter responses process name are defined
    When I visit the user case list page
    Then A list of open cases is displayed
    When I select "Another My Pool" in "process name" filter
    Then I see only the filtered open cases by "process name"
    And I don't see the cases that are unmatched by the "process name" filter
    When I select "All processes" in "process name" filter
    Then A list of open cases is displayed
