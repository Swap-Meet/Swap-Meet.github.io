// controller for view 4, Browse Game Details.
'use strict';

module.exports = function(app) {
  app.controller('outboxDetailsCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', 'Games',
    function($scope, $location, $http, $cookies, $routeParams, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      $scope.outs = Games.getOutList();
      $scope.whichOut = $routeParams.indexID;

      $scope.cancelRequest = function() {
        $location.path('/profile');
        //ultimately should remove from inbox list
      };

    }]);

};
