'use strict';

module.exports = function(app) {
  app.factory('Games', [function() {

    var data = {
        list: []
    };

    return {
        getList: function() {
          return data.list;
        },
        setList: function(gameArray) {
          data.list = gameArray;
        }
    };
  }]);
};
