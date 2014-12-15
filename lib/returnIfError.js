'use strict';

module.exports = function(err, res, errorCode, msg, status) {
  if (err) return res.status(status || 400).json({error:errorCode, msg: msg});
  else return 0;
};
