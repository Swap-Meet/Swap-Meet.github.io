'use strict';

module.exports = function(app) {
  app.controller('searchCtrl', ['$scope', 'Games', function($scope, Games) {
    //getting data from service
    $scope.games = Games.searchResults();


    $scope.filterSearch = function() {
        console.log('Imagine I am doing a search now...');
    }
    //var swapBackend = new ResourceBackend('swaps');

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
