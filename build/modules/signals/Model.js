'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SignalsSchema = new _mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: String
    },
    stopLoss: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    entryPrice: {
        type: String
    }
});

exports.default = _mongoose2.default.model('signals', SignalsSchema);