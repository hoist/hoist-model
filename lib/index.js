'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelsPath = __dirname + '/models';
var modelList = {};

_fs2.default.readdirSync(modelsPath).forEach(function (file) {
  /* istanbul ignore else  */
  if (file.endsWith('.js')) {
    var m = require(modelsPath + '/' + file);
    modelList[m.name] = m.model;
  }
});
modelList._mongoose = _bluebird2.default.promisifyAll(require('mongoose'));
modelList._shortid = require('@hoist/mongoose-shortid');

module.exports = modelList;
//# sourceMappingURL=index.js.map
