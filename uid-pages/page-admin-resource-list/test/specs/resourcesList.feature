Feature: The resources list in desktop resolution

  Scenario: The resources list displays the correct attributes
    Given The filter response "default filter" is defined
    When I visit the resources list page
    Then The resources have the correct information
    And The resources list have the correct item shown number

  Scenario: The resources list filtered by content type works correctly
    Given The filter response "default filter" is defined
    And The filter response "content type" is defined
    When I visit the resources list page
    Then A list of "5" resources is displayed
    When I put "Pages" in "content type" filter field
    Then The api call is made for "Pages"
    When I put "All resources" in "content type" filter field
    Then A list of "5" resources is displayed
    When I put "Layouts" in "content type" filter field
    Then No resources are available

  Scenario: The resources list sort by works correctly
    Given The filter response "default filter" is defined
    And The filter response "sort by" is defined
    When I visit the resources list page
    Then A list of "5" resources is displayed
    When I put "Updated - newest first" in "sort by" filter field
    Then The api call is made for "Updated - newest first"
    When I put "Updated - oldest first" in "sort by" filter field
    Then The api call is made for "Updated - oldest first"
    When I put "Resource name (Asc)" in "sort by" filter field
    Then The api call is made for "Resource name (Asc)"
    When I put "Resource name (Desc)" in "sort by" filter field
    Then The api call is made for "Resource name (Desc)"

  Scenario: Search by resource name works correctly
    Given The filter response "default filter" is defined
    And The filter response "search by name" is defined
    When I visit the resources list page
    Then A list of "5" resources is displayed
    When I put "ApplicationHomeBonita" in "search" filter field
    Then The api call is made for "ApplicationHomeBonita"
    When I erase the search filter
    Then A list of "5" resources is displayed
    When I put "Search term with no match" in "search" filter field
    Then No resources are available

  Scenario: Hide provided resources works correctly
    Given The filter response "default filter" is defined
    And The filter response "hide provided resources" is defined
    When I visit the resources list page
    Then A list of "5" resources is displayed
    When I filter hide provided resources
    Then The api call is made for "hide provided resources"

  Scenario: Load more resources button works correctly
    Given The filter response "enable load more" is defined
    When I visit the resources list page
    Then A list of "10" resources is displayed
    When I click on Load more resources button
    Then A list of "20" resources is displayed
    When I click on Load more resources button
    Then A list of "30" resources is displayed
    When I click on Load more resources button
    Then A list of "35" resources is displayed
    And The Load more resources button is disabled

  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
    Given The filter response "enable 20 load more" is defined
    When I visit the resources list page
    Then A list of "10" resources is displayed
    When I click on Load more resources button
    Then A list of "20" resources is displayed
    And The Load more resources button is disabled

  Scenario: Load more resets correctly after the limitation is triggered
    Given The filter response "enable 30 load more" is defined
    And The filter response "sort during limitation" is defined
    When I visit the resources list page
    Then A list of "10" resources is displayed
    When I click on Load more resources button
    Then A list of "20" resources is displayed
    When I click on Load more resources button
    Then A list of "30" resources is displayed
    And The Load more resources button is disabled
    When I put "Resource name (Desc)" in "sort by" filter field
    Then A list of "10" resources is displayed
    When I click on Load more resources button
    Then A list of "20" resources is displayed

  Scenario: Should export a resource
    Given The filter response "default filter" is defined
    When I visit the index page
    Then I can download the resource
