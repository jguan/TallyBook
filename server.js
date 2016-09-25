'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs');

// Bootstrap models
var modelsPath = path.join(__dirname, 'server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

// "env" Environment mode, defaults to process.env.NODE_ENV (NODE_ENV environment variable) or "development"
// http://expressjs.com/4x/api.html
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[app.get('env')];

require('./server/config/express')(app, config);

require('./server/config/db')(config);

require('./server/config/passport')();

require('./server/config/routes')(app);

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
    console.log("-> Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});
