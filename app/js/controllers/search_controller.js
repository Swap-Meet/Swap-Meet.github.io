'use strict';

module.exports = function(app) {

  //app.controller('searchCtrl', ['$scope', '$http', function($scope, $http) {
  //This uses the Game service
  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {

    $scope.message = Games.message;
    console.log('SC-Message: ' + $scope.message);

    $scope.index = function() {
      Games.index()
      .success(function(data) {
        console.log('Ran index() search, got: ' + data.items);
        $scope.games = data.items;
      });
    };

    $scope.filterSearch = function() {
      var querySuffix = $scope.search.title;
      console.log('starting search_controller now w title:' + $scope.search.title);
      querySuffix = '?q=' + querySuffix.replace(/ /g, '%');

      // using the bind, and change the message to pass the right querySuffix, kludgey
      $scope.message = querySuffix;

      Games.filterSearch(querySuffix)
      .success(function(data) {
        console.dir('SC-success data.items: ' + data.items);
        $scope.games = data.items;
      });
    };

  }]); // end seachCtrl

}; // end module exports
