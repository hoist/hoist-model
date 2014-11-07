'use strict';
require('../bootstrap');
var AppUser = require('../../lib').AppUser;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

describe('AppUser', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    AppUser.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('validation', function () {
    var appUser;
    before(function () {
      appUser = new AppUser({
        application: 'appid',
        environment: 'live'
      });
    });
    describe('save', function () {
      var saved;
      before(function () {
        saved = appUser.saveAsync();
      });
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id', function () {
        return expect(saved.then(function (appUser) {
          return appUser._id.length;
        })).to.become(20);
      });
    });
    describe('application', function () {
      afterEach(function () {
        appUser.application = 'appid';
      });
      it('is required', function () {
        appUser.application = null;
        return appUser.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.application).to.exist;
          expect(err.errors.application.message).to.eql('users must belong to an application');
        });
      });
    });
    describe('environment', function () {
      afterEach(function () {
        appUser.environment = 'live';
      });
      it('is required', function () {
        appUser.environment = null;
        return appUser.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('users must belong to a valid environment');
        });
      });
      it('it must be a valid environment', function () {
        appUser.environment = 'random';
        return appUser.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('users must belong to a valid environment');
        });
      });
    });
    describe('email', function () {
      beforeEach(function () {
        appUser.emailAddresses = [];
      });
      afterEach(function () {
        appUser.emailAddresses = [];
      });
      it('allows valid email', function () {
        appUser.emailAddresses.push({
          address: 'test@hoi.io'
        });
        return expect(appUser.validateAsync()).to.be.fulfilled;
      });
      it('has no id',function(){
        appUser.emailAddresses.push({
          address:'test@hoi.io'
        });
        return expect(appUser.emailAddresses[0]._id).to.not.exist;
      });
      it('rejects invalid email', function () {
        appUser.emailAddresses.push({
          address: '3'
        });
        return appUser.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors['emailAddresses.0.address']).to.exist;
          expect(err.errors['emailAddresses.0.address'].message).to.eql('the email address 3 is not valid');
        });

      });
      it('rejects blank email', function () {
        appUser.emailAddresses.push({});
        return appUser.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors['emailAddresses.0.address']).to.exist;
          expect(err.errors['emailAddresses.0.address'].message).to.eql('email address is required');
        });

      });
    });
  });
});
