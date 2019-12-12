'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TradesSchema = new _mongoose.Schema({
    tradeBudget: {
        type: String,
        default: '4,519'
    },
    totalUsers: {
        type: String,
        default: '793'
    },
    totalPips: {
        type: String,
        default: '9,769'
    },
    totalProfits: {
        type: String,
        default: '23,940'
    }
}, {
    collection: 'trades',
    capped: {
        max: 1,
        size: 1024
    }
}); /* **************************************************************************
     * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
     ************************************************************************** */

exports.default = _mongoose2.default.model('trades', TradesSchema);