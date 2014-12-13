module.exports = function(err, res, errorCode, msg) {
  if (err) return res.status(400).json({error:errorCode, msg: msg});
};
