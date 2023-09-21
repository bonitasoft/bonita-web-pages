Feature: The Platform-Maintenance

  Scenario: The license information is displayed correctly
    Given I'm user with "en" bos_local
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then I see the license information is displayed correctly

  Scenario: The license information is hidden correctly in the community edition
    Given I'm user with "en" bos_local
    And I'm logged as technical user
    When I open platform-maintenance page
    Then I see the license information is displayed correctly for the community edition

  Scenario: Platform maintenance is enabled
    Given I'm user with "en" bos_local
    And Maintenance mode is enabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then I see "DISABLE MAINTENANCE MODE" button

  Scenario: Platform is running
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then I see "ENABLE MAINTENANCE MODE" button

  Scenario: Opens a modal window on pressing the status button while Maintenance mode is disabled
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "ENABLE MAINTENANCE MODE" button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Opens a modal window on pressing the status button while Maintenance mode is enabled
    Given I'm user with "en" bos_local
    And Maintenance mode is enabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "DISABLE MAINTENANCE MODE" button
    Then I see a modal that opened
    And The modal closes afterwards

  Scenario: Maintenance state changes when pressing the status button inside the modal while Maintenance mode is disabled
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "ENABLE MAINTENANCE MODE" button
    And I press the status changing button
    Then Maintenance mode is enabled

  Scenario: Maintenance state changes when pressing the status button inside the modal while Maintenance mode is enabled
    Given I'm user with "en" bos_local
    And Maintenance mode is enabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "DISABLE MAINTENANCE MODE" button
    And I press the status changing button
    Then Maintenance mode is disabled

  Scenario: Modal window closes when pressing the close button inside it while Maintenance mode is disabled
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "ENABLE MAINTENANCE MODE" button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Modal window closes when pressing the close button inside it while Maintenance mode is enabled
    Given I'm user with "en" bos_local
    And Maintenance mode is enabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    And I click on "DISABLE MAINTENANCE MODE" button
    And I press the "Cancel" button
    Then The modal is closed

  Scenario: Maintenance details refreshes when the state changes
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    And The tenant status page can refresh
    When I open platform-maintenance page
    And I click on "ENABLE MAINTENANCE MODE" button
    And I press the status changing button
    Then There is an API call for refreshing the page
#
#  Scenario: Tenant is running in French
#    Given I'm user with "fr" bos_local
#    And Maintenance mode is disabled
#    And I'm logged as technical user
#    And The license information is defined
#    When I open platform-maintenance page
#    Then I see "SUSPENDRE" button
#
#  Scenario: Tenant is running in Spanish
#    Given I'm user with "es" bos_local
#    And Maintenance mode is disabled
#    And I'm logged as technical user
#    And The license information is defined
#    When I open platform-maintenance page
#    Then I see "PAUSAR" button

  Scenario: The platform maintenance information is displayed correctly
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then The platform maintenance section is displayed correctly

  Scenario: Maintenance message should be enabled correctly
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    And The tenant status page can refresh after maintenance message enabled
    When I open platform-maintenance page
    Then The platform maintenance message is enabled correctly

  Scenario: Maintenance message should not be enabled
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then Display Error when The platform maintenance message cannot be enabled

  Scenario: Maintenance message should be updated correctly
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    And The tenant status page can refresh after maintenance message updated
    When I open platform-maintenance page
    Then The platform maintenance message is updated correctly

  Scenario: Maintenance message should not be updated
    Given I'm user with "en" bos_local
    And Maintenance mode is disabled
    And I'm logged as technical user
    And The license information is defined
    When I open platform-maintenance page
    Then Display Error when The platform maintenance message cannot be updated