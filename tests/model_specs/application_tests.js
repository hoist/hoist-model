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
  describe('on save', function () {
    var saved;
    before(function () {
      saved = new Application({
        organisation: 'orgid'
      }).saveAsync();
    });
    it('doesn\'t default deployment date', function () {
      return saved.then(function (applicaiton) {
        expect(applicaiton.lastDeploy.dev)
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
    it('sets a short id', function () {
      return saved.then(function (application) {
        expect(application._id.length).to.eql(20);
      });
    });
  });
});
