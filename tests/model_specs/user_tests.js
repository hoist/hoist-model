'use strict';
require('../bootstrap');
var User = require('../../lib').User;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

describe('User', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    User.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('validation', function () {
    var user;
    before(function () {
      user = new User({
        organisation: 'orgid'
      });
    });
    describe('save', function () {
      var saved;
      before(function () {
        saved = user.saveAsync();
      });
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id', function () {
        return expect(saved.then(function (user) {
          return user._id.length;
        })).to.become(20);
      });
    });
    describe('email', function () {
      beforeEach(function () {
        user.emailAddresses = [];
      });
      afterEach(function () {
        user.emailAddresses = [];
      });
      it('allows valid email', function () {
        user.emailAddresses.push({
          address: 'test@hoi.io'
        });
        return expect(user.validateAsync()).to.be.fulfilled;
      });
      it('rejects invalid email', function () {
        user.emailAddresses.push({
          address: '3'
        });
        return user.validateAsync().then(function () {
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
        user.emailAddresses.push({});
        return user.validateAsync().then(function () {
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
    describe('password', function () {
      before(function () {
        user.passwordHash = '$2a$05$VJrbskBV2dlPhon1wIh9y./vvDukMeLJ0jwWxM.R/qQxBwa9F6vSa';
      });
      it('accepts valid password', function () {
        /* jshint -W030 */
        expect(user.verifyPassword('password')).to.be.true;
      });
      it('rejects invalid password', function () {
        /* jshint -W030 */
        expect(user.verifyPassword('ps')).to.be.false;
      });
    });
    describe('#setPassword', function () {
      before(function (done) {
        delete user.passwordHash;
        user.setPassword('password', done);
      });
      it('sets password hash', function () {
        expect(user.passwordHash)
          .to.not.eql('password');
      });
      it('sets a valid hash', function () {
        expect(user.verifyPassword('password'))
        .to.eql(true);
      });
    });
  });
});
