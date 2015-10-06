'use strict';
var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('@hoist/mongoose-delete');
var keygen = require('keygenerator');
var BouncerTokenSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  application: {
    type: ShortId,
    ref: 'Application',
    index: true,
    required: 'bouncer tokens must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'bouncer tokens must belong to a valid environment'
    },
    required: 'bouncer tokens must belong to a valid environment'
  },
  saveTo: String,
  saveId: String,
  returnUrl: String,
  connectorKey: String,
  connectorType: String,
  displayProperties: [
    {
       _id: false,
      name: String, 
      value: String
    }
  ],
  state: {
    type: Schema.Types.Mixed,
    default: function () {
      return {};
    }
  },
  key: {
    type: String,
    required: true,
    default: function () {
      return keygen._();
    },
    unique: true
  }
});

BouncerTokenSchema.plugin(timestamps);
BouncerTokenSchema.plugin(mongooseDelete);
mongoose.model('BouncerToken', BouncerTokenSchema);

var BouncerToken = mongoose.model('BouncerToken');
BBPromise.promisifyAll(BouncerToken);
BBPromise.promisifyAll(BouncerToken.prototype);
exports.name = 'BouncerToken';
exports.model = BouncerToken;
