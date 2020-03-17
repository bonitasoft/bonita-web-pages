Feature: The Admin Case Details in desktop resolution

  Scenario: The admin case details displays the correct attributes
    Given The response "default details" is defined
    When I visit the admin case details page
    Then The case details have the correct information

  Scenario: The admin case details displays no search keys
    Given The response "default details without search keys" is defined
    When I visit the admin case details page
    Then There are no search keys

  Scenario: The admin case details has the correct link to case list
    Given The response "default details" is defined
    When I visit the admin case details page
    Then The back button has correct href

  Scenario: The admin case details has the correct link to case overview
    Given The response "default details" is defined
    When I visit the admin case details page
    And I click on case overview button
    Then The case overview url is displayed

  Scenario: The admin case details display monitoring for less than 10 tasks correctly
    Given The response "monitor 9 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "9" tasks
    And The task list link has correct href
    And The no task message is not visible

  Scenario: The admin case details display monitoring for exactly 10 tasks correctly
    Given The response "monitor 10 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "10" tasks

  Scenario: The admin case details display monitoring for more than 10 tasks correctly
    Given The response "monitor 10+ tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "11" tasks

  Scenario: The admin case details display monitoring for no tasks correctly
    Given The response "monitor 0 tasks" is defined
    When I visit the admin case details page
    Then The monitoring have the correct information for "0" tasks
    And The task list link is not visible

  Scenario: The admin case details display comments correctly
    Given The response "comments" is defined
    When I visit the admin case details page
    Then The comments have the correct information
    And "No (more) comments to display" is shown at the end of the comments
    And There is no "System comment"

  Scenario: The admin case details should add a new comment
    Given The response "add new comment" is defined
    When I visit the admin case details page
    Then There are no comments
    And The add comment button is "disabled"
    When I fill in the new comment
    Then The add comment button is "enabled"
    When I click on add comment button
    Then There is a new comment
    And The new comment input is empty
    Then The add comment button is "disabled"

  Scenario: The admin case details should display an archived case
    Given The response "archived case" is defined
    When I visit the admin case details page
    Then The state is "completed"
    And The input placeholder is "Comments cannot be added to archived cases"
    And The input placeholder is not "Type new comment"