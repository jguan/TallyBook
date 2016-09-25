var Transaction = require('mongoose').model('Transaction');

exports.getTransactionsByUserId = function(req, res) {
  var year = req.params.year;
  var month = req.params.month;
  var start = new Date(year, month, 1);
  // month is string so have to convert it to num
  var end = new Date(year, month-0+1, 1); // it works even if month is Dec

  Transaction.find({user:req.params.uid, date: {$gte: start, $lt: end}})
    .populate('category')
    .sort('date')
    .exec(function(err, collection) {
    res.send(collection);
  })
};

exports.createTransaction = function(req, res) {
  var transactionData = req.body;

  if(req.user._id != transactionData.user && !req.user.hasRole('admin')) {
    //403 Forbidden
    res.status(403);
    return res.end();
  }

  Transaction.create(transactionData, function(err, transaction) {
    if(err) {
      //400 Bad Request
      res.status(400);
      return res.send({reason:err.toString()});
      //return next(err);
    }
    res.send(transaction);
  })
};

exports.updateTransaction = function(req, res) {
  var transactionUpdates = req.body;
  console.log(transactionUpdates);

  if(req.user._id != transactionUpdates.user && !req.user.hasRole('admin')) {
    //403 Forbidden
    res.status(403);
    return res.end();
  }

  Transaction.findById(req.params.id, function (err, transaction) {
    return transaction.save(function (err) {
      //400 Bad Request
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.send(transaction);
    });
  });
};

exports.deleteTransaction = function(req, res) {
  Transaction.findById(req.params.id, function (err, transaction) {
    console.log(err);

    if(JSON.stringify(req.user._id) != JSON.stringify(transaction.user) && !req.user.hasRole('admin')) {
      //403 Forbidden
      res.status(403);
      return res.end();
    }

    return transaction.remove(function (err) {
      //400 Bad Request
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.send(transaction);
    });
  });
};