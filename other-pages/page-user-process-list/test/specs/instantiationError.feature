Feature: Error toast on instantiation failure (regression for previously-swallowed error)

  Scenario: A failed POST instantiation shows an error toast
    Given the process list page is loaded and the instantiation API will fail
    When I click the row for "Create supplier"
    And I click Start in the confirm modal
    Then an error toast for the failed instantiation is displayed
    And the confirm modal is NOT visible
