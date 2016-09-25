/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var csrf = require('csurf');
//var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var path = require('path');
var passport = require('passport');

var lessMiddleware = require('less-middleware');

var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Express configuration.
 */

module.exports = function(app, config) {
    app.set('port', config.port);
    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');
    app.use(connectAssets({
      paths: ['public/css', 'public/app'],
      helperContext: app.locals
    }));
    app.use(compress());
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(expressValidator());
    app.use(methodOverride());

    // required for passport
    app.use(session({secret: 'tallybookiscool'}));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    app.use(csrf());
    app.use(function (req, res, next) {
      res.locals._csrf = req.csrfToken();
      //AngularJS's $http library reads the token from the XSRF-TOKEN cookie
      //http://www.mircozeiss.com/using-csrf-with-express-and-angular/
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
    });

    app.use(express.static(config.rootPath + '/public'));

    app.use(lessMiddleware(config.rootPath + '/public'));

    app.use(function(req, res, next) {
        // Keep track of previous URL to redirect back to
        // original destination after a successful login.
        if (req.method !== 'GET') return next();
        var path = req.path.split('/')[1];
        if (/(auth|login|logout|signup)$/i.test(path)) return next();
        req.session.returnTo = req.path;
        next();
    });
};
