'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StatisticsSchema = new _mongoose.Schema({
    totalUsers: {
        type: Number,
        default: 0
    },
    totalLogins: {
        type: Number,
        default: 0
    },
    totalSignals: {
        type: Number,
        default: 0
    },
    totalFreeSignals: {
        type: Number,
        default: 0
    },
    totalPayingUsers: {
        type: Number,
        default: 0
    },
    totalSponsoredUsers: {
        type: Number,
        default: 0
    }
});

exports.default = _mongoose2.default.model('statistics', StatisticsSchema);