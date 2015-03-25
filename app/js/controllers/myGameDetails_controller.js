// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('myGameDetailsCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', 'Games',
    function($scope, $location, $http, $cookies, $routeParams, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      $scope.myGames = Games.getMyList();
      $scope.whichGame = $routeParams.indexID;

      $scope.removeGame = function() {
        //should remove game from inventory
      };

    }]);

};
