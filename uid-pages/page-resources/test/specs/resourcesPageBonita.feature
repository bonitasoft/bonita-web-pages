Feature: The resources page

  Scenario: Resources are displayed correctly
    Given The user has resources
    When The user visits the resources page
    Then The user see the list resources

  Scenario: The resource in the list displays all the information correctly
    Given The user has resources
    When The user visits the resources page
    Then The "first" resource displays "REST API extension example" as title
    And The "first" resource displays "REST API extension example archive for Bonita Portal. Included examples: Get/Post, how to use a logger, customize response, call SOAP web service." as description
    And The "second" resource displays "API extension viewer page" as title
    And The "second" resource displays "API extension viewer page generated with Bonita UI designer" as description