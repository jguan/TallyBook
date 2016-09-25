var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/tallybook',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://username:password@xxx.mongolab.com:27567/tallybook',
    port: process.env.PORT || 80
  }
};
