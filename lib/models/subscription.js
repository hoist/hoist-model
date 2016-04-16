'use strict';

var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var environments = ['live', 'test', 'dev'];
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('@hoist/mongoose-delete');

var SubscriptionSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  connector: { //key
    type: String,
    index: true,
    required: 'subscriptions must belong to a connector'
  },
  active: {
    type: Boolean,
    default: false
  },
  endpoints: [String],
  application: {
    type: ShortId,
    ref: 'Application',
    index: true,
    required: 'subscriptions must belong to an application'
  },
  meta: {
    type: Schema.Types.Mixed
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'subscriptions must belong to a valid environment'
    },
    required: 'subscriptions must belong to a valid environment'
  },
  nextPoll: {
    type: Date
  }
});

SubscriptionSchema.plugin(mongooseDelete);
SubscriptionSchema.plugin(timestamps);
SubscriptionSchema.index({
  connector: 1,
  application: 1,
  environment: 1
}, {
  unique: true
});
SubscriptionSchema.index({
  active: 1,
  nextPoll: 1
}, {
  sparse: true,
  unique: false
});
mongoose.model('Subscription', SubscriptionSchema);

var Subscription = mongoose.model('Subscription');
BBPromise.promisifyAll(Subscription);
BBPromise.promisifyAll(Subscription.prototype);
exports.name = 'Subscription';
exports.model = Subscription;
//# sourceMappingURL=subscription.js.map
