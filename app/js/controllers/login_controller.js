'use strict';

module.exports = function(app) {
  app.controller('loginCtrl', ['$scope', '$http', '$cookies', '$base64', '$location', 'AuthService',
    function($scope, $http, $cookies, $base64, $location, AuthService) {

    //$scope.errors = [];
    $scope.signIn = function() {
      //$scope.errors = [];
      // $http.defaults.headers.common['Authorization'] =
      //   'Basic ' + $base64.encode($scope.user.email + ':' + $scope.user.password);
      var signInSuffix = '?email=' + $scope.user.email + '&password=' + $scope.user.password;
      $http({
        method: 'GET',
        url: '/api/user' + signInSuffix
      })
      .success(function(data) {
        console.log('logged in!');
        AuthService.currentUser = data.profile.email;
        $cookies.jwt = data.jwt;
        $location.path('/profile');
      })
      .error(function(data) {
        console.log(data);
        $scope.errors = 'sign-in failed!';
        //$scope.errors = data;
      });
    };

    $scope.signUp = function() {
      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) {
        $scope.errors = 'password and confirmation did not match';
      } else if (!$scope.newUser.email) {
        $scope.errors = 'did not specify an email';
      } else if (!$scope.newUser.screenname) {
        $scope.errors = 'did not specify a username';
      } else if (!$scope.newUser.zip) {
        $scope.errors = 'did not specify a zipcode';
      } else {

        var signUpSuffix = '?email=' + $scope.newUser.email + '&password=' + $scope.newUser.password +
        '&screenname=' + $scope.newUser.screenname + '&zip=' + $scope.newUser.zip;

        $http({
          method: 'POST',
          url: '/api/user' + signUpSuffix
        })
        .success(function(data) {
          console.log('you are signed up!');
          $cookies.jwt = data.jwt;
          $location.path('/profile');
        })
        .error(function(data) {
          console.log(data);
          $scope.errors = 'sign-up failed!';
          //$scope.errors = data;
        });
      }
    };
  }]);
};
