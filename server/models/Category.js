var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required!',
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['expense', 'income']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
mongoose.model('Category', categorySchema);
