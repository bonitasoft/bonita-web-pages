function WidgetlivingApplicationMenuController($scope, $http, $window, $location, $timeout, modalService) {
   const ctrl = this;
   
   ctrl.filterChildren = function (parentId) {
        return (ctrl.applicationMenuList || []).filter(function(menu){
            return menu.parentMenuId === '' + parentId;
        });
    };
   
   ctrl.isParentMenu = function(menu) {
        return menu.parentMenuId == -1 && menu.applicationPageId == -1;
    };
    
   ctrl.displayPage = function(token) {
        const previousToken = ctrl.pageToken;
        const previousPath = window.location.pathname;
        
        ctrl.pageToken = token;
        const urlPath = previousPath.substring(0, previousPath.length - previousToken.length - 1) + token + '/' + $window.location.search;
        
        const stateObject = {title: "" + token + "", url: "" +  urlPath  + ""};
        if (typeof ($window.history.pushState) != "undefined") {
            $window.history.pushState(stateObject, stateObject.title, stateObject.url);
        } else {
            alert("Browser does not support HTML5.");
        }
        
        // make sure the user is still logged in before refreshing the iframe
        verifySession().then(setTargetedUrl).catch(refreshPage);
        
        return false;
    };
   
    ctrl.openCurrentSessionModal = function() {
        modalService.open($scope.properties.currentSessionModalId);
    };
    
    ctrl.openAppSelectionModal = function() {
        modalService.open($scope.properties.appSelectionModalId);
    };
   
    //handle the browser back button
    $window.addEventListener('popstate', function() {
        parseCurrentURL();
        //make sure the user is still logged in before refreshing the iframe
        setTargetedUrl();
        refreshPage();
    });

    function parseCurrentURL() {
        const pathArray = $window.location.pathname.split('/');
        ctrl.applicationToken = pathArray[pathArray.length - 3];
        ctrl.pageToken = pathArray[pathArray.length - 2];
    }
   
    function setApplicationMenuList(application) {
        return $http.get(`../API/living/application-menu/?c=100&f=applicationId%3D${application.id}&d=applicationPageId&o=menuIndex+ASC`)
            .success(function(data) { 
                ctrl.applicationMenuList = data;
            });
    }

    function searchSeparator() {
        return $window.location.search ? "&" : "?";
    }

    function setTargetedUrl() {
        // angular hack to force the variable bound to refresh
        // so we delay and reload the iframe content with the correct value
        $timeout(function(){
            $scope.properties.targetUrl = `../../../portal/resource/app/${ctrl.applicationToken}/${ctrl.pageToken}/content/${$window.location.search}${searchSeparator()}app=${ctrl.applicationToken}`;
        }, 0);
    }
    
    function refreshPage() {
        $window.location.reload();
    }

    function verifySession() {
        const sessionId = '../API/system/session/unusedId';
        return $http.get(sessionId);
    }
    
    function setApplication(){
        const application = $scope.properties.application;
        ctrl.applicationToken = application.token;
        ctrl.pageToken = $scope.properties.pageToken;
        ctrl.applicationName = $scope.properties.application.displayName;
        setApplicationMenuList(application);
        setTargetedUrl();
    }
    
    setApplication();
}