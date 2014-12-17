'use strict';

module.exports = function(app) {

  app.factory('Games', function() {

    return {
      searchResults: function() {
        // to-do item: use $http to make call to server
        return [
            { id: '548f75df27398d8b9bfeac07',
              owner: '548f75df27398d8b9bfeac05',
              owner_screenname: 'Funkenstein',
              title: 'De Blob',
              platform: 'Wii',
              image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416598221/hewndsp60tcvfmcwqljx.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
            { id: '548f75df27398d8b9bfeac08',
              owner: '548f75df27398d8b9bfeac05',
              owner_screenname: 'Luigi23',
              title: 'Wario: Smooth Moves',
              platform: 'Wii',
              image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416560287/gtnjubrv8zsvfnm3eqql.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
            { id: '548f75df27398d8b9bfeac09',
              owner: '548f75df27398d8b9bfeac05',
              owner_screenname: 'SoccerMom1978',
              title: 'Wii Fit',
              platform: 'Wii',
              image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416601976/rcopdo45tbyfgkqajzae.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']}
          ];
      }
    };
  });
};