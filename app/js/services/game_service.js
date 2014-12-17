'use strict';

module.exports = function(app) {
  var handleErrors = function(data) {
    console.log('game_service error: ' + data);
  };

  app.factory('Games', ['$http', function($http) {

    return {
      index: function() {
        return $http({
          method: 'GET',
          url: '/api/browse'
        })
        .error(handleErrors);
      },
      filterSearch: function(searchTitleString) {
        console.log('game_service search attempt ' + searchTitleString);
        return $http({
          method: 'GET',
          url: '/api/search/' + searchTitleString
        })
        .error(handleErrors);
      }
    };

  }]);
};  // end module

// MOCK DATA
// return [
//     { id: '548f75df27398d8b9bfeac07',
//       owner: '548f75df27398d8b9bfeac05',
//       owner_screenname: 'Funkenstein',
//       title: 'De Blob',
//       platform: 'Wii',
//       image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416598221/hewndsp60tcvfmcwqljx.jpg',
//       'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
//     { id: '548f75df27398d8b9bfeac08',
//       owner: '548f75df27398d8b9bfeac05',
//       owner_screenname: 'Luigi23',
//       title: 'Wario: Smooth Moves',
//       platform: 'Wii',
//       image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416560287/gtnjubrv8zsvfnm3eqql.jpg',
//       'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
//     { id: '548f75df27398d8b9bfeac09',
//       owner: '548f75df27398d8b9bfeac05',
//       owner_screenname: 'SoccerMom1978',
//       title: 'Wii Fit',
//       platform: 'Wii',
//       image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416601976/rcopdo45tbyfgkqajzae.jpg',
//       'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']}
// ];
