'use strict';

module.exports = function(app) {
  app.controller('profileCtrl', ['$scope', '$cookies', '$location', '$http', 'Games',
    function($scope, $cookies, $location, $http, Games) {

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
        Games.setChooseList(incoming.items);
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
        Games.setOutList(outgoing.items);
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
        Games.setMyList(mygames.items);
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
        Games.setFavList(favs.items);
        $scope.favorites = favs.items;
      })
      .error(function(data) {
        console.log(data);
      });

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
