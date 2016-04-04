import mongoose, {
  Schema
}
from 'mongoose';
import Promise from 'bluebird';
import moment from 'moment';
import errors from '@hoist/errors';
import mongooseTimestamps from 'mongoose-timestamp';

var IpLogSchema = new Schema({
  ip: {
    type: String,
    index: true
  },
  success: {
    type: Boolean,
    default: false
  }
}, {
  capped: 314572800
});
IpLogSchema.statics.assertIP = function ({
  ipAddress
}) {
  return this.countAsync({
    ip: ipAddress,
    success: false,
    createdAt: {
      $gt: moment.utc().add(-2, 'minutes').toDate()
    },
  }).then(function (logs) {
    if (logs > 9) {
      throw new errors.user.request.IPLockedError();
    }
    return true;
  });
}
IpLogSchema.plugin(mongooseTimestamps);
IpLogSchema.index({
  createdAt: -1
}, {
  background: true,
  sparse: true
});
let IpLog = mongoose.model('IpLog', IpLogSchema);
Promise.promisifyAll(IpLog);
Promise.promisifyAll(IpLog.prototype);
export const name = 'IpLog';
export const model = mongoose.model('IpLog');
