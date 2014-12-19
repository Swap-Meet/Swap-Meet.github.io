'use strict';

module.exports = function(app) {
  app.controller('profileCtrl', ['$scope', '$cookies', '$location', '$http',
    function($scope, $cookies, $location, $http) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('Profile Controller Sees the Cookie');
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
      .success(function(data) {
        if (!data.profile.avatar_url) {
          $scope.avatar_url = 'http://res.cloudinary.com/swapmeet/image/upload/v1418819684/avatar_olifrr.png';
        } else {
          $scope.avatar_url = data.profile.avatar_url;
        }

        $scope.screenname = data.profile.screenname;
        $scope.email = data.profile.email;
        $scope.zip = data.profile.zip;
      })
      .error(function(data) {
        console.log(data);
      });

    }]);
};
