'use strict';
module.exports = function(app) {

  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {

    $scope.index = function() {
      Games.index()
      .success(function(data) {
        console.log('Ran index() search, got: ' + data.items);
        $scope.games = data.items;
      });
    };

    $scope.filterSearch = function() {
      var querySuffix = $scope.search.title;
      querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

      Games.filterSearch(querySuffix)
      .success(function(data) {
        console.log('Ran filterSearch() search, got: ' + data.items);
        $scope.games = data.items;
      });
    };

  }]); // end seachCtrl

}; // end module exports
