'use strict';

module.exports = function(app) {

  app.factory('Games', function() {

    return {
      searchResults: function() {
        // to-do item: use $http to make call to server
        return [
            { id: '548f75df27398d8b9bfeac07',
              owner: '548f75df27398d8b9bfeac05',
              title: 'Monkey Island',
              platform: 'XBOX',
              image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
            { id: '548f75df27398d8b9bfeac08',
              owner: '548f75df27398d8b9bfeac05',
              title: 'Grim Fandango',
              platform: 'PC',
              image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']},
            { id: '548f75df27398d8b9bfeac09',
              owner: '548f75df27398d8b9bfeac05',
              title: 'Settlers of Catan',
              platform: 'Board',
              image_urls: ['http://www.colinpurcell.ca/wp-content/uploads/2013/10/Pacman-02_640x250px.jpg',
              'http://res.cloudinary.com/swapmeet/image/upload/mif6vhmdjjwzo8tyg6ct.jpg']}
          ];
      }
    };
  });
};
