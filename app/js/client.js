'use strict';

require('angular/angular');
require('angular-route');

var swapApp = angular.module('swapApp', ['ngRoute']);

// load services
require('./services/resource_backend_service')(swapApp);

// load controllers
require('./controllers/swap_controller')(swapApp);

// setup $routeProvider
swapApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/thisroute', {
      templateUrl: 'templates/swaps/swap_template.html',
      controller: 'swapCtrl'
    })
    .otherwise({
      redirectTo: '/thisroute'
    });
}]);

// thanks Tyler!
// https://github.com/codefellows/sea-b24-notes/blob/angular_directives/app/js/client.js

// notesApp.config(['$routeProvider', function($routeProvider) {
//   $routeProvider
//   .when('/notes', {
//     templateUrl: 'templates/notes/notes_template.html',
//     controller: 'notesCtrl'
//   })
//   .otherwise({
//     redirectTo: '/notes'
//   });
// }]);
