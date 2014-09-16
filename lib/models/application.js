'use strict';
var mongoose = require('mongoose-q')(require('mongoose'));
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var ApplicationSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  organisation: {
    type: ShortId,
    required: 'Application must belong to an Organisation',
    index: true,
    ref:'organisation'
  },
  //friendly name
  name: {
    type: String
  },
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  //url alias
  alias: {
    type: [String],
    index: true
  },

  //the app.hoi.io sub domain for hosting
  subDomain: {
    type: String,
    unique: true,
    index: true
  },

  //api key
  apiKey: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20,
    unique: true,
    index: true
  },
  //settings from the hoist.json files
  settings: {
    dev: {
      type: Schema.Types.Mixed
    },
    test: {
      type: Schema.Types.Mixed
    },
    live: {
      type: Schema.Types.Mixed
    },
  },
  //should this application get preview features
  isCanary: {
    type: Boolean,
    default: false
  }

});

ApplicationSchema.plugin(timestamps);
mongoose.model('Application', ApplicationSchema);
exports.name = 'Application';
exports.model = mongoose.model('Application');
