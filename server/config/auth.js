var passport = require('passport');

exports.authenticate = function(req, res, next) {
  req.body.email = req.body.email.toLowerCase();
  var auth = passport.authenticate('local-login', function(err, user) {
    //console.log(err);
    //console.log(user);
    if(err) {return next(err);}
    if(!user) { res.send({success:false})}
    req.logIn(user, function(err) {
      if(err) {return next(err);}

      var hour = 3600000;
      var day = hour * 24;
      var week = day * 7;

      //console.log(req.session.cookie);
      if (req.body.rememberme) {
        req.session.cookie.maxAge = week;
      } else {
        req.session.cookie.expires = false;
      }
      //console.log(req.session.cookie);

      res.send({success:true, user: user});
    })
  });
  auth(req, res, next);
};

exports.requiresApiLogin = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresRole = function(role) {
  return function(req, res, next) {
    if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  }
};