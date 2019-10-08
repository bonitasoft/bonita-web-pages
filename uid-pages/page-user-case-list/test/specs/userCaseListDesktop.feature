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