import fs from 'fs'
import crypto from 'crypto'
import { hash, compare } from 'bcrypt'

import Users from './Model'
import Logs from '../logs/Model'
import Signals from '../signals/Model'
import Sponsors from '../sponsors/Model'
import Schedular from '../schedulars/Model'
import Statistics from '../statistics/Model'
import Constants from '../../config/Constants'
import Dashobard from '../userDashboard/Model'
import FreeSignals from '../freeSignals/Model'
import Subscriptions from '../subscriptions/Model'
import { scheduleRemoveUserSponsorship } from '../../services/Schedular'
import { onSendEmailWelcome, onSendEmailResetPassword } from '../../services/Email'
import { paypalAccessTocken, cancelPayPalSubscription } from '../../services/PayPal'

export const register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body

	const newPassword = await hash(password, 9)

	try {
		const user = await Users.findOne({ email: email.toLowerCase() })
		if (user) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			})
		}

		const userData = await Users.create({ firstName, lastName, email: email.toLowerCase(), password: newPassword })

		const statistics = await Statistics.findOne({})

		await Statistics.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 })

		onSendEmailWelcome(email, firstName)

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: userData
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'register',
			description: error.message || ''
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
		const user = await Users.findOne({ email: email.toLowerCase() })
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'login',
			description: error.message || ''
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
		const user = await Users.findOne({ email: email.toLowerCase() })
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'socialLogin',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		})
	}
}

export const forgotPassword = async (req, res) => {
	const { email } = req.body

	try {
		const checkEmail = await Users.findOne({ email })
		if (!checkEmail) {
			return res.json({
				error: true,
				message: 'There is no account registered with this email, please check the email and try again'
			})
		}

		const token = crypto.randomBytes(20).toString('hex')

		await Users.findOneAndUpdate({ email }, {
			resetPassword: {
				token,
				expiry: Date.now() + 360000
			}
		})

		onSendEmailResetPassword(email, token)

		return res.json({
			error: false,
			message: 'An email has been sent your email with instruction on reseting your password, Thank you'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'forgotPassword',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		})
	}
}

export const resetPassword = async (req, res) => {
	const { token, password } = req.body

	try {
		const checkToken = await Users.findOne({ 'resetPassword.token': token, 'resetPassword.expiry': { $gt: Date.now() } })
		if (!checkToken) {
			return res.json({
				error: true,
				message: 'This link is invalid or has expired, please contact us if you need further support'
			})
		}

		const newPassword = await hash(password, 9)

		await Users.findByIdAndUpdate(checkToken._id, { password: newPassword })

		return res.json({
			error: false,
			message: 'Your password has been reset successfully'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'resetPassword',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchAccount',
			description: error.message || ''
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
			await Users.findByIdAndUpdate(userId, { email: email.toLowerCase() })

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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'updateAccount',
			description: error.message || ''
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchStatistics',
			description: error.message || ''
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSubscriptions',
			description: error.message || ''
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
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSubscription',
			description: error.message || ''
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

		if (user.membership !== 'Sponsored Membership') {
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
		}

		await Users.findByIdAndUpdate(userId, {
			subscriptionId: 'FREE',
			membershipAmount: '0.00',
			membership: 'Free Membership'
		})

		if (user.membership === 'Sponsored Membership') {
			const statistics = await Statistics.findOne({})
			await Statistics.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) - 1 })
		} else {
			const statistics = await Statistics.findOne({})
			await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
		}

		return res.json({
			error: false,
			message: 'You are now on the free memebership package'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'cancelSubscription',
			description: error.message || ''
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

		let signalsData = []
		if (user.membership !== 'Free Membership') {
			signalsData = await Signals.find({})
			signalsData = signalsData.reverse()
		}

		// Fetch free signals mixed with premium signals
		// if (user.membership === 'Free Membership') {
		// 	const promoSignals = await Signals.find({})

		// 	signalsData = await FreeSignals.find({})
		// 	signalsData = signalsData.reverse()

		// 	signalsData.splice(2, 0, {
		// 		name: promoSignals.reverse()[0].name,
		// 		createAt: promoSignals.reverse()[0].createAt
		// 	})
		// 	signalsData.splice(3, 0, {
		// 		name: promoSignals.reverse()[1].name,
		// 		createAt: promoSignals.reverse()[1].createAt
		// 	})
		// 	signalsData.splice(7, 0, {
		// 		name: promoSignals.reverse()[2].name,
		// 		createAt: promoSignals.reverse()[2].createAt
		// 	})
		// 	signalsData.splice(9, 0, {
		// 		name: promoSignals.reverse()[3].name,
		// 		createAt: promoSignals.reverse()[3].createAt
		// 	})
		// } else {
		// 	signalsData = await Signals.find({})
		// 	signalsData = signalsData.reverse()
		// }

		return res.json({
			error: false,
			data: signalsData
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}

export const checkSponsor = async (req, res) => {
	const { userId, code } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		if (user.usedCodes.includes(code))
			return res.json({
				error: false,
				data: {
					code: '',
					duration: '',
					durationPick: '',
					message: 'You have used this code before'
				}
			})

		const codeDetails = await Sponsors.findOne({ code })
		if (codeDetails) {
			return res.json({
				error: false,
				data: {
					message: '',
					code: codeDetails.code,
					duration: codeDetails.duration,
					durationPick: codeDetails.durationPick
				}
			})
		}

		return res.json({
			error: false,
			data: {
				code: '',
				duration: '',
				durationPick: '',
				message: 'The code you entered is invalid or does not exist'
			}
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		})
	}
}

export const getSponsor = async (req, res) => {
	const { userId, code, duration, durationPick } = req.body

	try {
		const user = await Users.findById(userId)
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			})
		}

		await Users.findByIdAndUpdate(userId, {
			subscriptionId: code,
			membership: 'Sponsored Membership',
			membershipAmount: '0.00',
			$push: {
				usedCodes: code,
				membershipHistory: {
					$each: [{
						orderId: '-',
						price: '0.00',
						nextBilling: '-',
						subscriptionId: code,
						startTime: new Date(),
						package: 'Sponsored Membership'
					}]
				}
			}
		})

		const statistics = await Statistics.findOne({})
		await Statistics.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) + 1 })

		let time = 0
		switch (durationPick) {
			case 'DAY':
				time = 86400000
				break
			case 'WEEK':
				time = 604800000
				break
			case 'MONTH':
				time = 2628000000
				break
			default:
				time = 86400000
				break
		}

		let schedule
		const multiplier = parseInt(duration)
		const totalTime = multiplier * time
		const date = new Date(new Date().getTime() + totalTime)

		schedule = await Schedular.findOneAndUpdate({ task: 'remove-sponsorship' }, {
			$push: {
				jobs: {
					$each: [{
						userId,
						time: date,
						pending: true
					}]
				}
			}
		})

		schedule = await Schedular.findOne({ task: 'remove-sponsorship' })
		const schedularId = schedule.jobs[schedule.jobs.length - 1]._id
		scheduleRemoveUserSponsorship(userId, date, schedularId)

		return res.json({
			error: false,
			message: 'You are now on the sponsored memebership package'
		})
	} catch (error) {
		await Logs.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'getSponsor',
			description: error.message || ''
		})

		return res.json({
			error: true,
			message: 'Something went wrong while activating your sponsored membership, please refresh the page'
		})
	}
}