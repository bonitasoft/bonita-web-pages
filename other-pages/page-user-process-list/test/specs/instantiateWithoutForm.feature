Feature: Instantiate a process that has no start form

  Scenario: Clicking a row opens the confirm modal
    Given the process list page is loaded with a process that has no form
    When I click the row for "Create supplier"
    Then the confirm modal is visible

  Scenario: Confirming instantiates the process and shows a success toast
    Given the process list page is loaded with a process that has no form
    When I click the row for "Create supplier"
    And I click Start in the confirm modal
    Then a success toast with the case id "42" is displayed
    And the confirm modal is NOT visible
    And the process list view is shown again

  Scenario: Cancelling the confirm modal does not call the instantiation API
    Given the process list page is loaded with a process that has no form
    When I click the row for "Create supplier"
    And I click Cancel in the confirm modal
    Then the confirm modal is NOT visible
    And the process list view is shown again
