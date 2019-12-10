Feature: The %Template Page Name% in mobile resolution

  Scenario: The %templatePageName% is running in mobile resolution
    Given The resolution is set to mobile
    And %We mock something%
    When I visit the index page
    Then %I'm checking something on the page%