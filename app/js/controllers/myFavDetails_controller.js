// controller for view 8, myFavDetails_template.html
'use strict';

module.exports = function(app) {
  app.controller('myFavDetailsCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', 'Games',
    function($scope, $location, $http, $cookies, $routeParams, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      console.log(Games.getFavList());
      $scope.favs = Games.getFavList();
      $scope.whichFav = $routeParams.indexID;

      $scope.removeFavorite = function() {
        //should remove from list
      };

    }]);

};
