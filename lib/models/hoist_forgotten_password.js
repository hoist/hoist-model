'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var HoistUser = require('./hoist_user.js');
var keygen = require('keygenerator');

var HoistForgottenPasswordSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  user: {
    type: ShortId,
    ref: HoistUser,
    required: true
  },
  activationCode: {
    type: String,
    index: true,
    required: true,
    unique: true,
    default: keygen._()
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

HoistForgottenPasswordSchema.plugin(mongooseDelete);
HoistForgottenPasswordSchema.plugin(timestamps);

mongoose.model('HoistForgottenPassword', HoistForgottenPasswordSchema);

var HoistForgottenPassword = mongoose.model('HoistForgottenPassword');
BBPromise.promisifyAll(HoistForgottenPassword);
BBPromise.promisifyAll(HoistForgottenPassword.prototype);
exports.name = 'HoistForgottenPassword';
exports.model = HoistForgottenPassword;
