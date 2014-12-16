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
require('./controllers/myFavDetails_controller')(swapApp);
require('./controllers/myGameDetails_controller')(swapApp);
require('./controllers/addGame_controller')(swapApp);

//setup $routeProvider
swapApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false);
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
    .when('/myfavdetails', {
      templateUrl: 'templates/myFavDetails_template.html',
      controller: 'myFavDetailsCtrl'
    })
    .when('/mygamedetails', {
      templateUrl: 'templates/myGameDetails_template.html',
      controller: 'myGameDetailsCtrl'
    })
    .when('/addgame', {
      templateUrl: 'templates/addGame_template.html',
      controller: 'addGameCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
