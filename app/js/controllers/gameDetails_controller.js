// controller for view 4, Browse Game Details
'use strict';

module.exports = function(app) {
  app.controller('gameDetailsCtrl', ['$scope', function($scope) {

    //this is fake data
    // $scope.game.title = 'Pac Man HI';

    $scope.game = {
      title: 'De Blob',
      score: 'String',
      publisher: 'String',
      zip: '98087',
      latitude: 'String',
      longitude: 'String',
      owner: 'String_id_number', //id number
      owner_screenname: 'Funkenstein',
      short_description: 'Change the colors in Inktown with your friendly Blob.',
      platform: 'Wii',
      image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416598221/hewndsp60tcvfmcwqljx.jpg',
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
