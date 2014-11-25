'use strict';
var mongoose = require('mongoose');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
    
var IpLogSchema = new Schema({
    ip: { type: String, index: true },
    dateTime: { type: Date, default: Date.now , index: true },
}, {capped: 314572800}); 

var IpLog = mongoose.model('IpLog', IpLogSchema);
BBPromise.promisifyAll(IpLog);
BBPromise.promisifyAll(IpLog.prototype);
exports.name = 'IpLog';
exports.model = mongoose.model('IpLog');