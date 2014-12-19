// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', '$routeParams', '$http', '$location', '$cookies', 'Games', 'Offers',
    function($scope, $routeParams, $http, $location, $cookies, Games, Offers) {

      if (!$cookies.jwt) {
        $location.path('#/login');
      }
      console.log('Game Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $scope.games = Games.getList();
      $scope.whichGame = $routeParams.gameID;

      $scope.createRequest = function(gameID) {
        Offers.setWantGame(gameID);
        //$location.path('#/offergames');
        console.log('Setting game id in Offers');
      };

      $scope.addFavorite = function(gameID) {
        if (!$cookies.jwt) { //if there is no cookie, then do not allow addFav
          $location.path('#/');
        } else {

          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          $http({
            method: 'POST',
            url: '/api/games/favorites',
            data: { _id: gameID }
          })
          .success(function(data) {
            if ($scope.isToggled === false) {
              $scope.isToggled = true;
            }
            else {
              $scope.isToggled = false;
            }
            //update the 'already favorited portion of the game service cache
            console.log('success! added to favorites: ' + data.items);

            //return $scope.isToggled;

          })
          .error(function(data) {
            console.log(data);
          });
        }
      };

      $scope.removeFavorite = function(gameID) {
        if (!$cookies.jwt) { //if there is no cookie, then do not allow addFav
          $location.path('#/');
        } else {
          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          $http({
            method: 'DELETE',
            url: '/api/games/favorites',
            data: { id: gameID }
          })
          .success(function(data) {
            if ($scope.isToggled === false) {
              $scope.isToggled = true;
            }
            else {
              $scope.isToggled = false;
            }
            //update the 'already favorited portion of the game service cache
            console.log('success! removed from favorites: ' + data.items);

            //return $scope.isToggled;

          })
          .error(function(data) {
            console.log(data);
          });
        }
      };

    }]);

};
