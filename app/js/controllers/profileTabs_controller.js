'use strict';

module.exports = function(app) {

  app.controller('TabCtrl', function() {
    this.tab = 1;  // init with 1

    this.selectTab = function(aTab) {
      this.tab = aTab;
    };

    this.isSelected = function(tabToCheck) {
      return this.tab === tabToCheck;
    };
  }); // end TabCtrl

};
