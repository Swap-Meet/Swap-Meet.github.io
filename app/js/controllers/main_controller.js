'use strict';

module.exports = function(app) {
  app.controller('mainCtrl', ['$scope', function($scope) {
    //this is fake data
    $scope.games = [
    {title: 'Grim Fandango', platform: 'C64' },
    {title: 'Lode Runner', platform: 'PS4' },
    {title: 'Spy Hunter', platform: 'XBOX' },
    {title: 'Pac Man', platform: 'NES' },
    {title: 'Uno', platform: 'Card' },
    {title: 'Punchout', platform: 'PS2' },
    {title: 'Journey', platform: 'Atari' },
    {title: 'Da Blob', platform: 'Wii' },
    {title: 'Shadow Recruit', platform: 'SEGA' },
    {title: 'Super Mario Bros.', platform: 'Amiga' },
    {title: 'Castle Wolfenstein', platform: 'IIc' }
    ];
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
