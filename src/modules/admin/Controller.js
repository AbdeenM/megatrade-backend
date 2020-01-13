/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import fs from 'fs'
import Schedule from 'node-schedule'
import { hash, compare } from 'bcrypt'

import Admin from './Model'
import Logs from '../logs/Model'
import Users from '../users/Model'
import Signals from '../signals/Model'
import Sponsors from '../sponsors/Model'
import Questions from '../questions/Model'
import Statistics from '../statistics/Model'
import Constants from '../../config/Constants'
import FreeSignals from '../freeSignals/Model'
import Subscriptions from '../subscriptions/Model'
import UserDashboard from '../userDashboard/Model'
import { onSendEmailAlerts, onSendEmailQuestion, onSendEmailMessage } from '../../services/Email'

export const register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body

	const newPassword = await hash(password, 9)

	try {
		const admin = await Admin.findOne({ email: email.toLowerCase() })
		if (admin) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			})
		}

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: await Admin.create({ firstName, lastName, email, password: newPassword })
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'register - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please try again'
		})
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const admin = await Admin.findOne({ email: email.toLowerCase() })
		if (!admin) {
			return res.json({
				error: true,
				message: 'The email you entered does not seem to be registered, please check if you entered it correct'
			})
		}

		await compare(password, admin.password, (error, doesMatch) => {
			if (doesMatch)
				return res.json({
					error: false,
					message: 'Logged in to your account successfully',
					data: admin
				})
			else
				return res.json({
					error: true,
					message: 'Wrong password, please try again'
				})
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'login - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please try again'
		})
	}
}

export const fetchAccount = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		return res.json({
			error: false,
			data: admin
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchAccount - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		})
	}
}

export const updateAccount = async (req, res) => {
	const { adminId, email, avatar, lastName, password, firstName, city, number, country } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			})
		}

		if (city !== undefined)
			await Admin.findByIdAndUpdate(adminId, { city })

		if (email !== undefined)
			await Admin.findByIdAndUpdate(adminId, { email: email.toLowerCase() })

		if (number !== undefined)
			await Admin.findByIdAndUpdate(adminId, { number })

		if (country !== undefined)
			await Admin.findByIdAndUpdate(adminId, { country })

		if (lastName !== undefined)
			await Admin.findByIdAndUpdate(adminId, { lastName })

		if (firstName !== undefined)
			await Admin.findByIdAndUpdate(adminId, { firstName })

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image
				const imageName = '/' + new Date().getTime().toString() + '.png'
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
				const imagePath = `public/profile_pictures/${adminId}`

				if (!fs.existsSync(imagePath))
					fs.mkdirSync(imagePath)

				fs.writeFile(imagePath + imageName, base64Data, 'base64', async (error) => {
					if (error) {
						await Logs.create({
							name: 'Updating profile admin',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'updateAccount - Admin',
							description: error.message || '',
							note: 'Maybe no space in server storage or we ran it ran out of memory?'
						})

						return res.json({
							error: true,
							message: 'Error uploading the profile picture to the server, please try again'
						})
					}
				})

				profilePic = Constants.SERVER_URL + '/' + imagePath + imageName

				await Admin.findByIdAndUpdate(adminId, { avatar: profilePic })
			}
		}

		if (password !== undefined) {
			const newPassword = await hash(password, 9)
			await Admin.findByIdAndUpdate(adminId, { password: newPassword })
		}

		return res.json({
			error: false,
			message: 'Your account details have been updated successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'updateAccount - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while updating your profile, please refresh the page and try again'
		})
	}
}

export const fetchUserDashboard = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const userDashboard = await UserDashboard.findOne({})
		if (userDashboard)
			return res.json({
				error: false,
				data: userDashboard
			})

		return res.json({
			error: false,
			data: await UserDashboard.create({})
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchUserDashboard - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}

export const fetchSubscriptions = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const subscriptions = await Subscriptions.find({})

		return res.json({
			error: false,
			data: subscriptions
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSubscriptions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}

export const createUserDashboard = async (req, res) => {
	const { adminId, totalPips, totalUsers, tradeBudget, totalProfits, tradeFocus, latestAlerts } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const userDashboard = await UserDashboard.findOne({})
		if (userDashboard) {
			await UserDashboard.findByIdAndUpdate(userDashboard._id, {
				totalPips,
				totalUsers,
				tradeBudget,
				totalProfits,
				tradeFocus: {
					data: tradeFocus.data,
					labels: tradeFocus.labels,
					backgroundColor: tradeFocus.backgroundColor
				},
				latestAlerts: {
					thisYear: latestAlerts.thisYear,
					lastYear: latestAlerts.lastYear
				}
			})

			return res.json({
				error: false,
				message: 'The new user dashboard data has been updated successfully'
			})
		}

		await UserDashboard.create({})

		return res.json({
			error: false,
			message: 'The new user dashboard data has been updated successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUserDashboard - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user dashboard data, please refresh the page'
		})
	}
}

export const createSubscriptions = async (req, res) => {
	const { adminId, title, planId, validity, price, image, description } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		let newImage
		if (image !== undefined) {
			let subscriptionPic = image
			const imageName = '/' + new Date().getTime().toString() + '.png'
			const base64Data = subscriptionPic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
			const imagePath = 'public/subscriptions'

			if (!fs.existsSync(imagePath))
				fs.mkdirSync(imagePath)

			fs.writeFile(imagePath + imageName, base64Data, 'base64', async (error) => {
				if (error) {
					await Logs.create({
						name: 'Creating suscription',
						event: 'Upload media Error',
						summary: 'Failed to upload media base64 data to mega trade servers',
						function: 'createSubscriptions - Admin',
						description: error.message || '',
						note: 'Maybe no space in server storage or we ran it ran out of memory?'
					})

					return res.json({
						error: true,
						message: 'Error uploading the profile picture to the server, please try again'
					})
				}
			})

			newImage = Constants.SERVER_URL + '/' + imagePath + imageName
		}

		await Subscriptions.create({ image: newImage, price, title, planId, validity, description })

		return res.json({
			error: false,
			message: 'A new subscription membership has been created successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSubscriptions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the subsription membership, please refresh the page'
		})
	}
}

export const removeSubscriptions = async (req, res) => {
	const { adminId, subscriptionId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Subscriptions.findByIdAndDelete(subscriptionId)

		return res.json({
			error: false,
			message: 'The subscription membership has been deleted successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'removeSubscriptions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while removing the subscription membership, please refresh the page'
		})
	}
}

export const fetchUsersList = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const userList = await Users.find({})

		return res.json({
			error: false,
			data: userList.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchUserList - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the users list, please refresh the page'
		})
	}
}

export const deleteUsers = async (req, res) => {
	const { adminId, users } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		for (let each = 0; each < users.length; each++) {
			const user = users[each]

			await Users.findByIdAndDelete(user)
		}

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) - users.length })

		return res.json({
			error: false,
			message: 'Selected user(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteUsers - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the user(s) profile(s), please refresh the page'
		})
	}
}

export const editUser = async (req, res) => {
	const { adminId, city, email, avatar, number, status, userId, country, password, lastName, membership, firstName, notifications, subscriptionId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		let newAvatar = avatar.image
		if (avatar.isBase64) {
			let profilePic = avatar.image
			const imageName = '/' + new Date().getTime().toString() + '.png'
			const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
			const imagePath = `public/profile_pictures/${userId}`

			if (!fs.existsSync(imagePath))
				fs.mkdirSync(imagePath)

			fs.writeFile(imagePath + imageName, base64Data, 'base64', async (error) => {
				if (error) {
					await Logs.create({
						name: 'editUser User',
						event: 'Upload media Error',
						summary: 'Failed to upload media base64 data to mega trade servers',
						function: 'editUser - Admin',
						description: error.message || '',
						note: 'Maybe no space in server storage or we ran it ran out of memory?'
					})

					return res.json({
						error: true,
						message: 'Error uploading the profile picture to the server, please try again'
					})
				}
			})

			newAvatar = Constants.SERVER_URL + '/' + imagePath + imageName
		}

		let newPassword
		if (password !== undefined) {
			if (password.length > 0) {
				newPassword = await hash(password, 9)
			}
		}

		await Users.findByIdAndUpdate(userId, { city, email: email.toLowerCase(), password: newPassword, avatar: newAvatar, number, status, country, membership, lastName, firstName, notifications, subscriptionId })

		return res.json({
			error: false,
			message: 'Selected user has been successfully editted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editUser - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while editing the user profile, please refresh the page'
		})
	}
}

export const createUser = async (req, res) => {
	const { adminId, city, email, password, avatar, number, country, membership, lastName, firstName, notifications } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		let newAvatar = ''
		if (avatar !== undefined) {
			if (avatar.isBase64) {
				let profilePic = avatar.image
				const imageName = '/' + new Date().getTime().toString() + '.png'
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
				const imagePath = 'public/admin_users'

				if (!fs.existsSync(imagePath))
					fs.mkdirSync(imagePath)

				fs.writeFile(imagePath + imageName, base64Data, 'base64', async (error) => {
					if (error) {
						await Logs.create({
							name: 'Create User',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'createUser - Admin',
							description: error.message || '',
							note: 'Maybe no space in server storage or we ran it ran out of memory?'
						})

						return res.json({
							error: true,
							message: 'Error uploading the profile picture to the server, please try again'
						})
					}
				})

				newAvatar = Constants.SERVER_URL + '/' + imagePath + imageName
			}
		}

		const newPassword = await hash(password, 9)

		await Users.create({ city, email: email.toLowerCase(), password: newPassword, avatar: newAvatar, number, country, membership, lastName, firstName, notifications })

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 })

		return res.json({
			error: false,
			message: 'A new user has successfully been created'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUser - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user account, please refresh the page'
		})
	}
}

export const messageUsers = async (req, res) => {
	const { adminId, emails, subject, message } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		onSendEmailMessage(emails, subject, message)

		return res.json({
			error: false,
			message: 'The emails have successfully been sent'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUser - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user account, please refresh the page'
		})
	}
}

export const fetchFreeSignals = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const freeSignals = await FreeSignals.find({})

		return res.json({
			error: false,
			data: freeSignals.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchFreeSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the free signals, please refresh the page'
		})
	}
}

export const fetchSignals = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const signals = await Signals.find({})

		return res.json({
			error: false,
			data: signals.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		})
	}
}

export const deleteSignals = async (req, res) => {
	const { adminId, signals } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const statistics = await Statistics.findOne({})

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each]

			await Signals.findByIdAndDelete(signal)
			await Statistics.findByIdAndUpdate(statistics._id, { totalSignals: parseInt(statistics.totalSignals) - 1 })
		}

		return res.json({
			error: false,
			message: 'Selected signal(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the signal(s), please refresh the page'
		})
	}
}

export const editSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Signals.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice })

		const date = new Date(new Date().getTime() + 5000)

		Schedule.scheduleJob(date, async () => {
			let emails = []
			const users = await Users.find({ 'notifications.alerts.email': true })

			users.forEach(user => {
				if (user.membership !== 'Free Membership')
					emails.push(user.email)
			})

			onSendEmailAlerts(`Alerts - Update to ${name} Signal`, { name, status, stopLoss, entryPrice }, emails)
		})

		return res.json({
			error: false,
			message: 'Selected signal have been successfully edited'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editSignal - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while editing the signal, please refresh the page'
		})
	}
}

export const createSignal = async (req, res) => {
	const { adminId, name, status, stopLoss, entryPrice } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Signals.create({ name, status, stopLoss, entryPrice })

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalSignals: parseInt(statistics.totalSignals) + 1 })

		const date = new Date(new Date().getTime() + 5000)

		Schedule.scheduleJob(date, async () => {
			let emails = []
			const users = await Users.find({ 'notifications.alerts.email': true })

			users.forEach(user => {
				if (user.membership !== 'Free Membership')
					emails.push(user.email)
			})

			onSendEmailAlerts(`Alerts - New ${name} Signal`, { name, status, stopLoss, entryPrice }, emails)
		})

		return res.json({
			error: false,
			message: 'Signal have been successfully created'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSignal - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the signal, please refresh the page'
		})
	}
}

export const deleteFreeSignals = async (req, res) => {
	const { adminId, signals } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const statistics = await Statistics.findOne({})

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each]

			await FreeSignals.findByIdAndDelete(signal)
			await Statistics.findByIdAndUpdate(statistics._id, { totalFreeSignals: parseInt(statistics.totalFreeSignals) - 1 })
		}

		return res.json({
			error: false,
			message: 'Selected free signal(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteFreeSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the free signal(s), please refresh the page'
		})
	}
}

export const editFreeSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await FreeSignals.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice })

		const date = new Date(new Date().getTime() + 5000)

		Schedule.scheduleJob(date, async () => {
			let emails = []
			const users = await Users.find({ 'notifications.alerts.email': true })

			users.forEach(user => {
				if (user.membership === 'Free Membership')
					emails.push(user.email)
			})

			onSendEmailAlerts(`Free Alerts - Update to ${name} Signal`, { name, status, stopLoss, entryPrice }, emails)
		})

		return res.json({
			error: false,
			message: 'Selected free signal have been successfully edited'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editFreeSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while editing the free signal, please refresh the page'
		})
	}
}

export const createFreeSignal = async (req, res) => {
	const { adminId, name, status, stopLoss, entryPrice } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await FreeSignals.create({ name, status, stopLoss, entryPrice })

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalFreeSignals: parseInt(statistics.totalFreeSignals) + 1 })

		const date = new Date(new Date().getTime() + 5000)

		Schedule.scheduleJob(date, async () => {
			let emails = []
			const users = await Users.find({ 'notifications.alerts.email': true })

			users.forEach(user => {
				if (user.membership === 'Free Membership')
					emails.push(user.email)
			})

			onSendEmailAlerts(`Free Alerts - New ${name} Signal`, { name, status, stopLoss, entryPrice }, emails)
		})

		return res.json({
			error: false,
			message: 'Free signal have been successfully created'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createFreeSignal - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while creating the free signal, please refresh the page'
		})
	}
}

export const fetchStatistics = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const statistics = await Statistics.findOne({})
		if (statistics)
			return res.json({
				error: false,
				data: statistics
			})

		return res.json({
			error: false,
			data: await Statistics.create({})
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchStatistics - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the statistics, please refresh the page'
		})
	}
}

export const fetchLogs = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const logs = await Logs.find({})

		return res.json({
			error: false,
			data: logs.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchLogs - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		})
	}
}

export const deleteLogs = async (req, res) => {
	const { adminId, logs } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		for (let each = 0; each < logs.length; each++) {
			const log = logs[each]

			await Logs.findByIdAndDelete(log)
		}

		return res.json({
			error: false,
			message: 'Selected log(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSignals - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the signal(s), please refresh the page'
		})
	}
}

export const fetchQuestions = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const questions = await Questions.find({})

		return res.json({
			error: false,
			data: questions.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchQuestions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		})
	}
}

export const replyQuestion = async (req, res) => {
	const { adminId, questionId, email, message } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		onSendEmailQuestion(email, message)

		await Questions.findByIdAndUpdate(questionId, { isReplied: true })

		return res.json({
			error: false,
			message: 'Your message has been emailed to the recipent successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchQuestions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		})
	}
}

export const deleteQuestions = async (req, res) => {
	const { adminId, questions } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		for (let each = 0; each < questions.length; each++) {
			const question = questions[each]

			await Questions.findByIdAndDelete(question)
		}

		return res.json({
			error: false,
			message: 'Selected message(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		})
	}
}

export const fetchSponsors = async (req, res) => {
	const { adminId } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		const sponsors = await Sponsors.find({})

		return res.json({
			error: false,
			data: sponsors.reverse()
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSponsors - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		})
	}
}

export const deleteSponsors = async (req, res) => {
	const { adminId, sponsors } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		for (let each = 0; each < sponsors.length; each++) {
			const sponsor = sponsors[each]

			await Sponsors.findByIdAndDelete(sponsor)
		}

		return res.json({
			error: false,
			message: 'Selected sponsorship code(s) have been successfully deleted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSponsors - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		})
	}
}

export const editSponsors = async (req, res) => {
	const { adminId, sponsorId, code, duration, durationPick } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Sponsors.findByIdAndUpdate(sponsorId, { code, duration, durationPick })

		return res.json({
			error: false,
			message: 'Selected sponsor code have been successfully editted'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		})
	}
}

export const createSponsors = async (req, res) => {
	const { adminId, code, duration, durationPick } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Sponsors.create({ code, duration, durationPick })

		return res.json({
			error: false,
			message: 'Selected sponsor code has been created successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		})
	}
}