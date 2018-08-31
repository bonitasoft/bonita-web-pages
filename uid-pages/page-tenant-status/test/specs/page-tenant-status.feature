Feature: The Tenant-Status

  Scenario: Tenant is paused
    Given I'm user with "en" bos_local
    Given Server tenant is paused
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "Resume" button

  Scenario: Tenant is running
    Given I'm user with "en" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "Pause" button

  Scenario: Tenant is running in French
    Given I'm user with "fr" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "Suspendre" button

  Scenario: Tenant is running in Spanish
    Given I'm user with "es" bos_local
    Given Server tenant is running
    Given I'm logged as technical user
    When I open tenant-status page
    Then I see "Pausar" button