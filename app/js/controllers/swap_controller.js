'use strict';

module.exports = function(app) {
  app.controller('swapCtrl', ['$scope', 'ResourceBackend', function($scope, ResourceBackend) {
    var swapBackend = new ResourceBackend('swaps');

    // $scope.index = function() {
    //   swapBackend.index()
    //   .success(function(data) {
    //     $scope.swaps = data;
    //   });
    // };

    // $scope.saveNewNote = function() {
    //   notesBackend.saveNew($scope.newNote)
    //   .success(function(data) {
    //     $scope.notes.push(data);
    //     $scope.newNote = null;
    //   });
    // };

    // $scope.saveNote = function(note) {
    //   notesBackend.save(note)
    //   .success(function() {
    //     note.editing = false;
    //   });
    // };

    // $scope.deleteNote = function(note) {
    //   notesBackend.delete(note)
    //   .success(function() {
    //     $scope.notes.splice($scope.notes.indexOf(note), 1);
    //   });
    // };
  }]);
};
