function URLSearchParamsCtrl($scope,$window,  $location) {

    $scope.$watch(function(){
        return $scope.properties.params
    }, function() {
        if(!$scope.properties.params){
            return;
        }
        const params = $scope.properties.params;
        if(params){
           for (const [name, value] of Object.entries(params)) {
               // if value is undefined it is added to the object so we use an empty string instead
               $location.search(name, value ? value : '');
           }
           $location.replace();
           notifyParentFrame({ message: 'replaceState', search: $location.search()})
        }
    });
    
    function notifyParentFrame(message) {
        if ($window.parent !== $window.self) {
          $window.parent.postMessage(JSON.stringify(message), '*');
        }
    }

}

