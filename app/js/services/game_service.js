'use strict';

module.exports = function(app) {
  app.factory('Games', [function() {

    var data = {
        list: []
    };

    return {
        getList: function() {
          console.dir('getting List Inside Games Service');
          return data.list;
        },
        setList: function(gameArray) {
          console.dir('setting List Inside Games Service');
          data.list = gameArray;
        }
    };
  }]);
};
