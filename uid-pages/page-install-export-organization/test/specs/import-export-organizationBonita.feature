Feature: The install-export Organization

  Scenario: install-export organization is running in English
    Given I'm user with "en" bos_local
    When I open the install-export organization page
    Then I see "Install" label on the install button
    And I see "Export" label on the export button

  Scenario: The install button is disabled
    Given I'm user with "en" bos_local
    Given No file is selected
    When I open the install-export organization page
    Then I see the "Install" button being disabled

  Scenario: Current organization exported
    Given I'm user with "en" bos_local
    When I open the install-export organization page
    Then I can download the file

  Scenario: install-export organization is running in French
    Given I'm user with "fr" bos_local
    When I open the install-export organization page
    Then I see "Installer" label on the install button
    And I see "Exporter" label on the export button

  Scenario: install-export organization is running in Spanish
    Given I'm user with "es" bos_local
    When I open the install-export organization page
    Then I see "Instalar" label on the install button
    And I see "Exportar" label on the export button