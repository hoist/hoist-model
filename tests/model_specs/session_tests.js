'use strict';
require('../bootstrap');
var Session = require('../../lib').Session;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');
/*jshint -W030 */
describe('Session', function () {
  before(function (done) {

    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Session.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('on save', function () {
    var saved;
    before(function () {
      saved = new Session({
        application: 'appid',
        environment: 'live'
      }).saveAsync();
    });
    it('should save ok', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('should not have modified date', function () {
      return saved.then(function (session) {
        expect(session.updatedAt).to.exist;
      });
    });
    it('should not have created date', function () {
      return saved.then(function (session) {
        expect(session.createdAt).to.exist;
      });
    });
    it('should have a short id', function () {
      return saved.then(function (session) {
        expect(session._id.length).to.eql(20);
      });
    });
  });
});
