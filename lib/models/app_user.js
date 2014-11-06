'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var validator = require('validator');
var environments = ['live', 'test', 'dev'];
var mongooseDelete = require('mongoose-delete');

var AppUserSchema = new Schema({
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
  roles: {
    mainRole: {
      type: ShortId,
      ref: 'Role'
    },
    bucketRoles: [{
      role: {
        type: ShortId,
        ref: 'Role'
      },
      bucket: {
        type: ShortId,
        ref: 'Bucket'
      }
    }]
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

AppUserSchema.plugin(timestamps);
AppUserSchema.plugin(mongooseDelete);

mongoose.model('AppUser', AppUserSchema);

var AppUser = mongoose.model('AppUser');
BBPromise.promisifyAll(AppUser);
BBPromise.promisifyAll(AppUser.prototype);
exports.name = 'AppUser';
exports.model = AppUser;
