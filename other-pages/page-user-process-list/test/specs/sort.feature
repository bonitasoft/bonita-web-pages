Feature: Process list sort

  Scenario: Initial load uses ascending displayName sort
    Given the process list page is loaded with the test fixtures
    Then the processes API was called with sort "displayName ASC"
    And the Name column header shows the "ascending" sort indicator

  Scenario: Toggling the Name column flips ASC -> DESC
    Given the process list page is loaded with the test fixtures
    When I click the Name column header
    Then the processes API was called with sort "displayName DESC"
    And the Name column header shows the "descending" sort indicator

  Scenario: Toggling twice returns to ASC
    Given the process list page is loaded with the test fixtures
    When I click the Name column header
    And I click the Name column header
    Then the processes API was called with sort "displayName ASC"
    And the Name column header shows the "ascending" sort indicator
