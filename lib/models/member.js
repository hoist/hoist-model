'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var validator = require('validator');
var environments = ['live', 'test', 'dev'];

var MemberSchema = new Schema({
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
    ref: 'application',
    required: 'members must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'members must belong to a valid environment'
    },
    required: 'members must belong to a valid environment'
  },
  emailAddresses: [{
    address: {
      type: String,
      index: true,
      required: 'email address is required',
      validate: [
        function (email) {
          return validator.isEmail(email);
        }, 'the email address {VALUE} is not valid'
      ]
    },
    verified: {
      type: Boolean
    }
  }]
});

MemberSchema.plugin(timestamps);

mongoose.model('Member', MemberSchema);

var Member = mongoose.model('Member');
BBPromise.promisifyAll(Member);
BBPromise.promisifyAll(Member.prototype);
exports.name = 'Member';
exports.model = Member;