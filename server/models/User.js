var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  //firstName: {type:String},
  //lastName: {type:String},
  email: {
    type: String,
    required: '{PATH} is required!',
    unique: true,
    lowercase: true,
    trim: true
  },
  //salt: {type:String, required:'{PATH} is required!'},
  //hashed_pwd: {type:String, required:'{PATH} is required!'},
  password: {type:String, required:'{PATH} is required!'},
  roles: [String]
});
userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

var Category = require('mongoose').model('Category');

function createCategories(user) {
  console.log(user.id);
  Category.find({user: user.id}).exec(function(err, collection) {
    console.log(collection);
    if(collection.length === 0) {
      Category.create({name: 'Groceries', type: 'expense', user: user.id}, function (err) {
        console.log(err);
      });
      Category.create({name: 'Homewares', type: 'expense', user: user.id});
      Category.create({name: 'Insurances', type: 'expense', user: user.id});
      Category.create({name: 'Salary', type: 'income', user: user.id});
      Category.create({name: 'Interest', type: 'income', user: user.id});
    }
  })
}

function createDefaultUsers() {
  User.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      var password;
      password = encrypt.generateHash('admin');
      User.create({email:'jeremy.guan@gmail.com', password: password, roles: ['admin']});
      password = encrypt.generateHash('testing1');
      User.create({email:'test1@test.com', password: password, roles: ['user']}, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          //console.log(user);
          createCategories(user);
        }
      });
      password = encrypt.generateHash('testing2');
      User.create({email:'test2@test.com', password: password}, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          //console.log(user);
          createCategories(user);
        }
      });
    }
  })
}

exports.createDefaultUsers = createDefaultUsers;