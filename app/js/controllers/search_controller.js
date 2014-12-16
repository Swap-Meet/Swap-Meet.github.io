'use strict';

module.exports = function(app) {
  app.controller('searchCtrl', ['$scope', function($scope) {
    //this is less fake data
    $scope.games = [
      { id: '548f75df27398d8b9bfeac07',
        owner: '548f75df27398d8b9bfeac05',
        title: 'Monkey Island',
        platform: 'XBOX' },
      { id: '548f75df27398d8b9bfeac08',
        owner: '548f75df27398d8b9bfeac05',
        title: 'Grim Fandango',
        platform: 'PC' },
      { id: '548f75df27398d8b9bfeac09',
        owner: '548f75df27398d8b9bfeac05',
        title: 'Settlers of Catan',
        platform: 'Board' }
    ];

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
