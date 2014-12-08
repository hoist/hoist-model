'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;
var OrganisationSchema = new Schema({
  schemaVersion: String,
  name: {
    type: String,
    required: 'Organisation must have a name'
  },
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  //path to the git folder for this orgs repositories
  slug: {
    type: String,
    index: true,
    unique: true,
    required: 'Organisation must have a slug'
  },
  personal: {
    type: Boolean,
    required: true,
    default: false
  }
});

OrganisationSchema.plugin(timestamps);
OrganisationSchema.plugin(mongooseDelete);
OrganisationSchema.virtual('gitFolder').get(function () {
  return this.slug;
}).set(function (value) {
  this.slug = value;
});
mongoose.model('Organisation', OrganisationSchema);

var Organisation = mongoose.model('Organisation');
BBPromise.promisifyAll(Organisation);
BBPromise.promisifyAll(Organisation.prototype);
exports.name = 'Organisation';
exports.model = Organisation;
