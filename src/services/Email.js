/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { createTransport } from 'nodemailer'

export const onSendEmailAlerts = async (title, data, emails) => {
	const transporter = createTransport({
		pool: true,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'alerts@megatrade.world',
			pass: 'MegaTrade@World9'
		}
	})

	let messages = []
	emails.forEach(email => {
		messages.push({
			from: '"Mega Trade" <alerts@megatrade.world>',
			to: email,
			subject: title,
			text: `Signal ${data.name} has been updated to ${data.status} at stop loss of ${data.stopLoss} and entry price of ${data.entryPrice}`
		})
	})

	for (let each = 0; each < messages.length; each++) {
		const message = messages[each]
		await transporter.sendMail(message)
	}

	transporter.close()
}

export const onSendEmailQuestion = async (email, message) => {
	const transporter = createTransport({
		pool: false,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'info@megatrade.world',
			pass: 'MegaTrade@World9'
		}
	})

	await transporter.sendMail({
		from: '"Mega Trade" <info@megatrade.world>',
		to: email,
		subject: 'Reply to your enquiry',
		text: message
	})

	transporter.close()
}

export const onSendEmailWelcome = async (email, name) => {
	const traderName = name.length < 3 ? 'Trader' : name

	const transporter = createTransport({
		pool: false,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'info@megatrade.world',
			pass: 'MegaTrade@World9'
		}
	})

	await transporter.sendMail({
		from: '"Mega Trade" <info@megatrade.world>',
		to: email,
		subject: 'Welcome to Mega Trade!',
		text: `Dear ${traderName},

Thank you for subscribing to MegaTrade, we are glad to have you as part of our community and will be sure to respond to any of your queries as soon as we can. 
		
Stay tuned for your trade signals soon!
		
Best Regards,
Mega Trade Team`
	})

	transporter.close()
}

export const onSendEmailResetPassword = async (email, token) => {
	const transporter = createTransport({
		pool: false,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'info@megatrade.world',
			pass: 'MegaTrade@World9'
		}
	})

	await transporter.sendMail({
		from: '"Mega Trade" <info@megatrade.world>',
		to: email,
		subject: 'Reset Password',
		text: `Dear MegaTrader,

You are recieving this because you (or someone else) have requested to reset the password for your account.
Please visit our site using the link below to complete the reset:

https://megatrade.world/reset/${token}

This link is only valid for one hour from sending this email for security, if you did not request a password reset ignore this email and your password will remain unchanged.

Thank you and Happy Trading
Best Regards,
Mega Trade Team`
	})

	transporter.close()
}