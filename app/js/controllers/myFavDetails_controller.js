// controller for view 8, myFavDetails_template.html
'use strict';

module.exports = function(app) {
  app.controller('myFavDetailsCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', '$route', 'Games',
    function($scope, $location, $http, $cookies, $routeParams, $route, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      console.log(Games.getFavList());
      $scope.favs = Games.getFavList();
      $scope.whichFav = $routeParams.indexID;

      // $scope.removeFavorite = function(gameID, gameIndex) {
      //   favs[whichFav]._id, $index
      //   var gameList = Games.getList();
      //   gameList[gameIndex].already_wanted = false;
      //   Games.setList(gameList);

      //   var favList = Games.getFavList();
      //   favList.splice(gameIndex, 1);
      //   Games.setFavList(favList);

      //   $http.defaults.headers.common['jwt'] = $cookies.jwt;
      //   $http({
      //     method: 'PUT',
      //     url: '/api/games/favorites',
      //     data: { _id: gameID }
      //   })
      //   .success(function(data) {
      //     console.log('Removed from favorites: ' + data.items);
      //     $route.reload();

      //   })
      //   .error(function(data) {
      //     console.log(data);
      //   });
      // };

    }]);

};
