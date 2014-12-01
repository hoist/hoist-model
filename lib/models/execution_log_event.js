'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;
var BBPromise = require('bluebird');
var timestamps = require('mongoose-timestamp');
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('mongoose-delete');

var ExecutionLogEvent = new Schema({
  schemaVersion: String,
  //the org that owns this application
  application: {
    type: ShortId,
    ref: 'Application',
    required: 'ExecutionLogEvent must belong to an application',
    index: true
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'ExecutionLogEvent must belong to a valid environment'
    },
    required: 'ExecutionLogEvent must belong to a valid environment',
    index:true
  },
  moduleName: {
    type: String,
    index: true
  },
  eventId: {
    type: String,
    index: true
  },
  correlationId: {
    type: String,
    index: true
  },
  error: Boolean,
  message: String,
  errorStack: [String]
});

ExecutionLogEvent.plugin(timestamps);
ExecutionLogEvent.plugin(mongooseDelete);

ExecutionLogEvent.path('createdAt').index(true);

mongoose.model('ExecutionLogEvent', ExecutionLogEvent);

var ExecutionLogEvent = mongoose.model('ExecutionLogEvent');
BBPromise.promisifyAll(ExecutionLogEvent);
BBPromise.promisifyAll(ExecutionLogEvent.prototype);
exports.name = 'ExecutionLogEvent';
exports.model = ExecutionLogEvent;
