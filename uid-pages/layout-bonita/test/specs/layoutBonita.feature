Feature: The Bonita layout

  Scenario: The Bonita layout is running in English
    When I open the Bonita layout with the "appName1" application selected
    Then The application displayName is "app1"
    And The page displayName is "process"