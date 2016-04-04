'use strict';
require('../bootstrap');
var Organisation = require('../../lib').Organisation;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');
/*jshint -W030 */
describe('Organisation', function () {
  before(function (done) {

    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Organisation.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('on save', function () {
    var saved;
    before(function () {
      var options = {
        name: 'test name',
        gitFolder: 'git folder'
      };
      saved = new Organisation(options).saveAsync();
    });
    it('should save ok', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('should not have modified date', function () {
      return saved.then(function (organisation) {
        expect(organisation.updatedAt).to.exist;
      });
    });
    it('should not have created date', function () {
      return saved.then(function (organisation) {
        expect(organisation.createdAt).to.exist;
      });
    });
    it('should have a short id', function () {
      return saved.then(function (organisation) {
        expect(organisation._id.length).to.eql(20);
      });
    });
    it('has gitFolder property', function () {
      return saved.then(function (organisation) {
        organisation.slug = 'org_slug';
        expect(organisation.gitFolder).to.eql('org_slug');
      });
    });
    it('links gitFolder to slug', function () {
      return saved.then(function (organisation) {
        organisation.gitFolder = 'org_slug_2';
        expect(organisation.slug).to.eql('org_slug_2');
      });
    });
    it('should have a personal attribute set to false', function () {
      return saved.then(function (organisation) {
        expect(organisation.personal).to.eql(false);
      });
    });
  });
});
