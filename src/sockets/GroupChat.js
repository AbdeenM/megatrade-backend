/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Chats from '../modules/chats/Model'

export const onUserJoin = async (data, groupChat, socket) => {
	const chatHistory = await Chats.findOneAndUpdate({ chatId: 'chat-group' }, {
		$push: {
			messages: {
				$each: [{
					isSystem: true,
					message: `${data.fullName} joined the group`
				}]
			}
		}
	})

	groupChat.emit('sysMessage', {
		isSystem: true,
		createdAt: new Date(),
		message: `${data.fullName} joined the group`
	})

	socket.emit('chatHistory', { chatHistory })
}

export const onMessage = () => {

}
