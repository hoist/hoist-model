'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('mongoose-delete');

var ConnectorSetting = new Schema({
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
    required: 'users must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'users must belong to a valid environment'
    },
    required: 'users must belong to a valid environment'
  },
  connectorType: String,
  settings: {
    type: Schema.Types.Mixed
  }
});

ConnectorSetting.plugin(timestamps);
ConnectorSetting.plugin(mongooseDelete);

mongoose.model('ConnectorSetting', ConnectorSetting);

var ConnectorSetting = mongoose.model('ConnectorSetting');
BBPromise.promisifyAll(ConnectorSetting);
BBPromise.promisifyAll(ConnectorSetting.prototype);
exports.name = 'ConnectorSetting';
exports.model = ConnectorSetting;
