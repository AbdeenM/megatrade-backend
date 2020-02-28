/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Chats from '../modules/chats/Model'
import Users from '../modules/users/Model'
import Schedular from '../modules/schedulars/Model'
import { scheduleRemoveUserSponsorship } from './Schedular'

export const defaultSettings = async () => {
	const checkChats = await Chats.findOne({ chatId: 'chat-group' })
	if (!checkChats)
		await Chats.create({ chatId: 'chat-group' })

	const checkSchedularRemoveSponsorship = await Schedular.findOne({ task: 'remove-sponsorship' })
	if (!checkSchedularRemoveSponsorship)
		await Schedular.create({ task: 'remove-sponsorship' })
	else {
		checkSchedularRemoveSponsorship.jobs.forEach(job => {
			if (job.pending)
				scheduleRemoveUserSponsorship(job.userId, job.time, job._id)
		})
	}

	const allUsers = await Users.find({})
	for (let index = 0; index < allUsers.length; index++) {
		const user = allUsers[index];

		await Users.findByIdAndUpdate(user._id, { usedCodes: [] })
	}
}