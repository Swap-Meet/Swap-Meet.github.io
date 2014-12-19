'use strict';

module.exports = function(app) {
  app.controller('offerGamesCtrl', ['$scope', '$location', '$http', '$cookies',
    function($scope, $location, $http, $cookies) {

      if (!$cookies.jwt) {
        $location.path('#/login');
      }
      console.log('Offer Games Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $scope.games = [
        { id: '548f75df27398d8b9bfeac07',
          owner: '548f75df27398d8b9bfeac05',
          title: 'Monkey Island',
          platform: 'XBOX',
          image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
          'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']},
        { id: '548f75df27398d8b9bfeac08',
          owner: '548f75df27398d8b9bfeac05',
          title: 'Grim Fandango',
          platform: 'PC',
          image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
          'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']},
        { id: '548f75df27398d8b9bfeac09',
          owner: '548f75df27398d8b9bfeac05',
          title: 'Settlers of Catan',
          platform: 'Board',
          image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
          'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']}
      ];

      $scope.sendRequest = function() {
        $location.path('#/');
        console.log('Imagine I am sending a request now...');
      };
      $scope.cancelRequest = function() {
        $location.path('#/');
        console.log('Imagine I am cancelling a request now...');
      };

    }]);
};
