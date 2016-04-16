'use strict';

var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var mongooseDelete = require('@hoist/mongoose-delete');
var keygen = require('keygenerator');

var HoistInviteSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  displayName: {
    type: String,
    required: 'Must have a user name'
  },
  existingUserId: {
    type: ShortId,
    default: null
  },
  emailAddress: {
    type: String,
    required: 'Must have an email address'
  },
  organisation: {
    type: ShortId,
    required: 'Must have an organisation'
  },
  inviteCode: {
    type: String,
    index: true,
    required: 'Must have an invite code',
    unique: true,
    default: function _default() {
      return keygen._();
    }
  },
  activatedDate: {
    type: Date,
    default: null
  },
  activated: {
    type: Boolean,
    default: false
  }
});

HoistInviteSchema.plugin(mongooseDelete);
HoistInviteSchema.plugin(timestamps);

mongoose.model('HoistInvite', HoistInviteSchema);

var HoistInvite = mongoose.model('HoistInvite');
BBPromise.promisifyAll(HoistInvite);
BBPromise.promisifyAll(HoistInvite.prototype);
exports.name = 'HoistInvite';
exports.model = HoistInvite;
//# sourceMappingURL=hoist_invite.js.map
