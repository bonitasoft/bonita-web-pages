/**
 * The controller is a JavaScript function that augments the AngularJS scope and exposes functions that can be used in the custom widget template
 * 
 * Custom widget properties defined on the right can be used as variables in a controller with $scope.properties
 * To use AngularJS standard services, you must declare them in the main function arguments.
 * 
 * You can leave the controller empty if you do not need it.
 */
function ($scope) {
    const localStorageKey = $scope.properties.localStoragePropertyName;
    var isClosed = false;
    $scope.preferences = {};
    $scope.preferences.noShowAlert = false;
    
    $scope.hideAskAgainCheckbox = function(){
        return localStorageKey === undefined || localStorageKey === null || localStorageKey === "";
    };
    
    $scope.isAlertVisible = function() {
        const isActive = $scope.properties.isActive;
        
        if(isActive == undefined) {
            return false;
        }
        
        if(localStorageKey){
            //reset alert for new incoming message
            if(isActive != undefined && isActive == false) {
                localStorage.setItem(localStorageKey, true);
                return false;
            }
            
            if(localStorage.getItem(localStorageKey) == null) {
                localStorage.setItem(localStorageKey, true);
            }
            
            return (localStorage.getItem(localStorageKey)  === "true") && !isClosed;
        }
        return !isClosed;

    };
    
    $scope.hideAlert = function() {
        if($scope.preferences.noShowAlert) {
            localStorage.setItem(localStorageKey, false);
        }
        isClosed = true;
    };
    
    $scope.getAlertIcon = function() {
        const style = $scope.properties.style;
        
        switch (style) {
            case 'success' : return 'glyphicon-ok-sign';
            case 'info' : return 'glyphicon-info-sign';
            case 'warning' : 
            case 'danger' : return 'glyphicon-exclamation-sign';
        }
        
    }

}