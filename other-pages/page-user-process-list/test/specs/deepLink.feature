Feature: Deep-link instantiation via URL params

  Scenario: Visiting the page with processName and processVersion auto-navigates to the iframe
    Given I visit the page with deep-link params for "Create supplier" "1.0"
    Then the instantiation iframe is visible
    And the iframe src targets process "Create supplier" version "1.0"
