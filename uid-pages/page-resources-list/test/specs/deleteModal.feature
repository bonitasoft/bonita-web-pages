Feature: delete resource modal in desktop resolution

  Scenario: The delete modal is displayed and closed
    Given The filter response "default filter" is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    Then The modal delete is displayed for "Page 1"
    When I click on cancel button in the modal
    Then The modal is closed

  Scenario: The delete modal should delete a page
    Given The filter response "all types of resources" is defined
    And The "page" is not involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    Then The modal delete is displayed for "Page 1"
    And The resource can be deleted message is displayed
    When I click on delete button in modal
    Then The api call is made for "delete page"
    And The api call is made for "refresh list"
    And The modal is closed

  Scenario: The delete modal should not be able to delete a page used in an app
    Given The filter response "all types of resources" is defined
    And The "page" is involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    Then The modal delete is displayed for "Page 1"
    And The resource cannot be deleted message is displayed
    And The list of applications using the page is displayed
    And The delete button is disabled

  Scenario: The delete modal should delete a layout
    Given The filter response "all types of resources" is defined
    And The "layout" is not involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "2"
    Then The modal delete is displayed for "Layout 1"
    And The resource can be deleted message is displayed
    When I click on delete button in modal
    Then The api call is made for "delete page"
    And The api call is made for "refresh list"
    And The modal is closed

  Scenario: The delete modal should not be able to delete a layout used in an app
    Given The filter response "all types of resources" is defined
    And The "layout" is involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "2"
    Then The modal delete is displayed for "Layout 1"
    And The resource cannot be deleted message is displayed
    And The list of applications using the layout is displayed
    And The delete button is disabled

  Scenario: The delete modal should delete a form
    Given The filter response "all types of resources" is defined
    And The "form" is not involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "3"
    Then The modal delete is displayed for "Form 1"
    And The resource can be deleted message is displayed
    When I click on delete button in modal
    Then The api call is made for "delete page"
    And The api call is made for "refresh list"
    And The modal is closed

  Scenario: The delete modal should not be able to delete a form used in a process
    Given The filter response "all types of resources" is defined
    And The "form" is involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "3"
    Then The modal delete is displayed for "Form 1"
    And The form cannot be deleted message is displayed
    And The list of processes using the form is displayed
    And The delete button is disabled

  Scenario: The delete modal should delete a theme
    Given The filter response "all types of resources" is defined
    And The "theme" is not involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "4"
    Then The modal delete is displayed for "Theme 1"
    And The resource can be deleted message is displayed
    When I click on delete button in modal
    Then The api call is made for "delete page"
    And The api call is made for "refresh list"
    And The modal is closed

  Scenario: The delete modal should not be able to delete a theme used in an app
    Given The filter response "all types of resources" is defined
    And The "theme" is involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "4"
    Then The modal delete is displayed for "Theme 1"
    And The resource cannot be deleted message is displayed
    And The list of processes using the theme is displayed
    And The delete button is disabled

  Scenario: The delete modal should delete a rest api extension
    Given The filter response "all types of resources" is defined
    And The "api extension" is not involved in application response is defined
    When I visit the index page
    And I click on "trash" button on the resource "5"
    Then The modal delete is displayed for "Api extension 1"
    And The api extension can be deleted message is displayed
    When I click on delete button in modal
    Then The api call is made for "delete page"
    And The api call is made for "refresh list"
    And The modal is closed

  Scenario: The trash button is disabled for provided resources
    Given The filter response "default filter" is defined
    When I visit the index page
    Then The "trash" button is disabled for resource "3"

  Scenario: The delete modal should display 500 error message
    Given The filter response "default filter" is defined
    And The delete status code "500" response is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    And I click on delete button in modal
    Then I see "500" error message
    When I click on cancel button in the modal
    And I click on "trash" button on the resource "1"
    Then I don't see any error message

  Scenario: The delete modal should display 404 error message
    Given The filter response "default filter" is defined
    And The delete status code "404" response is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    And I click on delete button in modal
    Then I see "404" error message
    When I click on cancel button in the modal
    And I click on "trash" button on the resource "1"
    Then I don't see any error message

  Scenario: The delete modal should display 403 error message
    Given The filter response "default filter" is defined
    And The delete status code "403" response is defined
    When I visit the index page
    And I click on "trash" button on the resource "1"
    And I click on delete button in modal
    Then I see "403" error message
    When I click on cancel button in the modal
    And I click on "trash" button on the resource "1"
    Then I don't see any error message
