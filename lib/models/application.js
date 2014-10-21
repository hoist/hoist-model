'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var ApplicationSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  organisation: {
    type: ShortId,
    required: 'Application must belong to an Organisation',
    index: true,
    ref: 'organisation'
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
    index: true,
    required: true,
    default: function () {
      return require('moniker').choose();
    }
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
  //when was the code last released
  lastDeploy: {
    dev: {
      type: Date
    },
    test: {
      type: Date
    },
    live: {
      type: Date
    }
  },
  //should this application get preview features
  isCanary: {
    type: Boolean,
    default: false
  },
  //path to the git repository
  gitRepo: {
    type: String,
    index: true
  }

});

ApplicationSchema.plugin(timestamps);
mongoose.model('Application', ApplicationSchema);

var Application = mongoose.model('Application');
BBPromise.promisifyAll(Application);
BBPromise.promisifyAll(Application.prototype);
exports.name = 'Application';
exports.model = Application;
