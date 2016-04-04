'use strict';
require('../bootstrap');
var Model = require('../../lib');
var expect = require('chai').expect;
var mongoose = Model._mongoose;
var config = require('config');
var dbUri = config.get('Hoist.mongo.db');
describe('Bucket', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Model.Bucket.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('saving setting with same key but different org', function () {
    var saved;
    process.on('uncaughtException', function (err) {
      console.log('Caught exception: ' + err);
    });
    before(function () {
      var setting1 = new Model.Bucket({
        application: 'appid',
        key: 'key',
        environment: 'live'
      });
      var setting2 = new Model.Bucket({
        application: 'appid2',
        key: 'key',
        environment: 'live'
      });
      var setting3 = new Model.Bucket({
        application: 'appid2',
        key: 'key',
        environment: 'dev'
      });
      try {
        return setting1.saveAsync().then(function () {
          return setting2.saveAsync().then(function () {
            return setting3.saveAsync();
          });
        }).then(function () {
          saved = true;
        });
      } catch (err) {
        console.log('err');
      }
    });
    it('should save correctly', function () {
      return expect(saved).to.eql(true);
    });
    after(function () {
      return Model.Bucket.removeAsync({});
    });
  });
});
