'use strict';

module.exports = function(app) {
  app.controller('profileCtrl', ['$scope', function($scope) {
    //this is fake data
    $scope.avatar_url = 'http://res.cloudinary.com/swapmeet/image/upload/c_fill,h_100,w_100/mif6vhmdjjwzo8tyg6ct.jpg';
    $scope.screenname = 'ilovemonkeys99';
    $scope.email = 'monkeysee@monkeydo.com';
    $scope.zip = '98136';

  }]);
};
