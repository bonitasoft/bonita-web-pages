# Using a template to add a new page into the project

All of this should be done without the UI Designer running. <br/>
Everything in-between the `%` signs should be replaced. 
For all of these, keep the same naming conventions as the templates.

## Adding a new page/form/layout

Copy the `%template-page-name%/` directory into the `uid-pages/` folder.

### Replacements for the page/form/layout itself

Replace the names of the files and directories, as well as the content for files :
- Main directory `%template-page-name%/`. 
- Replace the name and content of `src/%TemplatePageId%V1.json`. 
If you already have a designed page, you can copy and paste the entire content into this file.
<br/>**Important:** Keep the same name for the file as the value of the `id` inside the file.   
- Change the content of the `src/resources/page.properties`.
- Add **ALL** assets used by the page into the `src/assets/%asset-type%/` folder (with `%asset-type` being js/json/css/img)
- Add any dependency to used custom widgets in the `build.gradle` file.  
- Add the page into the `settings.gradle` file at the root of this project.

### Replacements for tests

- Change the names and contents of the spec files in the `test/specs/` folder. 
This file will be used to define that tests will take.
- Change the name of `step_definitions/%templatePageId%.js`. 
This file will be used for defining the execution of each step. 
Optional :
- Add files with responses for mocked API calls in the `test/mockServer/` folder. 
- Add any custom cypress command into the `cypress/support/commands.js` file.

## Adding a new custom widget

Copy the `%templateWidgetName%/` directory into the `widgets/` folder.

### Replacements to do

Replace the names of the files and directories, as well as the content for files :
- Main directory `%templateWidgetName%/`. 
- Replace the name and content of `src/%templateWidgetId%V1.json`. 
<br/>**Important:** Keep the same name for the file as the value of the `id` inside the file.
- Replace the name and content of `src/%templateWidgetId%V1.ctrl.js` with the AngularJS controller of the widget.
- Replace the name and content of `src/%templateWidgetId%V1.tpl.html` with the HTML template of the widget.
- If you already have a designed widget:
    - Copy the JSON into `src/%templateWidgetId%V1.json`
    - Copy the AngularJS controller into `src/%templateWidgetId%V1.ctrl.js`
    - Copy the HTML template into `src/%templateWidgetId%V1.tpl.html`
- Add **ALL** assets used by the page into the `src/assets/%asset-type%/` folder (with `%asset-type` being js/json/css/img)
- Add the page into the `settings.gradle` file at the root of this project.

## After running UI Designer 

Check that all assets are imported in the artifact.
