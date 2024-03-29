(function() {
  'use strict';
  angular.module('autogeneratedForm').factory('contractSrvc', [
    '$http',
    function($http) {
      function appendTransform(defaults, transform) {
        // We can't guarantee that the default transformation is an array
        defaults = angular.isArray(defaults) ? defaults : [defaults];

        // Append the new transformation to the defaults
        return defaults.concat(transform);
      }

      return {
        fetchContract: function(taskId) {
          // fetch contract from server
          return $http({
            url: '../API/bpm/userTask/' + taskId + '/contract',
            method: 'GET'
          });
        },
        executeTask: function(taskId, userId, dataToSend) {
          function getUserParam() {
            return userId ? { user: userId } : {};
          }

          // submit data to execute task on server
          return $http({
            url: '../API/bpm/userTask/' + taskId + '/execution',
            method: 'POST',
            data: dataToSend,
            params: getUserParam(),
            transformRequest: appendTransform(
              $http.defaults.transformRequest,
              function(value, headers) {
                console.log('Request:', value);
                return value;
              }
            )
          });
        }
      };
    }
  ]);
})();
