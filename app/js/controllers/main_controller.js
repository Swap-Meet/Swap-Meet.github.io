// 'use strict';

// module.exports = function(app) {
//   app.controller('mainCtrl', [function() {'$scope', '$rootScope', function($scope, $rootScope) {

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
