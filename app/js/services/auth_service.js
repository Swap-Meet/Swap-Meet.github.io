'use strict';

module.exports = function(app) {
  app.factory('AuthService', [function() {

    return {
      currentUser: undefined,
      isAuthenticated: function() {
        console.log(this.currentUser);
        return !!this.currentUser;
      }
    };
  }]);
};

// 'use strict';

// module.exports = function(app) {
//   app.factory('AuthService', ['$http', '$cookies', '$location', function($http, $cookies, $location) {

//     return {
//       isAuthenticated: function() {
//         if (!$cookies.jwt || $cookies.jwt.length === 0) {
//           $location.path('/');
//           return false;
//         } else {
//           $http.defaults.headers.common['jwt'] = $cookies.jwt;
//           return true;
//         }
//       },
//       logOut: function() {
//         $cookies.jwt = null;
//         $http.defaults.headers.common['jwt'] = null;
//         return $location.path('/');
//       }
//     };
//   }]);
// };
