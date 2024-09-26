(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customBPIPromotionAlertV1', function() {
    return {
      controllerAs: 'ctrl',
      controller: /**
 * The controller is a JavaScript function that augments the AngularJS scope and exposes functions that can be used in the custom widget template
 * 
 * Custom widget properties defined on the right can be used as variables in a controller with $scope.properties
 * To use AngularJS standard services, you must declare them in the main function arguments.
 * 
 * You can leave the controller empty if you do not need it.
 */
function BPIPromotionAlertCtrl($scope, $timeout) {
    $scope.redirectId = localeToRedirectId();
    $scope.delay = false;
    const localStorageKey = $scope.properties.id +  "_lastClosedTimestamp";
    const _30_DAYS = 2592000000
        
    var isClosed = false;
    $scope.preferences = {};
    $scope.preferences.noShowAlert = false;
     $timeout(function(){
            $scope.delay = true;
        }, 3000);

    $scope.isVisible = function() {
        const now = Date.now()
        const lastDisplayedTimstamp = localStorage.getItem(localStorageKey);
        return (lastDisplayedTimstamp === null || lastDisplayedTimstamp === "" || lastDisplayedTimstamp === undefined  || parseInt(lastDisplayedTimstamp) + _30_DAYS < now ) && !isClosed;
    };
    
    $scope.hideMessage = function() {
        localStorage.setItem(localStorageKey, Date.now());
        isClosed = true;
    };
    
    function localeToRedirectId(){
        const bosLocale = document.cookie.split(";").filter((item) => item.trim().startsWith("BOS_Locale=")).map((item) => item.trim().split("=")[1])[0]
        
        if(bosLocale == null){
            return "762";
        }
        if(bosLocale.startsWith("es")){
            return "763";
        }
        if(bosLocale.startsWith("fr")){
            return "764";
        }
        return "762";
    }
    

},
      template: '<!-- The custom widget template is defined here\n   - You can use standard HTML tags and AngularJS built-in directives, scope and interpolation system\n   - Custom widget properties defined on the right can be used as variables in a templates with properties.newProperty\n   - Functions exposed in the controller can be used with ctrl.newFunction()\n   - You can use the \'environment\' property injected in the scope when inside the Editor whiteboard. It allows to define a mockup\n     of the Custom Widget to be displayed in the whiteboard only. By default the widget is represented by an auto-generated icon\n     and its name (See the <span> below).\n-->\n<div ng-if="environment" id="{{ properties.id}}" class="shadow-box-border-right" role="alert">\n    <div class="flex-container">\n        <p>{{"Unlock advanced monitoring and reporting with Bonita Process Insights—try it now for deeper insights!" | uiTranslate }}</p>\n        <div>        \n           <button class="btn btn-primary">{{ "Try Now" | uiTranslate }}</button>\n           <button class="btn btn-link"  ng-click="hideMessage()">{{ "Hide this recommendation" | uiTranslate }}</button>\n        </div>     \n     </div>\n</div>\n<div id="{{ properties.id}}" class="shadow-box-border-right bg-primary fade" ng-show="delay" ng-if="isVisible()" role="alert">\n    <div class="flex-container">\n        <p>{{"Unlock advanced monitoring and reporting with Bonita Process Insights—try it now for deeper insights!" | uiTranslate }}</p>\n        <div>        \n           <a class="btn btn-primary" href="https://www.bonitasoft.com/bos_redirect.php?bos_redirect_id={{ redirectId }}" target="_blank">{{ "Try Now" | uiTranslate }}</a>\n           <button class="btn btn-link"  ng-click="hideMessage()">{{ "Hide this recommendation" | uiTranslate }}</button>\n        </div>     \n     </div>\n</div>'
    };
  });
