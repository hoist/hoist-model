'use strict';
import mongoose, {
  Schema
}
from 'mongoose';
import moment from 'moment';
import Promise from 'bluebird';
import errors from '@hoist/errors';
import mongooseTimestamps from 'mongoose-timestamp';
let LoginLogSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  success: {
    type: Boolean,
    index: true
  }
}, {
  capped: 314572800
});

LoginLogSchema.statics.assertUser = function ({
  emailAddresses,
  passwordResetDate
}) {
  let windowStart = moment.utc().add(-2, 'minutes');
  if (passwordResetDate && windowStart.isBefore(moment(passwordResetDate))) {
    windowStart = moment(passwordResetDate);
  }
  return this.countAsync({
    username: {
      $in: emailAddresses.map(({
        address
      }) => address.toLowerCase())
    },
    success: false,
    createdAt: {
      $gt: windowStart
    }
  }).then((failedLogCount) => {
    if (failedLogCount > 4) {
      throw new errors.user.request.AccountLockedError();
    }
    return true;
  });
};
LoginLogSchema.plugin(mongooseTimestamps);
LoginLogSchema.index({
  createdAt: -1
}, {
  background: true,
  sparse: true
});
let LoginLog = mongoose.model('LoginLog', LoginLogSchema);


Promise.promisifyAll(LoginLog);
Promise.promisifyAll(LoginLog.prototype);
export const name = 'LoginLog';
export const model = mongoose.model('LoginLog');
