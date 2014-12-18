'use strict';

module.exports = function(app) {
  app.controller('searchCtrl', ['$scope', '$http', '$cookies', 'Games',
      function($scope, $http, $cookies, Games) {

      $scope.filterSearch = function() {
        if (!$cookies.jwt) { //if there is no cookie, then call browse route
          /// the old browse route until linda get's a chance to update browse
          $http({
            method: 'GET',
            url: '/api/browse'
          })
          .success(function(data) {
            console.log('set the list in Games service');
            Games.setList(data.items); //set the shared data
            $scope.games = data.items;
          })
          .error(function(data) {
            console.log(data);
          });
        } else { //but if a cookie exists, then set the headers & use search route
          $http.defaults.headers.common['jwt'] = $cookies.jwt;
          var querySuffix = '';
          if ($scope.search === undefined) { //if search bar is empty, query all
            $http({
              method: 'GET',
              url: '/api/search'
            })
            .success(function(data) {
              console.log('set the list in Games service');
              Games.setList(data.items); //set the shared data on the Games service
              $scope.games = data.items;
            })
            .error(function(data) {
              console.log(data);
            });
          } else { // if the search bar is NOT empty create a query string & call search route
            querySuffix = $scope.search.title;
            querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

            $http({
              method: 'GET',
              url: '/api/search/' + querySuffix
            })
            .success(function(data) {
              console.log('set the list in Games service');
              Games.setList(data.items); //set the shared data
              $scope.games = data.items;
            })
            .error(function(data) {
              console.log(data);
            });
          }
        }
      };
    }]);
};

// 'use strict';

// module.exports = function(app) {
//   app.controller('searchCtrl', ['$scope', '$http', '$cookies', 'Games',
//       function($scope, $http, $cookies, Games) {

//       var querySuffix = '';
//       $scope.filterSearch = function() {
//         if (!$cookies.jwt) { //if there is no cookie, then call browse route
//           if ($scope.search === undefined) { //if search bar is empty, query all
//             $http({
//               method: 'GET',
//               url: '/api/browse'
//             })
//             .success(function(data) {
//               console.log('set the list in Games service');
//               Games.setList(data.items); //set the shared data on the Games service
//               $scope.games = data.items;
//             })
//             .error(function(data) {
//               console.log(data);
//             });
//           } else { // if the search bar is NOT empty, create a query string & call search route
//             querySuffix = $scope.search.title;
//             querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

//             $http({
//               method: 'GET',
//               url: '/api/browse/' + querySuffix
//             })
//             .success(function(data) {
//               console.log('set the list in Games service');
//               Games.setList(data.items); //set the shared data on the Games service
//               $scope.games = data.items;
//             })
//             .error(function(data) {
//               console.log(data);
//             });
//           }
//         } else { //but if a cookie exists, then set the headers & use search route
//           $http.defaults.headers.common['jwt'] = $cookies.jwt;
//           querySuffix = '';
//           if ($scope.search === undefined) { //if search bar is empty, query all
//             $http({
//               method: 'GET',
//               url: '/api/search'
//             })
//             .success(function(data) {
//               console.log('set the list in Games service');
//               Games.setList(data.items); //set the shared data on the Games service
//               $scope.games = data.items;
//             })
//             .error(function(data) {
//               console.log(data);
//             });
//           } else { // if the search bar is NOT empty create a query string & call search route
//             querySuffix = $scope.search.title;
//             querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

//             $http({
//               method: 'GET',
//               url: '/api/search/' + querySuffix
//             })
//             .success(function(data) {
//               console.log('set the list in Games service');
//               Games.setList(data.items); //set the shared data
//               $scope.games = data.items;
//             })
//             .error(function(data) {
//               console.log(data);
//             });
//           }
//         }
//       };
//     }]);
// };
