/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { hash } from 'bcrypt'

import Users from './Model'
import Constants from '../../config/Constants'

export const register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body

	const newPassword = await hash('password', 9);

	try {
		const users = await Users.findOne({ email })
		if (users) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			})
		}

		return res.json({
			error: false,
			data: await Users.create({ firstName, lastName, email, password: newPassword })
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please try again'
		})
	}
}
