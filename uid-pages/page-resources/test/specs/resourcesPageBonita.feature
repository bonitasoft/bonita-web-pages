Feature: The resources page

  Scenario: Resources are displayed correctly
    Given The user has resources
    When The user visits the resources page
    Then The user sees the list of resources

  Scenario: The resource in the list displays all the information correctly
    Given The user has resources
    When The user visits the resources page
    Then The "first" resource displays "REST API extension example" as title
    And The "first" resource displays "REST API extension example archive for Bonita Portal. Included examples: Get/Post, how to use a logger, customize response, call SOAP web service." as description
    And The "second" resource displays "API extension viewer page" as title
    And The "second" resource displays "API extension viewer page generated with Bonita UI designer" as description
    And The "third" resource displays "TESTTESTTESTTESTTESTTESTTESTTESTTEST" as title
    And The "third" resource displays "Page generated with Bonita UI designer" as description


  Scenario: The resources page has filter option by its type
    Given The user has resources
    And The filter responses are defined for the type of resources
    When The user visits the resources page
    Then The user sees the list of resources
    And The user sees the filter dropdown
    When The user select "Page" type
    Then The user sees only the list of "Page" type resources
    And The user won't be able to see the list of other type of resources

  Scenario: The resources page has sort by option
    Given The user has resources
    And The sort responses are defined for the order of resources to be shown in the list
    When The user visits the resources page
    Then The user sees the list of resources
    And The user sees the sort by dropdown list
    When The user select "Reverse alphabetical order (Z-A)" sorting option
    Then The user sees the list of resources by "alphabetical" in descending order

  Scenario: The user can see the resource details in a modal
    Given The user has resources
    When The user visits the resources page
    Then The user sees the list of resources
    And The user clicks on more button
    Then The resource details modal will be opened

    Scenario: The modal shows the details correctly
      Given The user has resources
      When The user visits the resources page
      Then The user sees the list of resources
      And The user clicks on more button
      Then The resource details modal will be opened
      And The modal title shows correctly
      And The user sees the action buttons
      And The content type icon shows correctly
      And The resource title shows correctly
      When The user clicks on close button
      Then The modal window will be closed