'use strict';

module.exports = function(app) {
  app.factory('Offers', [function() {

    var gameId = '';

    return {
      setWantGame: function(wantGame) {
        gameId = wantGame;
      },
      getWantGame: function() {
        return gameId;
      }
    };
  }]);
};
