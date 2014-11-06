'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;
var BBPromise = require('bluebird');
var timestamps = require('mongoose-timestamp');
var mongooseDelete = require('mongoose-delete');
var environments = ['live', 'test', 'dev'];

var SessionSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  application: {
    type: ShortId,
    ref: 'Application',
    required: 'session must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'session must belong to a valid environment'
    },
    required: 'session must belong to a valid environment'
  },
  appUser: {
    type: ShortId,
    ref: 'AppUser'
  }
});

SessionSchema.plugin(timestamps);
SessionSchema.plugin(mongooseDelete);

mongoose.model('Session', SessionSchema);

var Session = mongoose.model('Session');
BBPromise.promisifyAll(Session);
BBPromise.promisifyAll(Session.prototype);
exports.name = 'Session';
exports.model = Session;
