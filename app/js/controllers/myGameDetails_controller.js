// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('myGameDetailsCtrl', ['$scope', '$location', '$http', '$cookies',
    function($scope, $location, $http, $cookies) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('My Game Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

    //this is fake data

      $scope.game = {
        title: 'The Curse of Monkey Island',
        owner_screenname: 'IHeartGames', //id number
        short_description: 'insult sword fighting FTW!',
        platform: 'PC',
        image_urls: ['http://ecx.images-amazon.com/images/I/51JHJN1YW3L._SY300_.jpg']
      };

      $scope.removeGame = function() {
        console.log('Imagine a game now...');
      };

    }]);

};
