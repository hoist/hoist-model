'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.model = exports.name = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _errors = require('@hoist/errors');

var _errors2 = _interopRequireDefault(_errors);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IpLogSchema = new _mongoose.Schema({
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
IpLogSchema.statics.assertIP = function (_ref) {
  var ipAddress = _ref.ipAddress;

  return this.countAsync({
    ip: ipAddress,
    success: false,
    createdAt: {
      $gt: _moment2.default.utc().add(-2, 'minutes').toDate()
    }
  }).then(function (logs) {
    if (logs > 9) {
      throw new _errors2.default.user.request.IPLockedError();
    }
    return true;
  });
};
IpLogSchema.plugin(_mongooseTimestamp2.default);
IpLogSchema.index({
  createdAt: -1
}, {
  background: true,
  sparse: true
});
var IpLog = _mongoose2.default.model('IpLog', IpLogSchema);
_bluebird2.default.promisifyAll(IpLog);
_bluebird2.default.promisifyAll(IpLog.prototype);
var name = exports.name = 'IpLog';
var model = exports.model = _mongoose2.default.model('IpLog');
//# sourceMappingURL=ip_log.js.map
