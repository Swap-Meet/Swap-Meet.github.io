// controller for view 4, Browse Game Details.
'use strict';

module.exports = function(app) {
  app.controller('outboxDetailsCtrl', ['$scope', '$location', '$http', '$cookies',
    function($scope, $location, $http, $cookies) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Outbox Details Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      //this is fake data

      $scope.game = {
        title: 'Pac Man',
        score: 'String',
        publisher: 'String',
        zip: '98087',
        latitude: 'String',
        longitude: 'String',
        owner: 'String_id_number', //id number
        short_description: 'Eat all the dots, run from the ghosts, for now...',
        platform: 'NES',
        image_urls: ['http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/400px-Pac_Man.svg.png',
        'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
      };

      $scope.cancelRequest = function() {
        console.log('Imagine I am canceling a request now...');
      };

    }]);

};
