Feature: The resources page

  Scenario: Resources are displayed correctly
    Given The user has resources
    When The user visits the resources page
    Then The user see the list resources