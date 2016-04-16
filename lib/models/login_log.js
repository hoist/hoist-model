'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.model = exports.name = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _errors = require('@hoist/errors');

var _errors2 = _interopRequireDefault(_errors);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginLogSchema = new _mongoose.Schema({
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

LoginLogSchema.statics.assertUser = function (_ref) {
  var emailAddresses = _ref.emailAddresses;
  var passwordResetDate = _ref.passwordResetDate;

  var windowStart = _moment2.default.utc().add(-2, 'minutes');
  if (passwordResetDate && windowStart.isBefore((0, _moment2.default)(passwordResetDate))) {
    windowStart = (0, _moment2.default)(passwordResetDate);
  }
  return this.countAsync({
    username: {
      $in: emailAddresses.map(function (_ref2) {
        var address = _ref2.address;
        return address.toLowerCase();
      })
    },
    success: false,
    createdAt: {
      $gt: windowStart
    }
  }).then(function (failedLogCount) {
    if (failedLogCount > 4) {
      throw new _errors2.default.user.request.AccountLockedError();
    }
    return true;
  });
};
LoginLogSchema.plugin(_mongooseTimestamp2.default);
LoginLogSchema.index({
  createdAt: -1
}, {
  background: true,
  sparse: true
});
var LoginLog = _mongoose2.default.model('LoginLog', LoginLogSchema);

_bluebird2.default.promisifyAll(LoginLog);
_bluebird2.default.promisifyAll(LoginLog.prototype);
var name = exports.name = 'LoginLog';
var model = exports.model = _mongoose2.default.model('LoginLog');
//# sourceMappingURL=login_log.js.map
