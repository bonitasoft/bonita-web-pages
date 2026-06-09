Feature: Instantiate a process that has a start form

  Scenario: Clicking a row navigates to the iframe view
    Given the process list page is loaded with a process having a form
    When I click the row for "Create supplier"
    Then the instantiation iframe is visible
    And the iframe src targets process "Create supplier" version "1.0"

  Scenario: Successful postMessage from the form returns to the list and shows a success toast
    Given the process list page is loaded with a process having a form
    When I click the row for "Create supplier"
    And the form posts a successful instantiation message
    Then the process list view is shown again
    And a success toast with the case id "42" is displayed

  Scenario: Error postMessage from the form shows an error toast (and stays on the iframe)
    Given the process list page is loaded with a process having a form
    When I click the row for "Create supplier"
    And the form posts an error instantiation message
    Then an error toast for the failed instantiation is displayed
    And the instantiation iframe is visible
