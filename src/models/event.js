'use strict';
var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('@hoist/mongoose-delete');
var EventSchema = new Schema({
  schemaVersion: String,
  applicationId: {
    type: ShortId,
    ref: 'Application',
    index: true,
    required: 'events must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'events must belong to a valid environment'
    },
    required: 'events must belong to a valid environment'
  },
  payload: {
    type: Schema.Types.Mixed,
    default: function () {
      return {};
    }
  },
  priority: {
    type: Number,
    default: 3
  },
  eventId: String,
  eventName: String,
  correlationId: String,
  bucketId: {
    type: ShortId,
    ref: 'Bucket'
  },
  synchronous: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: ShortId,
    ref: 'Session'
  }
}, {
  read: 'nearest'
});

EventSchema.plugin(timestamps);
EventSchema.plugin(mongooseDelete);

EventSchema.index({
  applicationId: 1,
  eventId: 1
}, {
  unique: true
});

EventSchema.path('createdAt').index({
  expires: 604800
});
mongoose.model('Event', EventSchema);

var Event = mongoose.model('Event');
BBPromise.promisifyAll(Event);
BBPromise.promisifyAll(Event.prototype);
exports.name = 'Event';
exports.model = Event;
