'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('mongoose-delete');
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
    required: 'connectors must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'connectors must belong to a valid environment'
    },
    required: 'connectors must belong to a valid environment'
  },
  name: {
    type: String,
    required: 'connector must have a name'
  },
  connectorType: String,
  settings: {
    type: Schema.Types.Mixed
  },
  key: {
    type: String,
    required: true,
    default: function () {
      return keygen._();
    }
  }
});

BouncerTokenSchema.plugin(timestamps);
BouncerTokenSchema.plugin(mongooseDelete);
BouncerTokenSchema.index({
  key: 1,
  application: 1,
  environment: 1
}, {
  unique: true
});
mongoose.model('BouncerToken', BouncerTokenSchema);

var BouncerToken = mongoose.model('BouncerTokenSchema');
BBPromise.promisifyAll(BouncerToken);
BBPromise.promisifyAll(BouncerToken.prototype);
exports.name = 'BouncerToken';
exports.model = BouncerToken;
