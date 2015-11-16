'use strict';
import mongoose, {
  Schema
}
from 'mongoose';
import ShortId from '@hoist/mongoose-shortid';
import Promise from 'bluebird';
import mongooseTimestamps from 'mongoose-timestamp';
import mongooseDelete from '@hoist/mongoose-delete';
import moment from 'moment';
import keygen from 'keygenerator';

let SessionSchema = new Schema({
  schemaVersion: String,
  user: {
    type: ShortId,
    ref: 'HoistUser',
    required: 'session must belong to a user'
  },
  organisation: {
    type: ShortId,
    ref: 'Organisation'
  },
  application: {
    type: ShortId,
    ref: 'Application'
  },
  key: {
    type: String,
    required: true,
    default: () => keygen._(),
  },
  isValid: {
    type: Boolean,
    default: true
  }
});

SessionSchema.plugin(mongooseTimestamps);
SessionSchema.plugin(mongooseDelete);
SessionSchema.index({
  updatedAt: -1
}, {
  background: true,
  sparse: true
});

mongoose.model('Session', SessionSchema);

let Session = mongoose.model('Session');
Promise.promisifyAll(Session);
Promise.promisifyAll(Session.prototype);
export const name = 'Session';
export const model = Session;
