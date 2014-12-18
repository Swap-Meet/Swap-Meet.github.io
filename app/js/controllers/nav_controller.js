'use strict';

module.exports = function(app) {
  app.controller('navCtrl', ['$scope', '$location', '$cookies',
    function($scope, $location, $cookies) {

      // if ($cookies.jwt) {
      //   console.log('Nav Controller Sees the Cookie!');
      //   $location.path('/');
      // }
      //$scope.identity = AuthService;

      // $scope.signIn = function() {
      //   if ($cookies.jwt) {
      //     console.log('You already have a cookie');
      //     $location.path('/');
      //   } else {
      //     console.log('signing in');
      //     $location.path('#/login');
      //   }
      // };
      $scope.signOut = function() {
        delete $cookies.jwt;
        console.log('signing out');
        $location.path('/');
      };
    }]);
};

//       $scope.isAuthenticated = function() {
//         if (!$cookies.jwt || $cookies.jwt.length === 0) {
//           $location.path('/');
//           return false;
//         } else {
//           $http.defaults.headers.common['jwt'] = $cookies.jwt;
//           return true;
//         }
//       };
//       $scope.isAuthenticated = function() {
//         if (!$cookies.jwt || $cookies.jwt.length === 0) {
//           $location.path('/');
//           return false;
//         } else {
//           $http.defaults.headers.common['jwt'] = $cookies.jwt;
//           return true;
//         }
//       };
//       //log out & return to main page
//       $scope.logOut = function() {
//         $cookies.jwt = null;
//         $http.defaults.headers.common['jwt'] = null;
//         $location.path('/');
//       };

//   }]);
// };
// .controller('NavController',function($scope,$http, $rootScope) {

//     $scope.isLoggedIn = function() {

//       $http.get('/checklogin')
//         .success(function(data) {
//           console.log(data);
//           $rootScope.loggedIn = data;
//         })
//         .error(function(data) {
//           console.log('error: ' + data);
//         });
//     };
// };
