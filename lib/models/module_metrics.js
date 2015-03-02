'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;
var environments = ['live', 'test', 'dev'];
var ModuleMetricSchema = new Schema({
  schemaVersion: String,
  application: {
    type: ShortId,
    ref: 'Application',
    index: true,
    required: 'metrics must belong to an application'
  },
  environment: {
    type: String,
    enum: {
      values: environments,
      message: 'metrics tokens must belong to a valid environment'
    },
    required: 'metrics tokens must belong to a valid environment'
  },
  moduleName: String,
  timestampHour: Date,
  executions: {
    0: {
      type: Number,
      default: 0
    },
    1: {
      type: Number,
      default: 0
    },
    2: {
      type: Number,
      default: 0
    },
    3: {
      type: Number,
      default: 0
    },
    4: {
      type: Number,
      default: 0
    },
    5: {
      type: Number,
      default: 0
    },
    6: {
      type: Number,
      default: 0
    },
    7: {
      type: Number,
      default: 0
    },
    8: {
      type: Number,
      default: 0
    },
    9: {
      type: Number,
      default: 0
    },
    10: {
      type: Number,
      default: 0
    },
    11: {
      type: Number,
      default: 0
    },
    12: {
      type: Number,
      default: 0
    },
    13: {
      type: Number,
      default: 0
    },
    14: {
      type: Number,
      default: 0
    },
    15: {
      type: Number,
      default: 0
    },
    16: {
      type: Number,
      default: 0
    },
    17: {
      type: Number,
      default: 0
    },
    18: {
      type: Number,
      default: 0
    },
    19: {
      type: Number,
      default: 0
    },
    20: {
      type: Number,
      default: 0
    },
    21: {
      type: Number,
      default: 0
    },
    22: {
      type: Number,
      default: 0
    },
    23: {
      type: Number,
      default: 0
    },
    24: {
      type: Number,
      default: 0
    },
    25: {
      type: Number,
      default: 0
    },
    26: {
      type: Number,
      default: 0
    },
    27: {
      type: Number,
      default: 0
    },
    28: {
      type: Number,
      default: 0
    },
    29: {
      type: Number,
      default: 0
    },
    30: {
      type: Number,
      default: 0
    },
    31: {
      type: Number,
      default: 0
    },
    32: {
      type: Number,
      default: 0
    },
    33: {
      type: Number,
      default: 0
    },
    34: {
      type: Number,
      default: 0
    },
    35: {
      type: Number,
      default: 0
    },
    36: {
      type: Number,
      default: 0
    },
    37: {
      type: Number,
      default: 0
    },
    38: {
      type: Number,
      default: 0
    },
    39: {
      type: Number,
      default: 0
    },
    40: {
      type: Number,
      default: 0
    },
    41: {
      type: Number,
      default: 0
    },
    42: {
      type: Number,
      default: 0
    },
    43: {
      type: Number,
      default: 0
    },
    44: {
      type: Number,
      default: 0
    },
    45: {
      type: Number,
      default: 0
    },
    46: {
      type: Number,
      default: 0
    },
    47: {
      type: Number,
      default: 0
    },
    48: {
      type: Number,
      default: 0
    },
    49: {
      type: Number,
      default: 0
    },
    50: {
      type: Number,
      default: 0
    },
    51: {
      type: Number,
      default: 0
    },
    52: {
      type: Number,
      default: 0
    },
    53: {
      type: Number,
      default: 0
    },
    54: {
      type: Number,
      default: 0
    },
    55: {
      type: Number,
      default: 0
    },
    56: {
      type: Number,
      default: 0
    },
    57: {
      type: Number,
      default: 0
    },
    58: {
      type: Number,
      default: 0
    },
    59: {
      type: Number,
      default: 0
    }
  },
  timeouts: {
    0: {
      type: Number,
      default: 0
    },
    1: {
      type: Number,
      default: 0
    },
    2: {
      type: Number,
      default: 0
    },
    3: {
      type: Number,
      default: 0
    },
    4: {
      type: Number,
      default: 0
    },
    5: {
      type: Number,
      default: 0
    },
    6: {
      type: Number,
      default: 0
    },
    7: {
      type: Number,
      default: 0
    },
    8: {
      type: Number,
      default: 0
    },
    9: {
      type: Number,
      default: 0
    },
    10: {
      type: Number,
      default: 0
    },
    11: {
      type: Number,
      default: 0
    },
    12: {
      type: Number,
      default: 0
    },
    13: {
      type: Number,
      default: 0
    },
    14: {
      type: Number,
      default: 0
    },
    15: {
      type: Number,
      default: 0
    },
    16: {
      type: Number,
      default: 0
    },
    17: {
      type: Number,
      default: 0
    },
    18: {
      type: Number,
      default: 0
    },
    19: {
      type: Number,
      default: 0
    },
    20: {
      type: Number,
      default: 0
    },
    21: {
      type: Number,
      default: 0
    },
    22: {
      type: Number,
      default: 0
    },
    23: {
      type: Number,
      default: 0
    },
    24: {
      type: Number,
      default: 0
    },
    25: {
      type: Number,
      default: 0
    },
    26: {
      type: Number,
      default: 0
    },
    27: {
      type: Number,
      default: 0
    },
    28: {
      type: Number,
      default: 0
    },
    29: {
      type: Number,
      default: 0
    },
    30: {
      type: Number,
      default: 0
    },
    31: {
      type: Number,
      default: 0
    },
    32: {
      type: Number,
      default: 0
    },
    33: {
      type: Number,
      default: 0
    },
    34: {
      type: Number,
      default: 0
    },
    35: {
      type: Number,
      default: 0
    },
    36: {
      type: Number,
      default: 0
    },
    37: {
      type: Number,
      default: 0
    },
    38: {
      type: Number,
      default: 0
    },
    39: {
      type: Number,
      default: 0
    },
    40: {
      type: Number,
      default: 0
    },
    41: {
      type: Number,
      default: 0
    },
    42: {
      type: Number,
      default: 0
    },
    43: {
      type: Number,
      default: 0
    },
    44: {
      type: Number,
      default: 0
    },
    45: {
      type: Number,
      default: 0
    },
    46: {
      type: Number,
      default: 0
    },
    47: {
      type: Number,
      default: 0
    },
    48: {
      type: Number,
      default: 0
    },
    49: {
      type: Number,
      default: 0
    },
    50: {
      type: Number,
      default: 0
    },
    51: {
      type: Number,
      default: 0
    },
    52: {
      type: Number,
      default: 0
    },
    53: {
      type: Number,
      default: 0
    },
    54: {
      type: Number,
      default: 0
    },
    55: {
      type: Number,
      default: 0
    },
    56: {
      type: Number,
      default: 0
    },
    57: {
      type: Number,
      default: 0
    },
    58: {
      type: Number,
      default: 0
    },
    59: {
      type: Number,
      default: 0
    }
  },
  failures: {
    0: {
      type: Number,
      default: 0
    },
    1: {
      type: Number,
      default: 0
    },
    2: {
      type: Number,
      default: 0
    },
    3: {
      type: Number,
      default: 0
    },
    4: {
      type: Number,
      default: 0
    },
    5: {
      type: Number,
      default: 0
    },
    6: {
      type: Number,
      default: 0
    },
    7: {
      type: Number,
      default: 0
    },
    8: {
      type: Number,
      default: 0
    },
    9: {
      type: Number,
      default: 0
    },
    10: {
      type: Number,
      default: 0
    },
    11: {
      type: Number,
      default: 0
    },
    12: {
      type: Number,
      default: 0
    },
    13: {
      type: Number,
      default: 0
    },
    14: {
      type: Number,
      default: 0
    },
    15: {
      type: Number,
      default: 0
    },
    16: {
      type: Number,
      default: 0
    },
    17: {
      type: Number,
      default: 0
    },
    18: {
      type: Number,
      default: 0
    },
    19: {
      type: Number,
      default: 0
    },
    20: {
      type: Number,
      default: 0
    },
    21: {
      type: Number,
      default: 0
    },
    22: {
      type: Number,
      default: 0
    },
    23: {
      type: Number,
      default: 0
    },
    24: {
      type: Number,
      default: 0
    },
    25: {
      type: Number,
      default: 0
    },
    26: {
      type: Number,
      default: 0
    },
    27: {
      type: Number,
      default: 0
    },
    28: {
      type: Number,
      default: 0
    },
    29: {
      type: Number,
      default: 0
    },
    30: {
      type: Number,
      default: 0
    },
    31: {
      type: Number,
      default: 0
    },
    32: {
      type: Number,
      default: 0
    },
    33: {
      type: Number,
      default: 0
    },
    34: {
      type: Number,
      default: 0
    },
    35: {
      type: Number,
      default: 0
    },
    36: {
      type: Number,
      default: 0
    },
    37: {
      type: Number,
      default: 0
    },
    38: {
      type: Number,
      default: 0
    },
    39: {
      type: Number,
      default: 0
    },
    40: {
      type: Number,
      default: 0
    },
    41: {
      type: Number,
      default: 0
    },
    42: {
      type: Number,
      default: 0
    },
    43: {
      type: Number,
      default: 0
    },
    44: {
      type: Number,
      default: 0
    },
    45: {
      type: Number,
      default: 0
    },
    46: {
      type: Number,
      default: 0
    },
    47: {
      type: Number,
      default: 0
    },
    48: {
      type: Number,
      default: 0
    },
    49: {
      type: Number,
      default: 0
    },
    50: {
      type: Number,
      default: 0
    },
    51: {
      type: Number,
      default: 0
    },
    52: {
      type: Number,
      default: 0
    },
    53: {
      type: Number,
      default: 0
    },
    54: {
      type: Number,
      default: 0
    },
    55: {
      type: Number,
      default: 0
    },
    56: {
      type: Number,
      default: 0
    },
    57: {
      type: Number,
      default: 0
    },
    58: {
      type: Number,
      default: 0
    },
    59: {
      type: Number,
      default: 0
    }
  }


});

ModuleMetricSchema.plugin(timestamps);

ModuleMetricSchema.index({
  application: 1,
  environment: 1,
  timestampHour: 1
});

ModuleMetricSchema.index({
  application: 1,
  environment: 1,
  timestampHour: 1,
  moduleName: 1
});

mongoose.model('ModuleMetric', ModuleMetricSchema);
var ModuleMetric = mongoose.model('ModuleMetric');
BBPromise.promisifyAll(ModuleMetric);
BBPromise.promisifyAll(ModuleMetric.prototype);
exports.name = 'ModuleMetric';
exports.model = ModuleMetric;
