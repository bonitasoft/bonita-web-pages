Feature: The Tenant-Status

  Scenario: The license information is displayed correctly
    Given I'm user with "en" bos_local
    And I'm logged as technical user
    And The license information is defined
    When I open tenant-status page
    Then I see the license information is displayed correctly

  Scenario: The license information is hidden correctly in the community edition
    Given I'm user with "en" bos_local
    And I'm logged as technical user
    When I open tenant-status page
    Then I see the license information is displayed correctly for the community edition

  Scenario: Tenant is paused
    Given I'm user with "en" bos_local
    And Server tenant is paused
    And I'm logged as technical user
    And The license information is defined
    When I open tenant-status page
    Then I see "RESUME" button

  Scenario: Tenant is running
    Given I'm user with "en" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I open tenant-status page
    Then I see "PAUSE" button

  Scenario: Tenant opens a modal window on pressing the status button while server tenant is running
    Given I'm user with "en" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Tenant opens a modal window on pressing the status button while server tenant is paused
    Given I'm user with "en" bos_local
    And Server tenant is paused
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Tenant changes status when pressing the status button inside the modal while server tenant is running
    Given I'm user with "en" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    And I press the status changing button
    Then Server tenant is paused

  Scenario: Tenant changes status when pressing the status button inside the modal while server tenant is paused
    Given I'm user with "en" bos_local
    And Server tenant is paused
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    And I press the status changing button
    Then Server tenant is running

  Scenario: Modal window closes when pressing the close button inside it while server tenant is running
    Given I'm user with "en" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Modal window closes when pressing the close button inside it while server tenant is paused
    Given I'm user with "en" bos_local
    And Server tenant is paused
    And I'm logged as technical user
    And The license information is defined
    When I press the modal opening button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Tenant refreshes when the state changes
    Given I'm user with "en" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    And The tenant status page can refresh
    When I open tenant-status page
    When I press the modal opening button
    And I press the status changing button
    Then There is an API call for refreshing the page

  Scenario: Tenant is running in French
    Given I'm user with "fr" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I open tenant-status page
    Then I see "SUSPENDRE" button

  Scenario: Tenant is running in Spanish
    Given I'm user with "es" bos_local
    And Server tenant is running
    And I'm logged as technical user
    And The license information is defined
    When I open tenant-status page
    Then I see "PAUSAR" button