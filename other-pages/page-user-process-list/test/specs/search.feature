Feature: Process list search

  Scenario: Submitting a search calls the API with the search value
    Given the process list page is loaded with the test fixtures
    When I type "supplier" in the search field
    And I submit the search form
    Then the processes API was called with search "supplier"

  Scenario: Clearing the search calls the API with an empty search value
    Given the process list page is loaded with the test fixtures
    When I type "supplier" in the search field
    And I submit the search form
    And I clear the search field
    Then the processes API was called with search ""
