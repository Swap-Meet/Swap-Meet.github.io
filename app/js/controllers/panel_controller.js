// an Angular Tabs controller
'use strict';
app.controller('PanelController', function(){

  // TODO:  Should this be $scope.tab instead of this.tab ?
  this.tab = 1;

  this.selectTab = function(setTab) {
    this.tab = setTab;    // this.tab is the currently sel'd tab
  };

  this.isSelected = function(checkTab){
    return this.tab === checkTab;  // retn T if checkTab is selected
  };

});
