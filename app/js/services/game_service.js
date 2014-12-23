'use strict';

module.exports = function(app) {
  app.factory('Games', [function() {

    var data = {
        list: [],
        chooseList: [],
        inList: [],
        outList: [],
        myList: [],
        favList: []
    };

    return {
        getList: function() {
          return data.list;
        },
        setList: function(gameArray) {
          data.list = gameArray;
        },

        getChooseList: function() {
          return data.chooseList;
        },
        setChooseList: function(inboxArray) {
          data.chooseList = inboxArray;
        },

        getInList: function() {
          return data.inList;
        },
        setInList: function(tradeArray) {
          data.inList = tradeArray;
        },

        getOutList: function() {
          return data.outList;
        },
        setOutList: function(outboxArray) {
          data.outList = outboxArray;
        },

        getMyList: function() {
          return data.myList;
        },
        setMyList: function(myGameArray) {
          data.myList = myGameArray;
        },

        getFavList: function() {
          return data.favList;
        },
        setFavList: function(favArray) {
          data.favList = favArray;
        }
    };
  }]);
};
