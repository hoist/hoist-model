'use strict';
require('../bootstrap');
var HoistForgottenPassword = require('../../lib').HoistForgottenPassword;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');

describe('HoistForgottenPassword', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    HoistForgottenPassword.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('validation with user id', function () {
    var saved;
    before(function () {
      saved = new HoistForgottenPassword({
        user: '123456789'
      }).saveAsync();
    });
    describe('save', function () {
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id', function () {
        return expect(saved.then(function (forgottenPassword) {
          return forgottenPassword._id.length;
        })).to.become(20);
      });
      it('has activation code', function () {
        return expect(saved.then(function (forgottenPassword) {
          return forgottenPassword.activationCode.length;
        })).to.exist;
      });

      it('has activated date as null', function () {
        return expect(saved.then(function (forgottenPassword) {
          return forgottenPassword.activatedDate;
        })).to.become(null);
      });

      it('has activated as false', function () {
        return expect(saved.then(function (forgottenPassword) {
          return forgottenPassword.activated;
        })).to.become(false);
      });

      it('has a createdAt date', function () {
        return expect(saved.then(function (forgottenPassword) {
          return forgottenPassword.createdAt;
        })).to.exist;
      });

    });

    describe('validation without user id', function () {
      it('is not saved', function () {
        return expect(new HoistForgottenPassword({
        }).saveAsync()).to.not.be.fulfilled;
      });
    });
  });
});
