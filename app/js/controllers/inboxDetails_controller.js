// controller for view 4, Browse Game Details.
'use strict';

module.exports = function(app) {
  app.controller('inboxDetailsCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', 'Games',
    function($scope, $location, $http, $cookies, $routeParams, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      $scope.trades = Games.getInList();
      var email = Games.getInList()[2];

      $scope.sendRequest = function() {
        window.location.href = 'mailto:' + email;
      };

      $scope.cancelRequest = function() {
        $location.path('/profile');
        //ultimately should remove from inbox list
      };

    }]);

};
