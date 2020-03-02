/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Chats from '../modules/chats/Model'

let availableUsers = []

export const onUserJoin = async (data, groupChat, socket) => {
	const newData = {
		...data,
		socketId: socket.id
	}

	availableUsers.push(newData)

	const chatHistory = await Chats.findOne({ chatId: 'chat-group' })

	socket.emit('chatHistory', chatHistory.messages.slice(-100))

	groupChat.emit('availableUsers', availableUsers)

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
}

export const onMessage = async (data, groupChat, socket) => {
	await Chats.findOneAndUpdate({ chatId: 'chat-group' }, {
		$push: {
			messages: {
				$each: [data]
			}
		}
	})

	groupChat.emit('message', data)
}

export const onMoreChatHistory = async (data, groupChat, socket) => {
	const chatHistory = await Chats.findOne({ chatId: 'chat-group' })

	const startSlice = -parseInt(data.fetchedMessages) - 100
	const endSlice = -parseInt(data.fetchedMessages)

	console.log(startSlice, endSlice);

	socket.emit('moreChatHistory', chatHistory.messages.slice(startSlice, endSlice))
}

export const onUserLeft = async (groupChat, socket) => {
	const userLeaving = availableUsers.filter(user => user.socketId === socket.id)[0]
	const newListAvailableUsers = availableUsers.filter(user => user.socketId !== socket.id)

	availableUsers = newListAvailableUsers

	groupChat.emit('availableUsers', availableUsers)

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
}