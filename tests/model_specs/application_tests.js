'use strict';
var Application = require('../../lib').Application;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');
require('../bootstrap');
/*jshint -W030 */
describe('Application', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function(done){
    Application.remove({},function(){
      mongoose.disconnect(done);
    });
  });
  describe('on save', function () {
    var saved;
    before(function () {
      saved = new Application({
        organisation: 'orgid'
      }).saveQ();
    });
    it('should save ok', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('should not have modified date', function () {
      return saved.then(function (application) {
        expect(application.updatedAt).to.exist;
      });
    });
    it('should not have created date', function () {
      return saved.then(function (application) {
        expect(application.createdAt).to.exist;
      });
    });
    it('should have a short id', function () {
      return saved.then(function (application) {
        expect(application._id.length).to.eql(20);
      });
    });
  });
});
