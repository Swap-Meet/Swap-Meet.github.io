// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', '$routeParams', '$http', '$location', '$cookies', 'AuthService', 'Games',
    function($scope, $routeParams, $http, $location, $cookies, AuthService, Games) {

      $scope.message = Games.message;
      // console.log('GD-Message: ' + $scope.message);

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Game Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      // $http({
      //   method: 'GET',
      //   url: '/api/browse'
      // })
      // .success(function(data) {
      //   $scope.games = data.items;
      //   $scope.whichGame = $routeParams.gameID;
      // })
      // .error(function(data) {
      //   console.log(data);
      // });

      // when this page loads, calls the service Games in game_service
      // use the results to populate the game info

      $scope.filterSearch2 = function() {
        var querySuffix = $scope.message;
        console.log('start gD search with: message: ' + $scope.message);

        Games.filterSearch(querySuffix)
          .success(function(data) {
            $scope.games = data.items;
          });
      };

      // $scope.game = {
      //   //title: 'De Blob',
      //   score: 'String',
      //   publisher: 'String',
      //   zip: '98087',
      //   latitude: 'String',
      //   longitude: 'String',
      //   owner: 'String_id_number', //id number
      //   owner_screenname: 'Funkenstein',
      //   short_description: 'Change the colors in Inktown with your friendly Blob.',
      //   platform: 'Wii',
      //   image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416598221/hewndsp60tcvfmcwqljx.jpg',
      //   'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
      // };

      $scope.sendRequest = function() {
        console.log('Imagine I am sending a request now...');
      };

      $scope.addFavorite = function() {
        console.log('Imagine Adding to favorites');
      };

    }]);

};
