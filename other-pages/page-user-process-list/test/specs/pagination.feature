Feature: Process list pagination

  Scenario: Initial load shows page 1 with the right status
    Given the process list page is loaded with 15 processes spread across 2 pages
    Then I see 10 processes in the list
    And the pagination status shows "1-10"
    And the processes API was called with page "0"

  Scenario: Clicking Next advances to page 2 and updates status
    Given the process list page is loaded with 15 processes spread across 2 pages
    When I click the next-page pager button
    Then I see 5 processes in the list
    And the pagination status shows "11-15"
    And the processes API was called with page "1"

  Scenario: Clicking Previous returns to page 1
    Given the process list page is loaded with 15 processes spread across 2 pages
    When I click the next-page pager button
    And I click the previous-page pager button
    Then I see 10 processes in the list
    And the pagination status shows "1-10"

  Scenario: Clicking Last jumps to the last page directly
    Given the process list page is loaded with 15 processes spread across 2 pages
    When I click the last-page pager button
    Then I see 5 processes in the list
    And the pagination status shows "11-15"
