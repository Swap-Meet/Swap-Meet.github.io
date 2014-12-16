'use strict';

require('angular/angular');
require('angular-route');
require('angular-resource');

//var swapApp = angular.module('swapApp', ['ngRoute']);
var swapApp = angular.module('swapApp', ['ngResource', 'ngRoute']);

// load services
require('./services/resource_backend_service')(swapApp);

// load controllers
require('./controllers/search_controller')(swapApp);
require('./controllers/profile_controller')(swapApp);
require('./controllers/gameDetails_controller')(swapApp);
require('./controllers/inboxDetails_controller')(swapApp);
require('./controllers/outboxDetails_controller')(swapApp);

//setup $routeProvider
swapApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: 'templates/search_template.html',
      controller: 'searchCtrl'
    })
    .when('/profile', {
      templateUrl: 'templates/profile_template.html',
      controller: 'profileCtrl'
    })
    .when('/filtersearch', {
      templateUrl: 'templates/filter_template.html',
      controller: 'searchCtrl'
    })
    .when('/gamedetails', {
      templateUrl: 'templates/gameDetails_template.html',
      controller: 'gameDetailsCtrl'
    })
    .when('/inboxrequestdetails', {
      templateUrl: 'templates/inboxDetails_template.html',
      controller: 'inboxDetailsCtrl'
    })
    .when('/outboxrequestdetails', {
      templateUrl: 'templates/outboxDetails_template.html',
      controller: 'outboxDetailsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
