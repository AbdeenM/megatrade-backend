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
}); /* **************************************************************************
     * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
     ************************************************************************** */

exports.default = _mongoose2.default.model('chats', ChatsSchema);