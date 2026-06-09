Feature: Process list and category filter

  Scenario: Loading the process list shows the rows from the API
    Given the process list page is loaded with the test fixtures
    Then I see 3 processes in the list
    And the process row "Create supplier" is visible
    And the process row "Init sample procurement data" is visible
    And the process row "Procurement request" is visible

  Scenario: The empty state is shown when no processes are returned
    Given the process list page is loaded with no processes
    Then the empty state is displayed

  Scenario: Selecting a category filter calls the API with the categoryId filter
    Given the process list page is loaded with two categories available
    When I select the "Procurement" category
    Then the processes API was called with category filter "102"

  Scenario: Selecting "All categories" omits the categoryId filter
    Given the process list page is loaded with two categories available
    When I select the "Procurement" category
    And I select the "All categories" category
    Then the processes API was NOT called with a category filter
