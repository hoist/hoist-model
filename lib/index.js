'use strict';
var fs = require('fs');
var modelsPath = __dirname + '/models';
var modelList = {};
fs.readdirSync(modelsPath).forEach(function (file) {
  /* istanbul ignore else  */
  if (file.indexOf('.js') >= 0) {
    var m = require(modelsPath + '/' + file);
    modelList[m.name] = m.model;
  }
});
modelList._mongoose = require('mongoose');
modelList._shortid = require('@hoist/mongoose-shortid');

module.exports=modelList;
