/**
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
    

}