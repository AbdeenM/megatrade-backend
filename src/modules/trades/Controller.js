/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Trades from './Model'
import Users from '../users/Model'

export const fetchStatistics = async (req, res) => {
	const { userId } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		return res.json({
			error: false,
			data: ''
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting trade statistics, please refresh the page'
		})
	}
}
