/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import fs from 'fs'
import { hash, compare } from 'bcrypt'

import Users from './Model'
import Constants from '../../config/Constants'

export const register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body

	const newPassword = await hash(password, 9)

	try {
		const user = await Users.findOne({ email })
		if (user) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			})
		}

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: await Users.create({ firstName, lastName, email, password: newPassword })
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while registering your account, please refresh the page and try again'
		})
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await Users.findOne({ email })
		if (!user) {
			return res.json({
				error: true,
				message: 'The email you entered does not seem to be registered, please check if you entered it correct'
			})
		}

		await compare(password, user.password, (error, doesMatch) => {
			if (doesMatch)
				return res.json({
					error: false,
					message: 'Logged in to your account successfully',
					data: user
				})
			else
				return res.json({
					error: true,
					message: 'Wrong password, please try again'
				})
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		})
	}
}

export const socialLogin = async (req, res) => {
	const { email, firstName, lastName, avatar } = req.body

	try {
		const user = await Users.findOne({ email })
		if (user) {
			return res.json({
				error: false,
				message: 'Logged in to your account successfully',
				data: user
			})
		}

		const newUser = await Users.create({ email, firstName, lastName, avatar })

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: newUser
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		})
	}
}

export const fetchAccount = async (req, res) => {
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
			data: user
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		})
	}
}

export const updateAccount = async (req, res) => {
	const { userId, city, email, avatar, number, country, lastName, password, firstName, notifications } = req.body

	try {
		const user = await Users.findById(userId)
		let status = parseInt(user.status)

		if (!user) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			})
		}

		if (city !== undefined) {
			await Users.findByIdAndUpdate(userId, { city })

			if (user.city.length <= 0)
				status += 10
		}

		if (email !== undefined)
			await Users.findByIdAndUpdate(userId, { email })

		if (number !== undefined) {
			await Users.findByIdAndUpdate(userId, { number })

			if (user.number.length <= 0)
				status += 10
		}

		if (country !== undefined) {
			await Users.findByIdAndUpdate(userId, { country })

			if (user.country.length <= 0)
				status += 10
		}

		if (lastName !== undefined)
			await Users.findByIdAndUpdate(userId, { lastName })

		if (firstName !== undefined)
			await Users.findByIdAndUpdate(userId, { firstName })

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image
				const imageName = '/' + new Date().getTime().toString() + '.png';
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
				const imagePath = `uploads/profile_pictures/${userId}`

				if (!fs.existsSync(imagePath))
					fs.mkdirSync(imagePath)

				fs.writeFile(imagePath + imageName, base64Data, 'base64', (error) => console.log(error))

				profilePic = Constants.SERVER_URL + imagePath + imageName

				await Users.findByIdAndUpdate(userId, { avatar: profilePic })

				if (user.avatar.length <= 0)
					status += 10
			}
		}

		if (notifications !== undefined)
			await Users.findByIdAndUpdate(userId, { notifications })

		if (password !== undefined) {
			const newPassword = await hash(password, 9)
			await Users.findByIdAndUpdate(userId, { password: newPassword })
		}

		await Users.findByIdAndUpdate(userId, { status })

		return res.json({
			error: false,
			message: 'Your account details have been updated successfully',
			data: await Users.findById(userId)
		})
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while updating your profile, please refresh the page and try again'
		})
	}
}