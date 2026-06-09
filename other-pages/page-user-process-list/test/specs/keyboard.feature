Feature: Keyboard accessibility

  Scenario: Pressing Enter on a process row activates the instantiation flow
    Given the process list page is loaded with a process that has no form
    When I press Enter on the row for "Create supplier"
    Then the confirm modal is visible

  Scenario: Pressing Escape on the confirm modal closes it without instantiating
    Given the process list page is loaded with a process that has no form
    When I click the row for "Create supplier"
    And I press the Escape key
    Then the confirm modal is NOT visible
