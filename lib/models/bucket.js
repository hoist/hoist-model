'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var Schema = mongoose.Schema;
var BBPromise = require('bluebird');
var timestamps = require('mongoose-timestamp');
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('mongoose-delete');

var BucketSchema = new Schema({
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
    required: 'bucket must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'bucket must belong to a valid environment'
    },
    required: 'bucket must belong to a valid environment'
  },
  meta: {
    type: Schema.Types.Mixed
  }
});

BucketSchema.plugin(timestamps);
BucketSchema.plugin(mongooseDelete);

mongoose.model('Bucket', BucketSchema);

var Bucket = mongoose.model('Bucket');
BBPromise.promisifyAll(Bucket);
BBPromise.promisifyAll(Bucket.prototype);
exports.name = 'Bucket';
exports.model = Bucket;
