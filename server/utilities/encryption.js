var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

exports.createSalt = function() {
  return crypto.randomBytes(128).toString('base64');
};

exports.hashPwd = function(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
};

exports.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};