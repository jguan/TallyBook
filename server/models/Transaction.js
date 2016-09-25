var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var transactionSchema = mongoose.Schema({
  date: {type: Date, required: '{PATH} is required!'},
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  amount: {type: Number, required: '{PATH} is required!', trim: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});
mongoose.model('Transaction', transactionSchema);
