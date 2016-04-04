'use strict';
require('../bootstrap');
var Model = require('../../src');
var expect = require('chai').expect;
var mongoose = Model._mongoose;
var config = require('config');
var dbUri = config.get('Hoist.mongo.db');
describe('ConnectorSetting', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Model.ConnectorSetting.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('saving setting with same key but different org', function () {
    var saved;
    before(function () {
      var setting1 = new Model.ConnectorSetting({
        name: 'connector 1',
        application: 'appid',
        key: 'key',
        environment: 'live'
      });
      var setting2 = new Model.ConnectorSetting({
        name: 'connector 2',
        application: 'appid2',
        key: 'key',
        environment: 'live'
      });
      var setting3 = new Model.ConnectorSetting({
        name: 'connector 3',
        application: 'appid2',
        key: 'key',
        environment: 'dev'
      });
      return (saved = setting1.saveAsync().then(function () {
        return setting2.saveAsync().then(function () {
          return setting3.saveAsync();
        });
      }));
    });
    it('should save correctly', function () {
      return expect(saved).to.be.fulfilled;
    });
    after(function () {
      return Model.ConnectorSetting.removeAsync({});
    });
  });
});
