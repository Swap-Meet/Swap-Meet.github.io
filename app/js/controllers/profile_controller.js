'use strict';

module.exports = function(app) {
  app.controller('profileCtrl', ['$scope', '$cookies', '$location', '$http',
    function($scope, $cookies, $location, $http) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;

      $scope.signOut = function() {
        delete $cookies.jwt;
        $http.defaults.headers.common['jwt'] = null;
        console.log('signing out');
        $location.path('#/');
      };

      $http({
        method: 'GET',
        url: '/api/user/myprofile'
      })
      .success(function(user) {
        if (!user.profile.avatar_url) {
          $scope.avatar_url = 'http://res.cloudinary.com/swapmeet/image/upload/v1418819684/avatar_olifrr.png';
        } else {
          $scope.avatar_url = user.profile.avatar_url;
        }

        $scope.screenname = user.profile.screenname;
        $scope.email = user.profile.email;
        $scope.zip = user.profile.zip;
      })
      .error(function(data) {
        console.log(data);
      });

      $http({
        method: 'GET',
        url: '/api/games/incomingrequests'
      })
      .success(function(incoming) {
        $scope.inbox = incoming.items;
      })
      .error(function(data) {
        console.log(data);
      });

      $http({
        method: 'GET',
        url: '/api/games/outgoingrequests'
      })
      .success(function(outgoing) {
        $scope.outbox = outgoing.items;
      })
      .error(function(data) {
        console.log(data);
      });

      $http({
        method: 'GET',
        url: '/api/games/inventory'
      })
      .success(function(mygames) {
        $scope.inventory = mygames.items;
      })
      .error(function(data) {
        console.log(data);
      });

      $http({
        method: 'GET',
        url: '/api/games/favorites'
      })
      .success(function(favs) {
        $scope.favorites = favs.items;
      })
      .error(function(data) {
        console.log(data);
      });

    }]);
};
