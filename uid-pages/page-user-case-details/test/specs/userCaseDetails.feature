Feature: The User Case Details in desktop resolution

  Scenario: The user case details displays the correct attributes
    Given The response "default details" is defined
    Given The response "available tasks" is defined
    When I visit the user case details page
    Then The case details have the correct information

  Scenario: The user case details displays no search keys
    Given The response "default details without search keys" is defined
    When I visit the user case details page
    Then There are no search keys

  Scenario: The user case details has the correct link to case list
    Given The response "default details" is defined
    When I visit the user case details page
    Then The back button has correct href

  Scenario: The user case details has the correct link to case overview
    Given The response "default details" is defined
    When I visit the user case details page
    And I click on case overview button
    Then The case overview url is displayed

  Scenario: The user case details display comments correctly
    Given The response "default details" is defined
    And The response "comments" is defined
    When I visit the user case details page
    Then The comments have the correct information
    And "No (more) comments to display" is shown at the end of the comments
    And There is no "System comment"

  Scenario: The user case details should add a new comment
    Given The response "default details" is defined
    And The response "add new comment" is defined
    When I visit the user case details page
    Then There are no comments
    And The add comment button is "disabled"
    When I fill in the new comment
    Then The add comment button is "enabled"
    When I click on add comment button
    Then There is a new comment
    And The new comment input is empty
    Then The add comment button is "disabled"

  Scenario: The user case details should display an archived case
    Given The response "archived case" is defined
    And The response "archived comments" is defined
    When I visit the user case details page
    Then The state is "completed"
    And There is no tasks
    And The input placeholder is "Comments cannot be added to archived cases"
    And The input placeholder is not "Type new comment"
    And The comments have the correct information

  Scenario: No case is found with id message is shown
    When I visit the user case details page
    Then I see that "No case found with id: 1"

  Scenario: No id is specified message is shown
    When I visit the user case details page without an id
    Then I see that "Case id not provided. Unable to retrieve the case."

  Scenario: No id is specified message is shown when id is empty
    When I visit the user case details page with an empty id
    Then I see that "Case id not provided. Unable to retrieve the case."
