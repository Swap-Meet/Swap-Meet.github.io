'use strict';

module.exports = function(app) {
  app.factory('Offers', [function() {

    var data = {
        gameId: '',
        potentialTrades: []
    };

    return {
        getOffer: function() {
          return data;
        },
        setWantGame: function(wantGame) {
          data.gameId = wantGame;
        },
        setPotentialTrade: function(offerArray) {
          data.potentialTrades = offerArray;
        }
    };
  }]);
};
