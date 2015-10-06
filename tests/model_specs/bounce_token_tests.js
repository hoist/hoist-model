'use strict';
require('../bootstrap');
var Model = require('../../lib');
var expect = require('chai').expect;
var mongoose = Model._mongoose;
var config = require('config');
var dbUri = config.get('Hoist.mongo.db');
describe('BouncerToken', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Model.BouncerToken.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('save token with display properties', function () {
    var saved, token;
    before(function () {
      token = new Model.BouncerToken({
        application: 'appid',
        environment: 'live',
        displayProperties: [
          {
            name: 'Application Name',
            value: 'Hoist Apps Limited'
          }
        ]
      });
      return (saved = token.saveAsync());
    });
    it('should save correctly', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('should save display properties', function () {
      return expect(token.displayProperties[0]).to.have.property('name')
        .that.is.a('string');
    });
    after(function () {
      return Model.BouncerToken.removeAsync({});
    });
  });
  describe('save token without display properties', function () {
    var saved, token;
    before(function () {
      token = new Model.BouncerToken({
        application: 'appid',
        environment: 'live'
      });
      return (saved = token.saveAsync());
    });
    it('should save correctly', function () {
      return expect(saved).to.be.fulfilled;
    });
    it('should have an empty display properties array', function () {
      return expect(token).to.have.property('displayProperties')
         .to.have.length(0);
    });
    after(function () {
      return Model.BouncerToken.removeAsync({});
    });
  });
});
