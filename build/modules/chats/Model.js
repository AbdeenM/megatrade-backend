'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ChatsSchema = new _mongoose.Schema({
    chatId: {
        type: String
    },
    messages: [{
        isSystem: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        userId: {
            type: String
        },
        message: {
            type: String
        },
        fullName: {
            type: String
        },
        avatar: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

exports.default = _mongoose2.default.model('chats', ChatsSchema);