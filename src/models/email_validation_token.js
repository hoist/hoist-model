'use strict';
var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('@hoist/mongoose-delete');
var keygen = require('keygenerator');

var EmailValidationTokenSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  user: {
    type: ShortId,
    ref: 'HoistUser',
    required: 'Must belong to a Hoist User'
  },
  email: {
    type: String,
    required: 'Must have an email address'
  },
  activationCode: {
    type: String,
    index: true,
    required: 'Must have an activation code',
    unique: true,
    default: function () {
      return keygen._();
    }
  },
  activatedDate: {
    type: Date,
    default: null
  },
  activated: {
    type: Boolean,
    default: false
  }
});

EmailValidationTokenSchema.plugin(mongooseDelete);
EmailValidationTokenSchema.plugin(timestamps);

mongoose.model('EmailValidationToken', EmailValidationTokenSchema);

var EmailValidationToken = mongoose.model('EmailValidationToken');
BBPromise.promisifyAll(EmailValidationToken);
BBPromise.promisifyAll(EmailValidationToken.prototype);
exports.name = 'EmailValidationToken';
exports.model = EmailValidationToken;
