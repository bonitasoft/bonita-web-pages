# Bonita web pages

Contains Bonita Portal web pages.

# Build

## Requirements

* Java 8
* UI Designer is used to build the pages. It must be installed in your local maven repository prior to building bonita-web-pages
  * look at the build.gradle file to know which UI Designer is required to build the pages
  * install the UI Designer as described in the [UI Designer repository](https://github.com/bonitasoft/bonita-ui-designer)
  
## Gradle Tasks

### Build artifacts

``gradle build``

### UID pages development

You can start an UI Designer development environment using

``gradle runUID``

project properties can be used to specify where bonita is located and the credentials to log in with.

``gradle runUID -PbonitaUrl=http://localhost:8080 -PbonitaUser=walter.bates -PbonitaPassword=bpm``
