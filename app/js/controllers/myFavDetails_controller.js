// controller for view 8, myFavDetails_template.html
'use strict';

module.exports = function(app) {
  app.controller('myFavDetailsCtrl', ['$scope', function($scope) {

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
      image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg', 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
    };

    $scope.removeFavorite = function() {
      console.log('Imagine removing from favorites');
    };

  }]);

};
