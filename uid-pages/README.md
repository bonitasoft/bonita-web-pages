
# Gradle tasks for UI Designer artifacts

## Build the artifact

``gradle buildUIDPage`` or ``gradle buildUIDWidget`` or ``gradle buildUIDFragment``

it produces the artifact in the **build/** directory under the name **projectname**-version.zip

## Development (From the project root)

You can start an UI Designer dev environment using

``gradle runUID`` (From the project root directory)

project properties can be used to specify where bonita is located and the credentials to log in with.

``gradle runUID -PbonitaUrl=http://localhost:8080 -PbonitaUser=walter.bates -PbonitaPassword=bpm``

## Page migration

Migrate a page to the specified UI Designer version using

``gradle migrateUIDPage``

## Tests

Testing an UI Designer page is based on [Cypress Test Runner](https://docs.cypress.io/guides/overview/why-cypress.html#)

### Architecture
For each page you can find the same architecture.
```
page/
    build/  
    cypress/            
            plugins/
            support/            
    src/
        assets/
        pageId.json
    test/
        mockServer/
        specs/
            pageId.spec.js
    build.gradle
    cypress.json
  ```  

### Install Cypress to run or write tests
Run ``npm install``

### Gradle tasks

Two gradle tasks are available to write and run your tests.
* task ``openTests`` will open each test file on [Cypress Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#) present in **test/spec/** folder.

_Warning: This task can only be run from a page folder._

* task ``runTests`` runs each test file in the **test/spec/** folder. This task can be run in the **uid-pages/** folder to run tests for all subprojects.
  
### Write a test
Consult official documentation to find kow to write a test.

**Tips**: To visit page, you need to put an entry point in the test file like this: 
 ``cy.visit('build/dist/resources/index.html');``
 
 In the **dist/** folder, you can find your page unzipped (with _unzip_ gradle task).
 
 
 ### Use [cucumber plugin](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
 In the **package.json** file, the following configuration indicates the location of business definitions. 
 ```
 "cypress-cucumber-preprocessor": {
     "step_definitions": "step_definitions/"
   }
 ```
 
 After you define and customize you folders, you can create a test file ``yourTest.feature`` in the **test/** folder.
