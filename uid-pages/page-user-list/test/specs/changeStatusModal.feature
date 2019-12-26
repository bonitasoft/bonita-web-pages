Feature: change status modal in desktop resolution

  Scenario: The change status button depends on user status
    Given The filter response "default filter" is defined
    And The filter response "inactive user" is defined
    When I visit the user list page
    Then The first user has the "remove" button
    When I filter show inactive users
    Then The first user has the "ok" button

  Scenario: The change status modal is displayed and closed
    Given The filter response "default filter" is defined
    When I visit the user list page
    And I click on "remove" button on the user "1"
    Then The change status modal is displayed for "Giovanna Almeida"
    When I click on cancel button in the modal
    Then The modal is closed

  Scenario: The change status modal displays the correct user name
    Given The filter response "default filter" is defined
    When I visit the user list page
    And I click on "remove" button on the user "1"
    Then The change status modal is displayed for "Giovanna Almeida"
    When I click on cancel button in the modal
    And I click on "remove" button on the user "2"
    Then The change status modal is displayed for "daniela.angelo"
    When I click on cancel button in the modal
    And I click on "remove" button on the user "3"
    Then The change status modal is displayed for "walter.bates"
    When I click on cancel button in the modal
    And I click on "remove" button on the user "4"
    Then The change status modal is displayed for "isabel.bleasdale"

  Scenario: The change status modal displays the correct action
    Given The filter response "default filter" is defined
    And The filter response "inactive user" is defined
    When I visit the user list page
    And I click on "remove" button on the user "1"
    Then The "Deactivate" title is displayed
    And The "Deactivate" button is displayed
    When I click on cancel button in the modal
    And I filter show inactive users
    And I click on "ok" button on the user "1"
    Then The "Activate" title is displayed
    And The "Activate" button is displayed

  Scenario: The change status modal should deactivate a user
    Given The filter response "default filter" is defined
    And Deactivate user response is defined
    When I visit the user list page
    And I click on "remove" button on the user "1"
    When I click on "Deactivate" button in modal
    Then The api call is made for "deactivate user"
    And The api call is made for "refresh list"
    And The modal is closed
