'use strict';

module.exports = function(app) {
  app.controller('profileCtrl', ['$scope', '$cookies', '$location', '$http',
    function($scope, $cookies, $location, $http) {

      // if (!AuthService.isAuthenticated()) {
      //   return $location.path('/login');
      // } else {
      //   $http.defaults.headers.common['jwt'] = $cookies.jwt;
      // }

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      console.log('did not redirect');

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
      //this is fake data
      // $scope.avatar_url='http://res.cloudinary.com/swapmeet/image/upload/c_fill,h_100,w_100/mif6vhmdjjwzo8tyg6ct.jpg';
      // $scope.screenname = 'ilovemonkeys99';
      // $scope.email = 'monkeysee@monkeydo.com';
      // $scope.zip = '98136';

    }]);
};
