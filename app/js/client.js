'use strict';

require('angular/angular');
require('angular-route');
require('angular-resource');

//var swapApp = angular.module('swapApp', ['ngRoute']);
var swapApp = angular.module('swapApp', ['ngResource', 'ngRoute']);

// load services
require('./services/resource_backend_service')(swapApp);
require('./services/game_service')(swapApp);

// load controllers
require('./controllers/search_controller')(swapApp);
require('./controllers/profile_controller')(swapApp);
require('./controllers/gameDetails_controller')(swapApp);
require('./controllers/myFavDetails_controller')(swapApp);
require('./controllers/myGameDetails_controller')(swapApp);
require('./controllers/addGame_controller')(swapApp);
require('./controllers/inboxDetails_controller')(swapApp);
require('./controllers/outboxDetails_controller')(swapApp);
require('./controllers/login_controller')(swapApp);
require('./controllers/chooseGame_controller')(swapApp);
require('./controllers/offerGames_controller')(swapApp);

//setup $routeProvider
swapApp.config(['$routeProvider', '$locationProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/search_template.html',
      controller: 'searchCtrl'
    })
    .when('/login', {
      templateUrl: 'templates/login_template.html',
      controller: 'loginCtrl'
    })
    .when('/filtersearch', {
      templateUrl: 'templates/filter_template.html',
      controller: 'searchCtrl'
    })
    .when('/gamedetails', {
      templateUrl: 'templates/gameDetails_template.html',
      controller: 'gameDetailsCtrl'
    })
    .when('/offerGames', {
      templateUrl: 'templates/offerGames_template.html',
      controller: 'offerGamesCtrl'
    })
    .when('/choosegame', {
      templateUrl: 'templates/chooseGame_template.html',
      controller: 'chooseGameCtrl'
    })
    .when('/mygamedetails', {
      templateUrl: 'templates/myGameDetails_template.html',
      controller: 'myGameDetailsCtrl'
    })
    .when('/myfavdetails', {
      templateUrl: 'templates/myFavDetails_template.html',
      controller: 'myFavDetailsCtrl'
    })
    .when('/profile', {
      templateUrl: 'templates/profile_template.html',
      controller: 'profileCtrl'
    })
    .when('/addgame', {
      templateUrl: 'templates/addGame_template.html',
      controller: 'addGameCtrl'
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
