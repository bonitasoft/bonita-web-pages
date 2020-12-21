# How to contribute

## Making Changes

* Fork the repository on GitHub
* Create a topic branch from where you want to base your work.
  * This is usually the master branch.
  * Only target release branches if you are certain your fix must be on that branch.
  * To quickly create a topic branch based on master; `git checkout -b fix/tickectId_my_contribution master`.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the [proper format](#commit_format).
* Make sure you have added the necessary tests for your changes.
* Run _all_ the tests to assure nothing else was accidentally broken.

## Submitting Changes

* Sign the [Contributor License Agreement](Bonitasoft_Contributor__License_Agreement.txt).
* Push your changes to a topic branch in your fork of the repository.
* Submit a **pull request** to the repository in the Bonitasoft organization.
* The dev team looks at Pull Requests on a regular basis.
* `Labels` are used to track the lifecycle of the pull request:
	* Review needed
	* Rebase needed
	* Review done
	* TR (Technical requirement)
	* WIP (Work in progress)

## <a name="commit_format"></a> Commit format

````
	<type>(<scope>): <subject>
	<BLANK LINE>
	<body>
	<BLANK LINE>
	<footer>
````
Only the **footer** is optional.

All the lines of the commit message cannot be longer than 100 characters, 60 for the first line! This allows the message to be easier to read on GitHub as well as in various git tools.

### Type

Must be one of the following:

* feat: A new feature
* fix: A bug fix
* doc: Documentation only changes
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* refactor: A code change that neither fixes a bug nor adds a feature
* perf: A code change that improves performance
* test: Adding missing tests or correcting existing tests
* chore: Changes that affect the build system, CI configuration or external dependencies
* revert: If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Scope

The scope is the functional element impacted by the commit. For example `ProcessDiagram`, `Assets`, etc.

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub/JIRA issues that this commit **closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Examples

```
fix(tasklist):  display dates with proper locale setting
    
Set moment.js local globally in an angular run block instead of in each filters using moment.
    
Closes [BBPMC-418](https://bonita.atlassian.net/browse/BBPMC-418)
```
```
feat(tasklist): add details panel size handlers 
    
Does some awesome things like:
* Cool thing done
* Another cool thing
    
Closes [BS-14965](https://bonitasoft.atlassian.net/browse/BS-14965)
```

# Additional Resources

* [Community website](http://community.bonitasoft.com/)
* [Community Bug tracker (Jira)](https://bonita.atlassian.net/projects/BBPMC/)
* [Internal Bug tracker (Jira)](https://bonitasoft.atlassian.net/projects/BS/)
