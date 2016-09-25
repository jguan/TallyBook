var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

module.exports = function() {
  /*passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({username:username}).exec(function(err, user) {
        if(user && user.authenticate(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
    }
  ));*/

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and deserialize users out of session
  // http://passportjs.org/guide/configure/

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    console.log(user);
    if (user) {
       done(null, user.id);
    }
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    // don't ever give out the password
    User.findById(id, '-password', function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if there's already a user with that email
        if (user) {
          //return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          return done(null, false, 'That email is already taken.');
        } else {

          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });

    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email'
    },
    function(email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'email': email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)
          //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          return done(null, false, 'No user found.');

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          //return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
          return done(null, false, 'Oops! Wrong password.');

        // all is well, return successful user
        return done(null, user);
      });

    }));

}