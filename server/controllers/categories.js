var Category = require('mongoose').model('Category');

exports.getCategoriesByUserId = function(req, res) {
  Category.find({user:req.params.uid}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.createCategory = function(req, res) {
  var categoryData = req.body;

  if(req.user._id != categoryData.user && !req.user.hasRole('admin')) {
    //403 Forbidden
    res.status(403);
    return res.end();
  }

  categoryData.name = categoryData.name.toLowerCase();
  categoryData.type = categoryData.type.toLowerCase();
  Category.create(categoryData, function(err, category) {
    if(err) {
      //400 Bad Request
      res.status(400);
      return res.send({reason:err.toString()});
      //return next(err);
    }
    res.send(category);
  })
};

exports.updateCategory = function(req, res) {
  var categoryUpdates = req.body;
  console.log(categoryUpdates);

  if(req.user._id != categoryUpdates.user && !req.user.hasRole('admin')) {
    //403 Forbidden
    res.status(403);
    return res.end();
  }

  Category.findById(req.params.id, function (err, category) {
    category.name = categoryUpdates.name.toLowerCase();
    category.type = categoryUpdates.type.toLowerCase();
    return category.save(function (err) {
      //400 Bad Request
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.send(category);
    });
  });
};

exports.deleteCategory = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    console.log(err);
    console.log(req.user._id.valueOf());
    console.log(category.user.valueOf());

    if(JSON.stringify(req.user._id) != JSON.stringify(category.user) && !req.user.hasRole('admin')) {
      //403 Forbidden
      res.status(403);
      return res.end();
    }

    return category.remove(function (err) {
      //400 Bad Request
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.send(category);
    });
  });
};