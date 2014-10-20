'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var OrganisationSchema = new Schema({
  schemaVersion: String,
  name: {
    type: String
  },
  users: [{
    type: ShortId,
    ref: 'user',
  }],
  applications: [{
    type: ShortId,
    ref: 'application',
  }],
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  //path to the git folder for this orgs repositories
  gitRepoRoot: {
    type: String
  }
});

OrganisationSchema.plugin(timestamps);
mongoose.model('Organisation', OrganisationSchema);

var Organisation = mongoose.model('Organisation');
BBPromise.promisifyAll(Organisation);
BBPromise.promisifyAll(Organisation.prototype);
exports.name = 'Organisation';
exports.model = Organisation;
