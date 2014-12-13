'use strict';

// thought:  "controller is between the DB and the View"

// module.exports = function(app) {

//   app.controller('notesCtrl', ['$scope', '$http', 'ResourceBackend', function($scope, $http, ResourceBackend) {
//     var notesBackend = new ResourceBackend('notes');

//     $scope.index = function() {
//       notesBackend.index()
//       .success(function(data) {
//         $scope.notes = data;
//       });
//     };

//     $scope.saveNewNote = function() {
//       notesBackend.saveNew($scope.newNote)
//       .success(function(data) {
//         $scope.notes.push(data);
//         $scope.newNote = null;
//       });
//     };

//     $scope.saveNote = function(note) {
//       notesBackend.save(note)
//       .success(function() {
//         note.editing = false;
//       });
//     };

//     $scope.deleteNote = function(note) {
//       notesBackend.delete(note)
//       .success(function() {
//         $scope.notes.splice($scope.notes.indexOf(note), 1);
//       });
//     };
//   }]);

// };
