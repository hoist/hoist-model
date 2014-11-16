'use strict';
var Generator = function() {

};

Generator.prototype = {
  generateRandomString: function(length) {
    var result = '';
    for (var i = length; i > 0; --i) {
      result += String.fromCharCode(Math.round(26 * Math.random() + 65));
    }
    return result;
  },

  generateShortCode: function() {
    return this.generateRandomString(20);
  }
};

module.exports = new Generator();