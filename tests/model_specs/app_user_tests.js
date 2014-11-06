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
    var member;
    before(function () {
      member = new AppUser({
        application:'appid',
        environment:'live'
      });
    });
    describe('save', function () {
      var saved;
      before(function () {
        saved = member.saveAsync();
      });
      it('is saved', function () {
        return expect(saved).to.be.fulfilled;
      });
      it('has id',function(){
        return expect(saved.then(function(member){
          return member._id.length;
        })).to.become(20);
      });
    });
    describe('application',function(){
      afterEach(function(){
        member.application = 'appid';
      });
      it('is required',function(){
        member.application = null;
        return member.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.application).to.exist;
          expect(err.errors.application.message).to.eql('members must belong to an application');
        });
      });
    });
     describe('environment',function(){
      afterEach(function(){
        member.environment = 'live';
      });
      it('is required',function(){
        member.environment = null;
        return member.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('members must belong to a valid environment');
        });
      });
      it('it must be a valid environment',function(){
        member.environment = 'random';
        return member.validateAsync().then(function () {
          //fail here;
          expect(false).to.be.true();
        }).catch(function (err) {
          expect(err).to.be.instanceof(mongoose.Error.ValidationError);
          /* jshint -W030 */
          expect(err.errors.environment).to.exist;
          expect(err.errors.environment.message).to.eql('members must belong to a valid environment');
        });
      });
    });
    describe('email', function () {
      beforeEach(function () {
        member.emailAddresses = [];
      });
      afterEach(function(){
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
