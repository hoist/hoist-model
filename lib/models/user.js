'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var validator = require('validator');
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  organisations: [{
    type: ShortId,
    required: 'User must belong to an Organisation',
    index: true,
    ref:'organisation'
  }],
  emailAddresses: [{
    address: {
      type: String,
      index: true,
      required: 'email address is required',
      validate: [
        function (email) {
          return validator.isEmail(email);
        }, 'the email address {VALUE} is not valid'
      ]
    },
    verified: {
      type: Boolean
    }
  }],
  passwordHash: {
    type: String
  }
});

UserSchema.method({
    verifyPassword: function(password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
});

UserSchema.plugin(timestamps);

mongoose.model('User', UserSchema);

var User = mongoose.model('User');
BBPromise.promisifyAll(User);
BBPromise.promisifyAll(User.prototype);
exports.name = 'User';
exports.model = User;
