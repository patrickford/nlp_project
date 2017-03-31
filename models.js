const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogPostSchema = mongoose.Schema({
  username: {type: String, required: true},
  text: {type: Object, required: true},
  created: {type: Date, default: Date.now}
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""}
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
}

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.userName,
    text: this.text,
    created: this.created
  };
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const userData = mongoose.model('user_records', blogPostSchema);
const User = mongoose.model('user', UserSchema);
module.exports = {userData, User};
