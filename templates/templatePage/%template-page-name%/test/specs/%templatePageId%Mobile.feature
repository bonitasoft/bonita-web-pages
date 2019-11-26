Feature: The %templatePageName% in desktop resolution

  Scenario: The %templatePageName% is running in mobile resolution
    Given The resolution is set to mobile
    And %Something%
    When I visit the index page
    Then %I see something on the page%