'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var config = require('config');
var validator = require('validator');
var mongooseDelete = require('mongoose-delete');
var bcrypt = BBPromise.promisifyAll(require('bcrypt'));

var HoistUserSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  name: {
    type: String
  },
  organisations: [{
    type: ShortId,
    required: 'User must belong to an Organisation',
    index: true,
    ref: 'Organisation'
  }],
  emailAddresses: [{
    _id : false,
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

HoistUserSchema.method({
  verifyPassword: function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  },
  setPassword: function (password, callback) {
    return BBPromise.try(function () {
      return bcrypt.genSaltAsync(config.get('Hoist.security.passwordStrength'));
    }).bind(this).then(function (salt) {
      return bcrypt.hashAsync(password, salt);
    }).then(function (passwordHash) {
      this.passwordHash = passwordHash;
    }).nodeify(callback);
  }
});

HoistUserSchema.plugin(mongooseDelete);
HoistUserSchema.plugin(timestamps);

mongoose.model('HoistUser', HoistUserSchema);

var HoistUser = mongoose.model('HoistUser');
BBPromise.promisifyAll(HoistUser);
BBPromise.promisifyAll(HoistUser.prototype);
exports.name = 'HoistUser';
exports.model = HoistUser;
