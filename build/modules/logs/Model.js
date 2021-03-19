'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LogsSchema = new _mongoose.Schema({
    name: {
        type: String
    },
    event: {
        type: String
    },
    summary: {
        type: String
    },
    function: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: {
        type: String,
        default: new Date().toString()
    },
    note: {
        type: String
    }
});

exports.default = _mongoose2.default.model('logs', LogsSchema);