'use strict';

module.exports = function(app) {

  //app.controller('searchCtrl', ['$scope', '$http', function($scope, $http) {
  //This uses the Game service
  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {

    $scope.index = function() {
      Games.index()
      .success(function(data) {
        //console.log('Ran index() search, got: ' + data);
        $scope.games = data.items;
      });
    };

    $scope.filterSearch = function() {
      var querySuffix = $scope.search.title;
      console.log('start search_controller now w title:' + $scope.search.title);
      querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

      Games.filterSearch(querySuffix)
      .success(function(data) {
        $scope.games = data.items;
      });
    };

  }]); // end seachCtrl

}; // end module exports
