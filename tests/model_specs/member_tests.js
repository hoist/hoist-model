'use strict';
var Member = require('../../lib').Member;
var expect = require('chai').expect;
var dbUri = 'mongodb://localhost/hoist-model-test';
var mongoose = require('mongoose');
require('../bootstrap');
describe('Member', function () {
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }

    mongoose.connect(dbUri, done);
  });
  after(function (done) {
    Member.remove({}, function () {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
  });
  describe('validation', function () {
    var member;
    before(function () {
      member = new Member({});
    });
    describe('save', function () {
      var saved;
      before(function () {
        saved = new Member({
          Application: 'appid'
        }).saveAsync();
      });
      it('should save', function () {
        return expect(saved).to.be.fulfilled;
      });
    });
    describe('email', function () {
      beforeEach(function () {
        member.emailAddresses = [];
      });
      it('allows valid email', function () {
        member.emailAddresses.push({
          address: 'test@hoi.io'
        });
        return expect(member.validateAsync()).to.be.fulfilled;
      });
      it('rejects invalid email', function () {
        member.emailAddresses.push({
          address: '3'
        });
        return member.validateAsync().then(function () {
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
        member.emailAddresses.push({
        });
        return member.validateAsync().then(function () {
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
