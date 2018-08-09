> Test artifact create by UI-Designer = ❤️

Testing a uid-page is based on [Cypress Test Runner](https://docs.cypress.io/guides/overview/why-cypress.html#)
### Install Cypress to run or write test
Run ``npm install``

### Architecture
For each page you can find same type of architecture.
```
page/
    build/  
    cypress/
            fixtures/
            integration/
            plugins/
            support/
            videos/
    src/
        assets/
        pageId.json
    test/
        pageId.spec.js
    build.gradle
    cypress.json
  ```  
### Gradle task

Two gradle tasks are available to write and run you test.
* task ``openTests`` will be open each test file on [Cypress Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#) present in **test** folder.
_Warning: This task can be run only from a page folder.

* task ``runTests`` run each test file on present in **test** folder. This task can be run on uid-pages folder to run test for all-subproject.
  
### Write a test
Consult official documentation to find kow to write a test.

**Tips**: To visit page, you need to put entry point in test file like this: 
 ``cy.visit('build/dist/resources/index.html');``
 
 In _dist_ folder, you can find your page unzipped (with _unzip_ gradle task).