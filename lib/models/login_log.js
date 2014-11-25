'use strict';
var mongoose = require('mongoose');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
    
var LoginLogSchema = new Schema({
    username: { type: String, index: true },
    dateTime: { type: Date, default: Date.now , index: true },
    success: { type: Boolean, index:true }
}, {capped: 314572800}); 

var LoginLog = mongoose.model('LoginLog', LoginLogSchema);
BBPromise.promisifyAll(LoginLog);
BBPromise.promisifyAll(LoginLog.prototype);
exports.name = 'LoginLog';
exports.model = mongoose.model('LoginLog');