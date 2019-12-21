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
		const info = await transporter.sendMail(message)
		console.log(info)
	}
	transporter.close()
}