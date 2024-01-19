Feature: The user case list in small screen resolution

  Scenario: The user case list is able to switch between tabs
    Given The resolution is set to mobile
    And A list of open cases is available
    And A list of archived cases is available
    And A user session is available
    When I visit the user case list page
    Then A list of open cases is displayed
    And The tasks field is not displayed in mobile view
    When I click on "Archived cases" tab
    Then A list of archived cases is displayed