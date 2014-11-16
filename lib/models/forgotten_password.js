'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var utils = require('../utils');

var ForgottenPasswordSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  user: {
    type: ShortId
  },
  activationCode: {
    type: String
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

ForgottenPasswordSchema.path('activationCode').
default (function() {
  return utils.generator.generateShortCode();
});


ForgottenPasswordSchema.plugin(mongooseDelete);
ForgottenPasswordSchema.plugin(timestamps);

mongoose.model('ForgottenPassword', ForgottenPasswordSchema);

var ForgottenPassword = mongoose.model('ForgottenPassword');
BBPromise.promisifyAll(ForgottenPassword);
exports.name = 'ForgottenPassword';
exports.model = ForgottenPassword;
