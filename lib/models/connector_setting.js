'use strict';
var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('@hoist/mongoose-delete');
var keygen = require('keygenerator');
var ConnectorSettingSchema = new Schema({
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
    index: true,
    required: 'connectors must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'connectors must belong to a valid environment'
    },
    required: 'connectors must belong to a valid environment'
  },
  name: {
    type: String,
    required: 'connector must have a name'
  },
  connectorType: String,
  settings: {
    type: Schema.Types.Mixed
  },
  subscribedEvents: {
    type: [String],
    required: false,
    default: function () {
      return [];
    }
  },
  isOneClickConnector: Boolean,
  key: {
    type: String,
    required: true,
    default: function () {
      return keygen._();
    }
  },
  defaultKey: {
    type: String
  }
});

ConnectorSettingSchema.plugin(timestamps);
ConnectorSettingSchema.plugin(mongooseDelete);
ConnectorSettingSchema.index({
  key: 1,
  application: 1,
  environment: 1
}, {
  unique: true
});
mongoose.model('ConnectorSetting', ConnectorSettingSchema);

var ConnectorSetting = mongoose.model('ConnectorSetting');
BBPromise.promisifyAll(ConnectorSetting);
BBPromise.promisifyAll(ConnectorSetting.prototype);
exports.name = 'ConnectorSetting';
exports.model = ConnectorSetting;
