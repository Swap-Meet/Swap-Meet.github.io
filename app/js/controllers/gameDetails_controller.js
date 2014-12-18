// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', '$routeParams', '$http', '$location', '$cookies', 'Games',
    function($scope, $routeParams, $http, $location, $cookies, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Game Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $scope.games = Games.getList();
      $scope.whichGame = $routeParams.gameID;

      $scope.sendRequest = function() {
        console.log('Imagine I am sending a request now...');
      };

      $scope.addFavorite = function() {
        console.log('Imagine Adding to favorites');
      };

    }]);

};
