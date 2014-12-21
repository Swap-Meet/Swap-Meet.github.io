// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', '$routeParams', '$http', '$location', '$cookies', 'Games', 'Offers',
    function($scope, $routeParams, $http, $location, $cookies, Games, Offers) {

      $scope.games = Games.getList();
      $scope.whichGame = $routeParams.indexID;

      $scope.createRequest = function(gameID) {
        if (!$cookies.jwt) {
          $location.path('/login');

        } else {
          console.log('Game Details Controller Sees the Cookie');
          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          Offers.setWantGame(gameID);
          $location.path('/offergames');
          console.log('Setting game id in Offers');
        }
      };

      $scope.addFavorite = function(gameID) {
        if (!$cookies.jwt) { //if there is no cookie, then do not allow addFav
          $location.path('/login');
        } else {
          var gameList = Games.getList();
          gameList[$routeParams.indexID].already_wanted = true;
          Games.setList(gameList);

          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          $http({
            method: 'POST',
            url: '/api/games/favorites',
            data: { _id: gameID }
          })
          .success(function(data) {
            console.log('Added to favorites: ' + data.items);
          })
          .error(function(data) {
            console.log(data);
          });
        }
      };

      $scope.removeFavorite = function(gameID) {

        if (!$cookies.jwt) { //if there is no cookie, then do not allow removFav
          $location.path('/login');
        } else {
          var gameList = Games.getList();
          gameList[$routeParams.indexID].already_wanted = false;
          Games.setList(gameList);

          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          $http({
            method: 'PUT',
            url: '/api/games/favorites',
            data: { _id: gameID }
          })
          .success(function(data) {
            console.log('Removed from favorites: ' + data.items);

          })
          .error(function(data) {
            console.log(data);
          });
        }
      };

    }]);

};
