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

      // $http({
      //   method: 'GET',
      //   url: '/api/games/incomingrequests'
      // })
      // .success(function(data) {
      //   // $scope.trade = [];
      //   // console.log(data.items[0]);
      //   // $scope.trade[0] = data.items[0].gameInfo;
      //   // for (var i = 1; i < data.items[0].potentialTrades.length + 1; i++) {
      //   //   $scope.trade[i] = data.items[0].potentialTrades[i - 1];
      //   //   console.log(data.items[0].potentialTrades);
      //   // }
      //   //$scope.screenname = data.profile.screenname;
      //   //$scope.email = data.profile.email;
      //   //$scope.zip = data.profile.zip;
      // })
      // .error(function(data) {
      //   console.log(data);
      // });

      $scope.sendRequest = function() {
        window.location.href = 'mailto:bunnies@example.com?' +
        'subject=SwapMeet%20Trade%20Alert:%20"Settlers%20of%20Catan:%20Knights%20and%20Cities"%20for%20"FIFA%2015!"' +
        '&body=%20Lets%20Meet...%20and%20Swap!';
      };

      $scope.cancelRequest = function() {
        $location.path('/search');
      };

      // I think that this will be an array holding 2 games:
      // The first game is this user A's game.
      // The second game is user B's game.
      $scope.trade = [{
        title: 'Settlers of Catan: Knights and Cities',
        owner_screenname: 'PCs4Eva',
        platform: 'Board',
        image_urls: ['http://images.fanpop.com/images/image_uploads/Differents-' +
  'Boards-settlers-of-catan-521934_1157_768.jpg']
      },
      {
        title: 'FIFA 2015',
        owner_screenname: 'IHeartGames',
        platform: 'PS3',
        image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941855/FIFA_15_Cover_Art_grdzh9.jpg']
      }];

      $scope.declineTrade = function() {
        console.log('Imagine I am declining a trade request now...');
      };

    }]);

};
