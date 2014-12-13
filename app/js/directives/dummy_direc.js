'use strict';

module.exports = function(app) {

  app.directive('dummyDirec', function() {
    return {
      restrict: 'AC',
      template: '{{someVal}}<br><input type="text" data-ng-model="someVal">',
      scope: {}
    };
  });

};
