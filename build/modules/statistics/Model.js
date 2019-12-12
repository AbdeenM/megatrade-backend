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
    totalProfit: {
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
    }
}); /* **************************************************************************
     * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
     ************************************************************************** */

exports.default = _mongoose2.default.model('statistics', StatisticsSchema);