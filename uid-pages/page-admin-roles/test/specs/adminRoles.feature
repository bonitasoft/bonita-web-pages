Feature: The Admin Roles in desktop resolution

#  Scenario: The roles displays the correct attributes
#    Given The response "default filter" is defined
#    When I visit the admin roles page
#    Then The roles page have the correct information
#
#  Scenario: Load more button works correctly
#    And The response "enable load more" is defined
#    When I visit the admin roles page
#    Then A list of 10 roles is displayed
#    When I click on Load more roles button
#    Then A list of 20 roles is displayed
#    When I click on Load more roles button
#    Then A list of 30 roles is displayed
#    When I click on Load more roles button
#    Then A list of 38 roles is displayed
#    And The load more roles button is disabled
#
#  Scenario: [Limitation] Load more is not disabled when result is a multiple of count
#    Given The response "enable 20 load more" is defined
#    When I visit the admin roles page
#    Then A list of 10 roles is displayed
#    When I click on Load more roles button
#    Then A list of 20 roles is displayed
#    When I click on Load more roles button
#    And The load more roles button is disabled

  Scenario: The roles list sort by works correctly
    Given The response "default filter" is defined
    And The response "sort by" is defined
    When I visit the admin roles page
    Then A list of 8 roles is displayed
    When I put "Display name (Desc)" in "sort by" filter field
    Then The api call is made for "Display name (Desc)"
    When I put "Name (Asc)" in "sort by" filter field
    Then The api call is made for "Name (Asc)"
    When I put "Name (Desc)" in "sort by" filter field
    Then The api call is made for "Name (Desc)"
    When I put "Display name (Asc)" in "sort by" filter field
    Then The api call is made for "Display name (Asc)"
