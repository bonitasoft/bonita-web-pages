Feature: The bonita layout v1

  Scenario: The bonita layout is running in English
    When I open the bonita layout with the "appName1" application selected
    Then The application displayName is "app1"
    And The page displayName is "process"