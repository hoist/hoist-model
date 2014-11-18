'use strict';
require('../bootstrap');
var EmailValidationToken = require('../../lib').EmailValidationToken;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

describe('EmailValidationToken', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    EmailValidationToken.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('validation with user id', function () {
    var saved;
    before(function () {
      saved = new EmailValidationToken({
        user: '123456789',
        email: 'test@test.com'
      }).saveAsync();
    });
    describe('save', function () {
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken._id.length;
        })).to.become(20);
      });
      it('has activation code', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken.activationCode.length;
        })).to.exist;
      });

      it('has email address', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken.email.length;
        })).to.exist;
      });

      it('has activated date as null', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken.activatedDate;
        })).to.become(null);
      });

      it('has activated as false', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken.activated;
        })).to.become(false);
      });

      it('has a createdAt date', function () {
        return expect(saved.then(function (validationToken) {
          return validationToken.createdAt;
        })).to.exist;
      });

    });

    describe('validation without user id', function () {
      it('throws a validation error', function () {
        return expect(new EmailValidationToken({})
        .saveAsync()).to.be.rejectedWith('Validation failed');
      });

      it('is gives correct validation error message', function () {
        return new EmailValidationToken({}).saveAsync()
        .catch(function (error) {
          expect(error.errors.user.message).to.eql('Must belong to a Hoist User');
        });
      });
    });
  });
});
