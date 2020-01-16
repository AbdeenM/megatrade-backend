'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onMessage = exports.onUserJoin = undefined;

var _Model = require('../modules/chats/Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const onUserJoin = exports.onUserJoin = async (data, groupChat, socket) => {
	const chatHistory = await _Model2.default.findOneAndUpdate({ chatId: 'chat-group' }, {
		$push: {
			messages: {
				$each: [{
					isSystem: true,
					message: `${data.fullName} joined the group`
				}]
			}
		}
	});

	groupChat.emit('sysMessage', {
		isSystem: true,
		createdAt: new Date(),
		message: `${data.fullName} joined the group`
	});

	socket.emit('chatHistory', { chatHistory });
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */

const onMessage = exports.onMessage = () => {};