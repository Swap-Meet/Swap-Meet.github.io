require('angular/angular');
require('angular-route');

var swapApp = angular.module('swapApp', ['ngRoute']);

// load directives
require('./directives/dummy_direc')(swapApp);

// load services
require('./services/resource_backend_service')(swapApp);

// load controllers
require('./controllers/swap_controller')(swapApp);

// setup $routeProvider
swapApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/thisroute', {
      templateUrl: 'templates/swap_template.html',
      controller: 'swapCtrl'
    })
    .when('/someotherroute', {
      templateUrl: 'templates/swap_template.html',
      controller: 'swapCtrl2'
    })
    .when('/thelastroute', {
      templateUrl: 'templates/swap_template.html',
      controller: 'swapCtrl3'
    })
    .otherwise({
      redirectTo: '/browse'
    });
}]);

// thanks Tyler!
// https://github.com/codefellows/sea-b24-notes/blob/angular_directives/app/js/client.js
