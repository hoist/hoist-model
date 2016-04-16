'use strict';

var mongoose = require('mongoose');
var ShortId = require('@hoist/mongoose-shortid');
var Schema = mongoose.Schema;
var BBPromise = require('bluebird');
var timestamps = require('mongoose-timestamp');
var mongooseDelete = require('@hoist/mongoose-delete');

var environments = ['live', 'test', 'dev'];

var RoleSchema = new Schema({
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
    required: 'role must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'role must belong to a valid environment'
    },
    required: 'role must belong to a valid environment'
  },
  claims: [{
    type: String
  }]
});

RoleSchema.plugin(timestamps);
RoleSchema.plugin(mongooseDelete);

mongoose.model('Role', RoleSchema);

var Role = mongoose.model('Role');
BBPromise.promisifyAll(Role);
BBPromise.promisifyAll(Role.prototype);
exports.name = 'Role';
exports.model = Role;
//# sourceMappingURL=role.js.map
