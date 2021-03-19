'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onUserLeft = exports.onMoreChatHistory = exports.onMessage = exports.onUserJoin = undefined;

var _Model = require('../modules/chats/Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let availableUsers = [];

const onUserJoin = exports.onUserJoin = async (data, groupChat, socket) => {
    const newData = Object.assign({}, data, {
        socketId: socket.id
    });

    availableUsers.push(newData);

    const chatHistory = await _Model2.default.findOne({ chatId: 'chat-group' });

    socket.emit('chatHistory', chatHistory.messages.slice(-100));

    groupChat.emit('availableUsers', availableUsers);

    // const chatHistory = await Chats.findOneAndUpdate({ chatId: 'chat-group' }, {
    // 	$push: {
    // 		messages: {
    // 			$each: [{
    // 				isSystem: true,
    // 				message: `${data.isAdmin ? 'Admin' : 'User'} ${data.fullName} joined the group`
    // 			}]
    // 		}
    // 	}
    // })

    // groupChat.emit('message', {
    // 	isSystem: true,
    // 	createdAt: new Date(),
    // 	message: `${data.fullName} joined the group`
    // })
};

const onMessage = exports.onMessage = async (data, groupChat, socket) => {
    await _Model2.default.findOneAndUpdate({ chatId: 'chat-group' }, {
        $push: {
            messages: {
                $each: [data]
            }
        }
    });

    groupChat.emit('message', data);
};

const onMoreChatHistory = exports.onMoreChatHistory = async (data, groupChat, socket) => {
    const chatHistory = await _Model2.default.findOne({ chatId: 'chat-group' });

    const startSlice = -parseInt(data.fetchedMessages) - 100;
    const endSlice = -parseInt(data.fetchedMessages);

    console.log(startSlice, endSlice);

    socket.emit('moreChatHistory', chatHistory.messages.slice(startSlice, endSlice));
};

const onUserLeft = exports.onUserLeft = async (groupChat, socket) => {
    const userLeaving = availableUsers.filter(user => user.socketId === socket.id)[0];
    const newListAvailableUsers = availableUsers.filter(user => user.socketId !== socket.id);

    availableUsers = newListAvailableUsers;

    groupChat.emit('availableUsers', availableUsers);

    // const chatHistory = await Chats.findOneAndUpdate({ chatId: 'chat-group' }, {
    // 	$push: {
    // 		messages: {
    // 			$each: [{
    // 				isSystem: true,
    // 				message: `${data.isAdmin ? 'Admin' : 'User'} ${userLeaving.fullName} left the group`
    // 			}]
    // 		}
    // 	}
    // })

    // groupChat.emit('message', {
    // 	isSystem: true,
    // 	createdAt: new Date(),
    // 	message: `${data.isAdmin ? 'Admin' : 'User'} ${userLeaving.fullName} left the group`
    // })
};