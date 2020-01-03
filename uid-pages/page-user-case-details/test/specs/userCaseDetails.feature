Feature: The User Case Details in desktop resolution

  Scenario: The user case details displays the correct attributes
    Given The response "default details" is defined
    When I visit the user case details page
    Then The case details have the correct information

  Scenario: The user case details display comments correctly
    Given The response "comments" is defined
    When I visit the user case details page
    Then The comments have the correct information

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

  Scenario: The user case details should add a new comment
    Given The response "add new comment" is defined
    When I visit the user case details page
    Then There are no comments
    When I fill in the new comment
    And I click on add comment button
    Then There is a new comment
    And The new comment input is empty

  Scenario: The user case details should display an archived case
    Given The response "archived case" is defined
    When I visit the user case details page
    Then The state is "completed"
    And There is no tasks