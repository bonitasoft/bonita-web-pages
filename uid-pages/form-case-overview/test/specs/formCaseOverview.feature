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

  Scenario: The case overview shows case started by the user
    Given The open case "30004" server response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by Walter Bates"

  Scenario: The case overview shows case started by system
    Given The open case "30004" started by system response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by System"

  Scenario: The case overview shows case started by system for the user
    Given The open case "30004" started by system for user response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by System for Walter Bates"

  Scenario: The case overview shows case started by system for the user without first name
    Given The open case "30004" started by system for user without first name response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by System for walter.bates"

  Scenario: The case overview shows case started by system for the user without last name
    Given The open case "30004" started by system for user without last name response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by System for walter.bates"

  Scenario: The case overview shows case started by user for another user
    Given The open case "30004" started by user for another user
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    When I visit the open case index page
    Then I see case "Started by Walter Bates for Helen Kelly"

  Scenario: The case overview shows task executed by user
    Given The open case "30004" server response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    And A list of executed tasks server response is defined
    When I visit the open case index page
    Then I see task "Executed by Walter Bates"

  Scenario: The case overview shows task executed by system for user
    Given The open case "30004" server response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    And A list of executed tasks by system for user server response is defined
    When I visit the open case index page
    Then I see task "Executed by System for Walter Bates"

  Scenario: The case overview shows task executed by user for user
    Given The open case "30004" server response is defined
    And The open case "30004" context server response is defined
    And The open case "30004" empty document server response is defined
    And A list of executed tasks by user for user server response is defined
    When I visit the open case index page
    Then I see task "Executed by Walter Bates for Helen Kelly"

  Scenario: No case is found with id
    When I visit the open case index page
    Then I see that "No case found with id: 30004"

  Scenario: No id is specified
    When I visit the open case index page without an id
    Then I see that "Case id not provided. Unable to retrieve the case."