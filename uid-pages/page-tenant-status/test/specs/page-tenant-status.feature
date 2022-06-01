Feature: The Tenant-Status

  Scenario: Tenant is paused
    Given I'm user with "en" bos_local
    Given Server tenant is paused
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "RESUME" button

  Scenario: Tenant is running
    Given I'm user with "en" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "PAUSE" button

  Scenario: Tenant opens a modal window on pressing the status button while server tenant is running
    Given I'm user with "en" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I press the modal opening button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Tenant opens a modal window on pressing the status button while server tenant is paused
    Given I'm user with "en" bos_local
    Given Server tenant is paused
    Given I'm logged as technical user
    When I press the modal opening button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Tenant changes status when pressing the status button inside the modal while server tenant is running
    Given I'm user with "en" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I press the modal opening button
    And I press the status changing button
    Then Server tenant is paused

  Scenario: Tenant changes status when pressing the status button inside the modal while server tenant is paused
    Given I'm user with "en" bos_local
    Given Server tenant is paused
    Given I'm logged as technical user
    When I press the modal opening button
    And I press the status changing button
    Then Server tenant is running

  Scenario: Modal window closes when pressing the close button inside it while server tenant is running
    Given I'm user with "en" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I press the modal opening button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Modal window closes when pressing the close button inside it while server tenant is paused
    Given I'm user with "en" bos_local
    Given Server tenant is paused
    Given I'm logged as technical user
    When I press the modal opening button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Tenant is running in French
    Given I'm user with "fr" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "SUSPENDRE" button

  Scenario: Tenant is running in Spanish
    Given I'm user with "es" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "PAUSAR" button