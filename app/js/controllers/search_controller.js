'use strict';

module.exports = function(app) {
  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {

    $scope.index = function() {
      Games.index()
      .success(function(data) {
        $scope.games = data.items;
      });
    };

    //Here is index called inside the controller (i.e. not as a service)
    // $scope.index = function() {
    //   $http({
    //     method: 'GET',
    //     url: '/api/browse'
    //   })
    //   .success(function(data) {
    //     $scope.games = data.items;
    //   })
    //   .error(function(data) {
    //     console.log(data);
    //   });
    // };

    $scope.filterSearch = function() {
      console.log('Imagine I am doing a search now...');
    };
  }]);
};
