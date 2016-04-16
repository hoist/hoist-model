'use strict';

var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var environments = ['live', 'test', 'dev'];
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('@hoist/mongoose-delete');
var keygen = require('keygenerator');

var EventTokenSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  lastUsed: {
    type: Date,
    default: Date.now()
  },
  code: {
    type: String,
    index: true,
    required: 'Must have a code',
    unique: true,
    default: function _default() {
      return keygen._();
    }
  },
  application: {
    type: ShortId,
    ref: 'Application',
    index: true,
    required: 'event tokens must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'event tokens must belong to a valid environment'
    },
    required: 'event tokens must belong to a valid environment'
  }
});

EventTokenSchema.plugin(mongooseDelete);
EventTokenSchema.plugin(timestamps);

mongoose.model('EventToken', EventTokenSchema);

var EventToken = mongoose.model('EventToken');
BBPromise.promisifyAll(EventToken);
BBPromise.promisifyAll(EventToken.prototype);
exports.name = 'EventToken';
exports.model = EventToken;
//# sourceMappingURL=event_token.js.map
