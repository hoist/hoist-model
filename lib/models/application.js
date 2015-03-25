'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var mongooseDelete = require('mongoose-delete');
var keygen = require('keygenerator');

var Schema = mongoose.Schema;
var ApplicationSchema = new Schema({
  schemaVersion: String,
  //the org that owns this application
  organisation: {
    type: ShortId,
    required: 'Application must belong to an Organisation',
    index: true,
    ref: 'Organisation'
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
  runscope: {
    _id: false,
    bucket: String,
  },
  loggly: {
    _id: false,
    token: String,
    subdomain: String
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
    type: String,
    unique: true,
    index: true,
    required: true,
    default: function () {
      return keygen._();
    }
  },
  //the storage for data
  dataKey: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return keygen._({
        forceLowercase: true
      });
    }
  },
  //anonymous

  anonymousPermissions: {
    dev: [{
      type: String
    }],
    test: [{
      type: String
    }],
    live: [{
      type: String
    }]
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
  //information about the commit
  lastCommit: {
    live: {
      message: String,
      sha1: String,
      user: String
    }
  },
  //should this application get preview features
  isCanary: {
    type: Boolean,
    default: false
  },
  //path to the git repository
  slug: {
    type: String,
    index: true
  },
  //should the applicaiton have split queues for executors
  //eventually everything will be true but for now we need to turn it
  //on one application at a time
  splitQueue: {
    type: Boolean,
    default: false
  },
  maxExecutors: {
    type: Number,
    index: true,
    default: 1
  },
  currentExecutors: {
    type: Number,
    index: true,
    default: 0
  }
}, {
  read: 'nearest'
});

ApplicationSchema.plugin(timestamps);
ApplicationSchema.plugin(mongooseDelete);
ApplicationSchema.set('toJSON', {
  virtuals: true
});
ApplicationSchema.virtual('gitRepo').get(function () {
  return this.slug;
}).set(function (value) {
  this.slug = value;
});


mongoose.model('Application', ApplicationSchema);

var Application = mongoose.model('Application');
BBPromise.promisifyAll(Application);
BBPromise.promisifyAll(Application.prototype);
exports.name = 'Application';
exports.model = Application;
