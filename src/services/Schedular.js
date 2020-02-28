/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Schedule from 'node-schedule'

import Users from '../modules/users/Model'
import Schedular from '../modules/schedulars/Model'
import Statistics from '../modules/statistics/Model'

export const scheduleRemoveUserSponsorship = async (userId, date, schedularId) => {
	Schedule.scheduleJob(date, async () => {
		const user = await Users.findById(userId)
		if (user.membership === 'Sponsored Membership') {
			await Users.findByIdAndUpdate(userId, {
				subscriptionId: 'FREE',
				membershipAmount: '0.00',
				membership: 'Free Membership'
			})

			const statistics = await Statistics.findOne({})
			await Statistics.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) - 1 })

			await Schedular.findOneAndUpdate({ task: 'remove-sponsorship', 'jobs._id': schedularId }, { $set: { 'jobs.$.pending': false } })
		}
	})
}