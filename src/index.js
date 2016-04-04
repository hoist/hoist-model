'use strict';
import fs from 'fs';
import Promise from 'bluebird';
var modelsPath = __dirname + '/models';
let modelList = {};

fs.readdirSync(modelsPath).forEach(function (file) {
  /* istanbul ignore else  */
  if (file.indexOf('.js') >= 0) {
    var m = require(modelsPath + '/' + file);
    modelList[m.name] = m.model;
  }
});
modelList._mongoose = Promise.promisifyAll(require('mongoose'));
modelList._shortid = require('@hoist/mongoose-shortid');

module.exports = modelList;
