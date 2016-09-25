var auth = require('./auth');
var users = require('../controllers/users');
var courses = require('../controllers/courses');
var contact = require('../controllers/contact');
var categories = require('../controllers/categories');
var transactions = require('../controllers/transactions');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var errorHandler = require('errorhandler');

module.exports = function (app) {
  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);

  app.get('/api/courses', courses.getCourses);
  app.get('/api/courses/:id', courses.getCourseById);

  app.get('/api/mycategories/:uid', categories.getCategoriesByUserId);

  app.post('/api/categories', categories.createCategory);
  app.put('/api/categories/:id', categories.updateCategory);
  app.delete('/api/categories/:id', categories.deleteCategory);

  app.get('/api/mytransactions/:uid/:year/:month', transactions.getTransactionsByUserId);

  app.post('/api/transactions', transactions.createTransaction);
  app.put('/api/transactions/:id', transactions.updateTransaction);
  app.delete('/api/transactions/:id', transactions.deleteTransaction);

  app.get('/partials/*', function (req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate);

  app.post('/logout', function (req, res) {
    req.logout();
    res.end();
  });

  app.post('/contact', contact.postContact);

  app.all('/api/*', function (req, res) {
    res.send(404);
  });

  app.get('*', function (req, res) {
    res.render('index', {
      // see auth.authenticate
      bootstrappedUser: req.user
    });
  });

  /**
   * 500 Error Handler.
   * As of Express 4.0 it must be placed at the end, after all routes.
   */

  app.use(errorHandler());

  // Official Error handlers
  //https://github.com/visionmedia/express/blob/master/examples/error-pages/index.js

};
