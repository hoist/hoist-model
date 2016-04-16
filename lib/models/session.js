'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.model = exports.name = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseShortid = require('@hoist/mongoose-shortid');

var _mongooseShortid2 = _interopRequireDefault(_mongooseShortid);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _mongooseDelete = require('@hoist/mongoose-delete');

var _mongooseDelete2 = _interopRequireDefault(_mongooseDelete);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _keygenerator = require('keygenerator');

var _keygenerator2 = _interopRequireDefault(_keygenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SessionSchema = new _mongoose.Schema({
  schemaVersion: String,
  user: {
    type: _mongooseShortid2.default,
    ref: 'HoistUser',
    required: 'session must belong to a user'
  },
  organisation: {
    type: _mongooseShortid2.default,
    ref: 'Organisation'
  },
  application: {
    type: _mongooseShortid2.default,
    ref: 'Application'
  },
  key: {
    type: String,
    required: true,
    default: function _default() {
      return _keygenerator2.default._();
    }
  },
  isValid: {
    type: Boolean,
    default: true
  }
});

SessionSchema.plugin(_mongooseTimestamp2.default);
SessionSchema.plugin(_mongooseDelete2.default);
SessionSchema.index({
  updatedAt: -1
}, {
  background: true,
  sparse: true
});

_mongoose2.default.model('Session', SessionSchema);

var Session = _mongoose2.default.model('Session');
_bluebird2.default.promisifyAll(Session);
_bluebird2.default.promisifyAll(Session.prototype);
var name = exports.name = 'Session';
var model = exports.model = Session;
//# sourceMappingURL=session.js.map
