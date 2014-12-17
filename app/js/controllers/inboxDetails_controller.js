// controller for view 4, Browse Game Details.
'use strict';

module.exports = function(app) {
  app.controller('inboxDetailsCtrl', ['$scope', function($scope) {

    //I think that this will be an array holding 2 games:
    //The first game is this user A's game.
    //The second game is user B's game.
    $scope.trade = [{
      title: 'Pac Man',
      score: 'String',
      publisher: 'String',
      zip: '98087',
      latitude: 'String',
      longitude: 'String',
      owner_screenname: 'SeahawksDude123',
      owner: 'String_id_number', //id number
      short_description: 'Eat all the dots, run from the ghosts, for now...',
      platform: 'NES',
      image_urls: ['http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/400px-Pac_Man.svg.png',
      'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
    },
    {
      title: 'Ms. Pac Man',
      score: 'String',
      publisher: 'String',
      zip: '98087',
      latitude: 'String',
      longitude: 'String',
      owner_screenname: 'RockingRedXYZ',
      owner: 'String_id_number', //id number
      short_description: 'Be awesome...',
      platform: 'NES',
      image_urls: ['http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/400px-Pac_Man.svg.png',
      'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mspacmancabinet.png/512px-Mspacmancabinet.png']
    }];

    $scope.declineTrade = function() {
      console.log('Imagine I am declining a trade request now...');
    };

  }]);

};
