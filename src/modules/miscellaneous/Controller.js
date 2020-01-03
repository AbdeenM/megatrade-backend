/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Twitter from 'twitter'

import Logs from '../logs/Model'
import Admin from '../admin/Model'
import Users from '../users/Model'
import Questions from '../questions/Model'
import NewsLetter from '../newsLetter/Model'
import Statistics from '../statistics/Model'

export const twitterPost = async (req, res) => {
	const { adminId, post, image } = req.body

	try {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			})
		}

		const twitter = new Twitter({
			consumer_key: 'Zm9bZkZxbSegqgK5Syly1pug7',
			access_token_secret: 'TShK7EUWSkS2SeK8ccX9ytXu0fqLnWdo5NImO2y65oUZi',
			consumer_secret: 'Uebr1GB83Xsr9CxdofP3hvumH6GdwFMpO4vorO5VGtPTuyc7Du',
			access_token_key: '1176993477898510339-Dg0OCLbCjgZ9nEalPPO0mevOyjUuiM'
		})

		if (image.length > 1) {
			const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '')

			twitter.post('media/upload', { media_data: base64Data }, async (error, media, response) => {
				if (error) {
					await Logs.create({
						name: 'Twitter',
						event: 'Upload media Error',
						summary: 'Failed to upload media base64 data to twitter servers',
						function: 'twitterPost',
						description: error.message,
						note: 'Maybe twitter changed their upload media end point or the twitter library is deprciated?'
					})

					return res.json({
						error: true,
						message: 'Failed to upload the image to twitter, please try again'
					})
				}

				twitter.post('statuses/update', { status: post, media_ids: media.media_id_string }, async (error, tweet, response) => {
					if (error) {
						await Logs.create({
							name: 'Twitter',
							event: 'Status Error',
							summary: 'Failed to post to twitter servers',
							function: 'twitterPost',
							description: error.message,
							note: 'Maybe twitter changed their post end point or the twitter library is deprciated?'
						})

						return res.json({
							error: true,
							message: 'Failed to post the tweet, please try again'
						})
					}

					return res.json({
						error: false,
						message: 'Successfully posted to twitter'
					})
				})
			})
		} else
			twitter.post('statuses/update.json', { status: post }, async (error, tweet, response) => {
				if (error) {
					await Logs.create({
						name: 'Twitter',
						event: 'Status Error',
						summary: 'Failed to post to twitter servers',
						function: 'twitterPost',
						description: error.message,
						note: 'Maybe twitter changed their post end point or the twitter library is deprciated?'
					})

					return res.json({
						error: true,
						message: 'Failed to post the tweet, please try again'
					})
				}

				return res.json({
					error: false,
					message: 'Successfully posted to twitter'
				})
			})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'twitterPost',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while posting the tweet, please refresh the page and try again'
		})
	}
}

export const paypalWebhookSandbox = async (req, res) => {
	const { resource, event_type, summary } = req.body

	let user
	let subscriptionId
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})
			}
			break
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})

				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
			}
			break
		default:
			break
	}

	await Logs.create({
		name: 'Paypal',
		event: 'Webhook event',
		summary: summary,
		function: 'paypalWebhookSandbox',
		description: event_type
	})

	return res.sendStatus(200)
}

export const paypalWebhookLive = async (req, res) => {
	const { resource, event_type, summary } = req.body

	let user
	let subscriptionId
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})
			}
			break
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})

				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
			}
			break
		default:
			break
	}

	await Logs.create({
		name: 'Paypal',
		event: 'Webhook event',
		summary: summary,
		function: 'paypalWebhookLive',
		description: event_type
	})

	return res.sendStatus(200)
}

export const paypalPaymentSuspended = async (req, res) => {
	const { resource, event_type, summary } = req.body

	let user
	let subscriptionId
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})
			}
			break
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})

				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
			}
			break
		default:
			break
	}

	await Logs.create({
		name: 'Paypal',
		event: 'Webhook event',
		summary: summary,
		function: 'paypalPaymentSuspended',
		description: event_type
	})

	return res.sendStatus(200)
}

export const paypalSubscriptionSusbended = async (req, res) => {
	const { resource, event_type, summary } = req.body

	let user
	let subscriptionId
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})

				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
			}
			break
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id

			user = await Users.findOne({ subscriptionId })
			if (user) {
				await Users.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				})

				const statistics = await Statistics.findOne({})

				await Statistics.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 })
			}
			break
		default:
			break
	}

	await Logs.create({
		name: 'Paypal',
		event: 'Webhook event',
		summary: summary,
		function: 'paypalSubscriptionSusbended',
		description: event_type
	})

	return res.sendStatus(200)
}

export const newsLetter = async (req, res) => {
	const { email } = req.body

	try {
		await NewsLetter.create({ email })

		return res.json({
			error: false,
			message: 'Thank you! You have successfully registered to our newsletter'
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'NewsLetter - Miscellaneous',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while adding you to the newsletter list, please try again'
		})
	}
}

export const question = async (req, res) => {
	const { name, email, phone, company, message } = req.body

	try {
		await Questions.create({ name, email, phone, company, message })

		return res.json({
			error: false,
			message: 'Thank you for the message, we will get back to you shortly'
		})
	} catch (error) {
		await Logs.create({
			name: error.name,
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'NewsLetter - Miscellaneous',
			description: error.message
		})

		return res.json({
			error: true,
			message: 'Something went wrong while sending your message, please try again'
		})
	}
}