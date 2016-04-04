'use strict';
require('../bootstrap');
var Subscription = require('../../src').Subscription;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

describe('Subscription', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    mongoose.disconnect(function () {
      delete mongoose.connection.db;
      done();
    });
  });
  describe('validation', function () {
    var subscription;
    before(function () {
      subscription = new Subscription({
        application: 'appid',
        environment: 'live',
        endpoints: '/contacts',
        connector: 'connectorID'
      });
    });
    after(function () {
      return Subscription.removeAsync({});
    });
    describe('save', function () {
      var saved;
      before(function () {
        saved = subscription.saveAsync();
      });
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id', function () {
        return expect(saved.then(function (subscription) {
          return subscription._id.length;
        })).to.become(20);
      });
    });
    describe('application', function () {
      afterEach(function () {
        subscription.application = 'appid';
      });
      it('is required', function () {
        subscription.application = null;
        return subscription.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.application).to.exist;
          expect(err.errors.application.message).to.eql('subscriptions must belong to an application');
        });
      });
    });
    describe('environment', function () {
      afterEach(function () {
        subscription.environment = 'live';
      });
      it('is required', function () {
        subscription.environment = null;
        return subscription.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('subscriptions must belong to a valid environment');
        });
      });
      it('it must be a valid environment', function () {
        subscription.environment = 'random';
        return subscription.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('subscriptions must belong to a valid environment');
        });
      });
    });
    describe('connector', function () {
      afterEach(function () {
        subscription.connector = 'connectorID';
      });
      it('is required', function () {
        subscription.connector = null;
        return subscription.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.connector).to.exist;
          expect(err.errors.connector.message).to.eql('subscriptions must belong to a connector');
        });
      });
    });
  });

  describe('saving with same connector but different app or env', function () {
    var saved;
    before(function () {
      var subscription1 = new Subscription({
        name: 'connector 1',
        application: 'appid',
        connector: 'key',
        environment: 'live'
      });
      var subscription2 = new Subscription({
        name: 'connector 2',
        application: 'appid2',
        connector: 'key',
        environment: 'live'
      });
      var subscription3 = new Subscription({
        name: 'connector 3',
        application: 'appid2',
        connector: 'key',
        environment: 'dev'
      });
      return (saved = subscription1.saveAsync().then(function () {
        return subscription2.saveAsync().then(function () {
          return subscription3.saveAsync();
        });
      }));
    });
    it('should save correctly', function () {
      return expect(saved).to.be.fulfilled;
    });
    after(function () {
      return Subscription.removeAsync({});
    });
  });

});
