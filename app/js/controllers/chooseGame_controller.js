'use strict';

module.exports = function(app) {
  app.controller('chooseGameCtrl', ['$scope', 'AuthService', '$http', '$cookies', '$location',
    function($scope, AuthService, $http, $cookies, $location) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Choose Game Controller Sees the Cookie');
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $scope.games = [
        { id: '548f75df27398d8b9bfeac07',
          owner: '548f75df27398d8b9bfeac05',
          title: 'The Curse of Monkey Island',
          platform: 'PC',
          image_urls: ['http://ecx.images-amazon.com/images/I/51JHJN1YW3L._SY300_.jpg']},
        { id: '548f75df27398d8b9bfeac08',
          owner: '548f75df27398d8b9bfeac05',
          title: 'God of War',
          platform: 'PS3',
          image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941698/God_of_War_Ascension_eseajx.jpg']},
        { id: '548f75df27398d8b9bfeac09',
          owner: '548f75df27398d8b9bfeac05',
          title: 'FIFA 15',
          platform: 'XBOX',
          image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941855/FIFA_15_Cover_Art_grdzh9.jpg']}
      ];

      $scope.declineRequest = function() {
        console.log('Imagine I am declining a request now...');
      };
    }]);
};
