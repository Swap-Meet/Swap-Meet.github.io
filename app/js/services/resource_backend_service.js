module.exports = function(app) {
  'use strict';

  // TODO:  Make this
  // var handleErrors = function(data) {
  //   console.log(data);
  // };

  // app.factory('ResourceBackend', ['$http', function($http) {
  //   return function(resourceName) {
  //     return {
  //       index: function() {
  //         return $http({
  //           method: 'GET',
  //           url: '/api/' + resourceName
  //         })
  //         .error(handleErrors);
  //       },

  //       saveNew: function(resource) {
  //         return $http({
  //           method: 'POST',
  //           url: '/api/' + resourceName,
  //           data: resource
  //         })
  //         .error(handleErrors);
  //       },

  //       save: function(resource) {
  //         return $http({
  //           method: 'PUT',
  //           url: '/api/' + resourceName + '/' + resource._id,
  //           data: resource
  //         })
  //         .error(handleErrors);
  //       },

  //       delete: function(resource) {
  //         return $http({
  //           method: 'DELETE',
  //           url: '/api/' + resourceName + '/' + resource._id
  //         })
  //         .error(handleErrors);
  //       }
  //     };
  //   };
  // }]);

};
