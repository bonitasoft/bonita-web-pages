# Bonita web pages

Contains Bonita Portal web pages.

# Build

## Requirements

* Java 8
* UI Designer is used to build the pages. It must be installed in your local maven repository prior to building bonita-web-pages
  * look at the build.gradle file to know which UI Designer is required to build the page
  * install the UI Designer as described in the [UI Designer repostiory](https://github.com/bonitasoft/bonita-ui-designer)
  
## Gradle Tasks

The following tasks can be executed with the Gradle wrapper (gradlew(.bat)) to avoid version compatibility issues

### Build artifacts

``gradle build``

### Run pages tests

``gradle runIntegrationTests``

### UID pages development

You can start a UI Designer development environment using

``gradle runUID``

project property can specify where bonita is located and the credentials to log in with.

``gradle runUID -PbonitaUrl=http://localhost:8080 -PbonitaUser=walter.bates -PbonitaPassword=bpm``


### Version
Version is declared in gradle.properties

To override the current version on build, use the parameter **-Pversion** like:

```
 ./gradlew -Pversion=7.9.3 <tasks>
```


### Extra repositories

repositories can be added using comma separated list of repositories
using property `extraRepositories` in format `repo_name::repo_url`

credentials can be passed using properties `repo_nameUsername` and
`repo_namePassword`

it can be configured using `-PextraRepositories=` or gradle.properties
file.

example of gradle properties set in `~/.gradle/gradle.properties`

```properties
extraRepositories=releases::https://repo1/releases,snapshots::https://repo2/snapshots/
releasesUsername=username
releasesPassword=password
snapshotsUsername=username
snapshotsPassword=password
```

The same can be done for publishing repository (single repo) using property `altDeploymentRepository`