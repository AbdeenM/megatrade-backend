/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import fs from 'fs'
import { hash, compare } from 'bcrypt'

import Users from './Model'
import Logs from '../logs/Model'
import Signals from '../signals/Model'
import Statistics from '../statistics/Model'
import Constants from '../../config/Constants'
import Dashobard from '../userDashboard/Model'
import FreeSignals from '../freeSignals/Model'
import Subscriptions from '../subscriptions/Model'
import { paypalAccessTocken, cancelPayPalSubscription } from '../../services/PayPal'

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

		const userData = await Users.create({ firstName, lastName, email, password: newPassword })

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 })

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: userData
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'register',
			description: error.message
		})

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

		await compare(password, user.password, async (error, doesMatch) => {
			if (doesMatch) {
				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalLogins: parseInt(statistics.totalLogins) + 1 })

				return res.json({
					error: false,
					message: 'Logged in to your account successfully',
					data: user
				})
			}
			else
				return res.json({
					error: true,
					message: 'Wrong password, please try again'
				})
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'login',
			description: error.message
		})

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
			const statistics = await Statistics.findOne({})

			await Statistics.findByIdAndUpdate(statistics._id, { totalLogins: parseInt(statistics.totalLogins) + 1 })

			return res.json({
				error: false,
				message: 'Logged in to your account successfully',
				data: user
			})
		} else {
			const newUser = await Users.create({ email, firstName, lastName, avatar })

			const statistics = await Statistics.findOne({})

			await Statistics.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 })

			return res.json({
				error: false,
				message: 'A new account has been created for you successfully',
				data: newUser
			})
		}
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'socialLogin',
			description: error.message
		})

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
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchAccount',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		})
	}
}

export const updateAccount = async (req, res) => {
	const { userId, city, email, avatar, number, country, lastName, password, firstName, notifications } = req.body

	try {
		let status = 0
		let user = await Users.findById(userId)

		if (!user) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			})
		}

		if (city !== undefined)
			await Users.findByIdAndUpdate(userId, { city })

		if (email !== undefined)
			await Users.findByIdAndUpdate(userId, { email })

		if (number !== undefined)
			await Users.findByIdAndUpdate(userId, { number })

		if (country !== undefined)
			await Users.findByIdAndUpdate(userId, { country })

		if (lastName !== undefined)
			await Users.findByIdAndUpdate(userId, { lastName })

		if (firstName !== undefined)
			await Users.findByIdAndUpdate(userId, { firstName })

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image
				const imageName = '/' + new Date().getTime().toString() + '.png'
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
				const imagePath = `public/profile_pictures/${userId}`

				if (!fs.existsSync(imagePath))
					fs.mkdirSync(imagePath)

				fs.writeFile(imagePath + imageName, base64Data, 'base64', async (error) => {
					if (error) {
						await Logs.create({
							name: 'Updating profile',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'updateAccount',
							description: error.message,
							note: 'Maybe no space in server storage or we ran it ran out of memory?'
						})

						return res.json({
							error: true,
							message: 'Error uploading the profile picture to the server, please try again'
						})
					}
				})

				profilePic = Constants.SERVER_URL + '/' + imagePath + imageName

				await Users.findByIdAndUpdate(userId, { avatar: profilePic })

			}
		}

		if (notifications !== undefined)
			await Users.findByIdAndUpdate(userId, { notifications })

		if (password !== undefined) {
			const newPassword = await hash(password, 9)
			await Users.findByIdAndUpdate(userId, { password: newPassword })
		}

		user = await Users.findById(userId)

		if (user.notifications)
			status += 10

		if (user.city.length > 0)
			status += 10

		if (user.email.length > 0)
			status += 10

		if (user.avatar.length > 0)
			status += 10

		if (user.number.length > 0)
			status += 10

		if (user.country.length > 0)
			status += 10

		if (user.lastName.length > 0)
			status += 10

		if (user.firstName.length > 0)
			status += 10

		if (user.membership !== 'Free Membership')
			status += 20

		await Users.findByIdAndUpdate(userId, { status })

		return res.json({
			error: false,
			message: 'Your account details have been updated successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'updateAccount',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while updating your profile, please refresh the page and try again'
		})
	}
}

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

		const dashboard = await Dashobard.findOne({})

		return res.json({
			error: false,
			data: dashboard
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchStatistics',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting trade statistics, please refresh the page'
		})
	}
}

export const fetchSubscriptions = async (req, res) => {
	const { userId } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const subscriptions = await Subscriptions.find({})

		return res.json({
			error: false,
			data: {
				subscriptions,
				userMembership: user.membership,
				userSubscriptionId: user.subscriptionId
			}
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSubscriptions',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}

export const createSubscription = async (req, res) => {
	const { userId, planId, orderId, startTime, subscriptionId, nextBilling } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const subscriptions = await Subscriptions.find({})

		const paidSubscription = subscriptions.filter(subscription => subscription.planId.toString() === planId)[0]

		await Users.findByIdAndUpdate(userId, {
			subscriptionId,
			membership: paidSubscription.title,
			membershipAmount: paidSubscription.price,
			$push: {
				membershipHistory: {
					$each: [{
						orderId,
						startTime,
						nextBilling,
						subscriptionId,
						price: paidSubscription.price,
						package: paidSubscription.title
					}]
				}
			}
		})

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) + 1 })

		return res.json({
			error: false,
			message: 'Your memebership has been updated successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSubscription',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating your subsription membership, please refresh the page'
		})
	}
}

export const cancelSubscription = async (req, res) => {
	const { userId } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const paypalToken = await paypalAccessTocken()
		if (paypalToken.error)
			return res.json({
				error: true,
				message: paypalToken.message
			})

		const paypalCancelSubscription = await cancelPayPalSubscription(paypalToken.data.access_token, user.subscriptionId)
		if (paypalCancelSubscription.error)
			return res.json({
				error: true,
				message: paypalCancelSubscription.message
			})

		await Users.findByIdAndUpdate(userId, {
			subscriptionId: 'FREE',
			membershipAmount: '0.00',
			membership: 'Free Membership'
		})

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })

		return res.json({
			error: false,
			message: 'You are now on the free memebership package'
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'cancelSubscription',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while cancelling your subsription membership, please refresh the page'
		})
	}
}

export const fetchSignals = async (req, res) => {
	const { userId } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		let signalsData
		if (user.membership === 'Free Membership')
			signalsData = await FreeSignals.find({})
		else
			signalsData = await Signals.find({})

		return res.json({
			error: false,
			data: signalsData.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}