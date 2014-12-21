'use strict';
/* Special thanks to all these individual people who helped us with this project:
Ivan Storck, Tyler Morgan , Brook Riggio, Charles Renwick, Jacob Schafer, Stephanie Lingwood

Citation of references that were used to help put this application together:
1. ng-book by Ari Lerner
  https://www.ng-book.com/
2. All You Need to Know About AngularJS by Johnny Tran
  https://www.youtube.com/playlist?list=PLzJZ3ahfm9Q8pwP88ZRSdjwlwn6lrHzrT
3. Pluralsight: Building AngularJS and Node.js Apps with the MEAN Stack by Joe Eames
  http://www.pluralsight.com/courses/building-angularjs-nodejs-apps-mean
4. Scotch IO - How To Use ngShow and ngHide by Chris Sevilleja
  http://scotch.io/tutorials/javascript/how-to-use-ngshow-and-nghide
5. Ideyatech: Introduction to Angular Framework by Chastine Bayubay
  http://www.ideyatech.com/2013/11/angularjs-intro/
*/

require('angular/angular');
require('angular-route');
require('angular-resource');
require('angular-cookies');
require('angular-base64');

var swapApp = angular.module('swapApp', ['ngResource', 'ngRoute', 'ngCookies', 'base64']);

// load services
require('./services/game_service')(swapApp);
require('./services/offer_service')(swapApp);

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
require('./controllers/profileTabs_controller')(swapApp);

//setup $routeProvider
swapApp.config(['$routeProvider', function($routeProvider) {
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
    .when('/gamedetails/:indexID', {
      templateUrl: 'templates/gameDetails_template.html',
      controller: 'gameDetailsCtrl'
    })
    .when('/offergames', {
      templateUrl: 'templates/offerGames_template.html',
      controller: 'offerGamesCtrl'
    })
    .when('/choosegame', {
      templateUrl: 'templates/chooseGame_template.html',
      controller: 'chooseGameCtrl'
    })
    .when('/mygamedetails/:indexID', {
      templateUrl: 'templates/myGameDetails_template.html',
      controller: 'myGameDetailsCtrl'
    })
    .when('/myfavdetails/:indexID', {
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
    .when('/inboxrequestdetails/:indexID', {
      templateUrl: 'templates/inboxDetails_template.html',
      controller: 'inboxDetailsCtrl'
    })
    .when('/outboxrequestdetails/:indexID', {
      templateUrl: 'templates/outboxDetails_template.html',
      controller: 'outboxDetailsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
