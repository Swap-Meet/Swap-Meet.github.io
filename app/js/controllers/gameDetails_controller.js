// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', function($scope) {

    //this is fake data
    // $scope.game.title = 'Pac Man HI';

    $scope.game = {
      title: 'Pac Man',
      score: 'String',
      publisher: 'String',
      zip: '98087',
      latitude: 'String',
      longitude: 'String',
      owner: 'String_id_number', //id number
      short_description: 'Eat all the dots, run from the ghosts, for now...',
      platform: 'NES',
      image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
      'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
    };

    $scope.sendRequest = function() {
      console.log('Imagine I am sending a request now...');
    };

    $scope.addFavorite = function() {
      console.log('Imagine Adding to favorites');
    };

  }]);

};
