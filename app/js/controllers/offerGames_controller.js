'use strict';

module.exports = function(app) {
  app.controller('offerGamesCtrl', ['$scope', '$location', '$http', '$cookies', 'Offers',
    function($scope, $location, $http, $cookies, Offers) {

      var tradeIndeces = [];
      //if the user is not signed in, then send them to login
      if (!$cookies.jwt) {
        $location.path('#/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      //get my inventory
      $http({
        method: 'GET',
        url: '/api/games/inventory'
      })
      .success(function(mygames) {
        $scope.games = mygames.items;
      })
      .error(function(data) {
        console.log(data);
      });

      //add game from offer list
      $scope.addGameToTrades = function(game) {
        tradeIndeces.push(game);
        tradeIndeces.sort(function(a, b) { return a - b; });
      };

      //remove game from offer list
      $scope.removeGameFromTrades = function(game) {
        var index = tradeIndeces.indexOf(game);
        tradeIndeces.splice(index, 1);

      };

      //send request and return to search page
      $scope.sendRequest = function() {
        //set the game you want & the games you want to trade
        var trades = [];
        var gameId = Offers.getWantGame();
        console.log(gameId);
        for (var i = 0; i < tradeIndeces.length; i++) {
          var index = tradeIndeces[i];
          trades.push($scope.games[index]._id);
        }
        //send request to server
        $http({
          method: 'POST',
          url: '/api/games/outgoingrequests',
          data: { id: gameId, gameIdArray: trades }
        })
        .success(function(data) {
          console.log('Added to outgoing requests: ' + data.items);
          Offers.setWantGame('');
          $location.path('#/');
        })
        .error(function(data) {
          console.log(data);
          $location.path('#/');
        });
      };

      //cancel request and return to search page
      $scope.cancelRequest = function() {
        Offers.setWantGame('');
        $location.path('#/');
      };

    }]);
};
