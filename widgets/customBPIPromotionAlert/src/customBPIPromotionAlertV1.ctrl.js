/**
 *This custom widget is duplicated in bonita-portal-js-sp for monitoring page
 */
function BPIPromotionAlertCtrl($scope, $timeout, $http) {
    var localizedRedirect = {
        en: "762",
        es: "763",
        fr: "764"
    }
    $scope.redirectId = localeToRedirectId();
    $scope.showMessage = false;
    const localStorageKey = $scope.properties.id +  "_lastClosedTimestamp";
    const _30_DAYS = 2592000000;
    var isClosed = false;
    
    $http.get('../API/system/information')
        .then(function success(response) {
          if(response.data && "true" === response.data.enablePromotionMessages){
                $timeout(() => $scope.showMessage = true, 3000);
          }
        }, angular.noop);

    $scope.isVisible = function() {
        const now = Date.now()
        const lastDisplayedTimstamp = localStorage.getItem(localStorageKey);
        return (!Boolean(lastDisplayedTimstamp) || parseInt(lastDisplayedTimstamp) + _30_DAYS < now ) && !isClosed;
    };
    
    $scope.hideMessage = function() {
        localStorage.setItem(localStorageKey, Date.now());
        isClosed = true;
    };
    
    function localeToRedirectId(){
        const bosLocale = document.cookie.split(";")
            .filter((item) => item.trim().startsWith("BOS_Locale="))
            .map((item) => item.trim().split("=")[1])[0];
        if(bosLocale && bosLocale.startsWith("es")){
            return localizedRedirect.es;
        }
        if(bosLocale && bosLocale.startsWith("fr")){
            return localizedRedirect.fr;
        }
        return localizedRedirect.en;
    }
    

}