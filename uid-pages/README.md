> Test artifact create by UI-Designer = ❤

Testing an uid-page is based on [Cypress Test Runner](https://docs.cypress.io/guides/overview/why-cypress.html#)

### Architecture
For each page you can find same type of architecture.
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

### Install Cypress to run or write test
Run ``npm install``

### Gradle task

Two gradle tasks are available to write and run you test.
* task ``openTests`` will be open each test file on [Cypress Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#) present in **test/spec** folder.
_Warning: This task can be run only from a page folder.

* task ``runTests`` run each test file on present in **test/spec** folder. This task can be run on uid-pages folder to run test for all-subproject.
  
### Write a test
Consult official documentation to find kow to write a test.

**Tips**: To visit page, you need to put entry point in test file like this: 
 ``cy.visit('build/dist/resources/index.html');``
 
 In _dist_ folder, you can find your page unzipped (with _unzip_ gradle task).
 
 
 ### Use [cucumber plugin](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
 In package.json, following configuration indicate the location of business definition. 
 ```
 "cypress-cucumber-preprocessor": {
     "step_definitions": "step_definitions/"
   }
 ```
 
 After define and customize, you can create a test file ``yourTest.feature`` in **test** folder.