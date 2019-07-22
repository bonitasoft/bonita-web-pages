Feature: Form case overview

  Scenario: The case overview shows the correct archived case IDs
    Given The archived case "30003" server response is defined
    And The archived case "30003" empty context server response is defined
    And The archived case "30003" empty document server response is defined
    When I visit the archived case index page
    Then I can see both IDs have correct values

  Scenario: The case overview shows the correct open case ID
    Given The open case "30004" server response is defined
    And The open case "30004" empty context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I can see the open case ID
    And I cannot see the archived case ID

  Scenario: The case overview shows the correct data table keys
    Given The open case "30004" server response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    And The open case business data is defined
    When I visit the open case index page
    Then The correct BDM headers are visible
    And The incorrect BDM headers don't exist