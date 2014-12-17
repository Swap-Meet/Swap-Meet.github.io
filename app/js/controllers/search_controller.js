'use strict';

module.exports = function(app) {
  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {
    //getting data from service
    //$scope.games = Games.index.items();
    $scope.index = function() {
      Games.index()
      .success(function(data) {
        $scope.games = data.items;
      });
    };

    $scope.filterSearch = function() {
      console.log('Imagine I am doing a search now...');
    };
  }]);
};
