'use strict';

module.exports = function(app) {
  app.controller('chooseGameCtrl', ['$scope', '$http', '$cookies', '$location', '$routeParams', 'Games',
    function($scope, $http, $cookies, $location, $routeParams, Games) {

      if (!$cookies.jwt) {
        $location.path('/login');
      }
      $http.defaults.headers.common['jwt'] = $cookies.jwt;
      var email = Games.getChooseList()[0].outgoing_user_email;
      var allIns = Games.getChooseList();
      $scope.ins = Games.getChooseList();
      var which = $routeParams.indexID;
      $scope.whichIn = $routeParams.indexID;

      $scope.acceptRequest = function(gameIndex) {
        var trades = [];
        trades.push(allIns[which].gameInfo);
        trades.push(allIns[which].potentialTrades[gameIndex]);
        trades.push(email);
        Games.setInList(trades);
      };

      $scope.declineRequest = function() {
        $location.path('/profile');
        //ultimately should remove from inbox list
      };
    }]);
};
