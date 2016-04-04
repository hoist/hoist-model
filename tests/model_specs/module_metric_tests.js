'use strict';
require('../bootstrap');
var ModuleMetric = require('../../src').ModuleMetric;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');
var moment = require('moment');
describe('ModuleMetric', function () {
  before(function (done) {
    mongoose.set('debug', true);
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    ModuleMetric.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  afterEach(function (done) {
    ModuleMetric.remove({}, done);
  });
  describe('updating a stat', function () {
    var statDate = moment().startOf('hour').add('m', 23);
    before(function () {
      var existingMetricDocument = new ModuleMetric({
        application: 'app',
        environment: 'live',
        moduleName: 'random_module_name',
        timestampHour: statDate.clone().utc().startOf('hour').toDate()
      });
      return existingMetricDocument.saveAsync().then(function () {
        var update = {
          $inc: {

          }
        };
        update.$inc['executions.' + statDate.utc().minutes()] = 1;
        update.$inc['failures.' + statDate.utc().minutes()] = 1;
        update.$inc['timeouts.' + statDate.utc().minutes()] = 1;
        return ModuleMetric.updateAsync({
          application: 'app',
          environment: 'live',
          moduleName: 'random_module_name',
          timestampHour: statDate.utc().startOf('hour').toDate()
        }, update);
      });
    });
    it('updates all values', function () {
      return ModuleMetric.findOneAsync()
        .then(function (metric) {
          expect(metric.failures['23']).to.eql(1);
          expect(metric.executions['23']).to.eql(1);
          expect(metric.failures['23']).to.eql(1);
        });
    });
  });
  describe('creating a stat', function () {
    var statDate = moment().startOf('hour').add('m', 26);
    before(function () {

      var update = {
        $inc: {

        }
      };
      update.$inc['executions.' + statDate.utc().minutes()] = 1;
      update.$inc['failures.' + statDate.utc().minutes()] = 1;
      update.$inc['timeouts.' + statDate.utc().minutes()] = 1;
      return ModuleMetric.updateAsync({
        application: 'app',
        environment: 'live',
        moduleName: 'random_module_name',
        timestampHour: statDate.clone().utc().startOf('hour').toDate()
      }, update, {
        upsert: true
      });
    });
    it('updates all values', function () {
      return ModuleMetric.findOneAsync()
        .then(function (metric) {
          expect(metric.failures['26']).to.eql(1);
          expect(metric.executions['26']).to.eql(1);
          expect(metric.failures['26']).to.eql(1);
        });
    });
  });
});
