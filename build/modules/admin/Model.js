'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AdminSchema = new _mongoose.Schema({
    city: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    number: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastName: {
        type: String,
        default: ''
    },
    password: {
        type: String
    },
    firstName: {
        type: String,
        default: ''
    }
});

exports.default = _mongoose2.default.model('admin', AdminSchema);