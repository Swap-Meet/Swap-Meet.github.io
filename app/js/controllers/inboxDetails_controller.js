// controller for view 4, Browse Game Details.
'use strict';

module.exports = function(app) {
  app.controller('inboxDetailsCtrl', ['$scope', '$location', '$http', '$cookies',
    function($scope, $location, $http, $cookies) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Inbox Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $http({
        method: 'GET',
        url: '/api/games/incomingrequests'
      })
      .success(function(data) {
        $scope.trade = [];
        console.log(data.items[0]);
        $scope.trade[0] = data.items[0].gameInfo;
        for (var i = 1; i < data.items[0].potentialTrades.length + 1; i++) {
          $scope.trade[i] = data.items[0].potentialTrades[i - 1];
          console.log(data.items[0].potentialTrades);
        }
        //$scope.screenname = data.profile.screenname;
        //$scope.email = data.profile.email;
        //$scope.zip = data.profile.zip;
      })
      .error(function(data) {
        console.log(data);
      });

      $scope.sendRequest = function() {
        window.location.href = 'mailto:bunnies@example.com?' +
        'subject=SwapMeet%20Trade%20Alert:%20"FIFA%2015"%20for%20"Settlers%20of%20Catan:%20Knights%20and%20Cities"' +
        '&body=%20Lets%20Meet%20and%20Swap!';
      };

      //I think that this will be an array holding 2 games:
      //The first game is this user A's game.
      //The second game is user B's game.
      // $scope.trade = [{
      //   title: 'Pac Man',
      //   score: 'String',
      //   publisher: 'String',
      //   zip: '98087',
      //   latitude: 'String',
      //   longitude: 'String',
      //   owner_screenname: 'SeahawksDude123',
      //   owner: 'String_id_number', //id number
      //   short_description: 'Eat all the dots, run from the ghosts, for now...',
      //   platform: 'NES',
      //   image_urls: ['http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/400px-Pac_Man.svg.png',
      //   'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
      // },
      // {
      //   title: 'Ms. Pac Man',
      //   score: 'String',
      //   publisher: 'String',
      //   zip: '98087',
      //   latitude: 'String',
      //   longitude: 'String',
      //   owner_screenname: 'RockingRedXYZ',
      //   owner: 'String_id_number', //id number
      //   short_description: 'Be awesome...',
      //   platform: 'NES',
      //   image_urls: ['http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/400px-Pac_Man.svg.png',
      //   'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
      // }];

      $scope.declineTrade = function() {
        console.log('Imagine I am declining a trade request now...');
      };

    }]);

};
