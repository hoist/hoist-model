'use strict';
require('../bootstrap');
var Application = require('../../lib').Application;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

/*jshint -W030 */
describe('Application', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Application.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  afterEach(function (done) {
      Application.remove({}, done);
    });
  describe('on save', function () {
    var saved;
    before(function () {
      saved = new Application({
        organisation: 'orgid'
      }).saveAsync();
    });

    it('doesn\'t default deployment date', function () {
      return saved.then(function (application) {
        expect(application.lastDeploy.dev)
          .to.not.exist;
      });
    });
    it('saves', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('sets modified date', function () {
      return saved.then(function (application) {
        expect(application.updatedAt).to.exist;
      });
    });
    it('sets created date', function () {
      return saved.then(function (application) {
        expect(application.createdAt).to.exist;
      });
    });
    it('sets data key', function () {
      return saved.then(function (application) {
        expect(application.dataKey).to.exist;
        expect(application.dataKey.toLowerCase()).to.eql(application.dataKey);
      });
    });
    it('sets api key', function () {
      return saved.then(function (application) {
        expect(application.apiKey).to.exist;
      });
    });
    it('sets a short id', function () {
      return saved.then(function (application) {
        expect(application._id.length).to.eql(20);
      });
    });
  });
  describe('on delete', function () {
    var deleted;
    before(function () {
      deleted = new Application({
        organisation: 'orgid'
      }).saveAsync().then(function (application) {
        return application.deleteAsync();
      });
    });

    it('soft deletes', function () {
      return deleted.then(function () {
        return Application.findAsync({});
      }).then(function (applications) {
        expect(applications.length).to.eql(1);
        expect(applications[0].deleted).to.eql(true);
      });
    });
  });
});
