'use strict';

module.exports = function(res, items) {
  console.log('success');
  res.status(200).json({
    error: 0,
    items: items || []
  });
};
