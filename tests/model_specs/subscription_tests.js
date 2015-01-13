'use strict';
require('../bootstrap');
var Subscription = require('../../lib').Subscription;
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
    Subscription.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
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

});