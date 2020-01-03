'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onSendEmailQuestion = exports.onSendEmailAlerts = undefined;

var _nodemailer = require('nodemailer');

const onSendEmailAlerts = exports.onSendEmailAlerts = async (title, data, emails) => {
	const transporter = (0, _nodemailer.createTransport)({
		pool: true,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'alerts@megatrade.world',
			pass: 'MegaTrade@World9'
		}
	});

	let messages = [];
	emails.forEach(email => {
		messages.push({
			from: '"Mega Trade" <alerts@megatrade.world>',
			to: email,
			subject: title,
			text: `Signal ${data.name} has been updated to ${data.status} at stop loss of ${data.stopLoss} and entry price of ${data.entryPrice}`
		});
	});

	for (let each = 0; each < messages.length; each++) {
		const message = messages[each];
		await transporter.sendMail(message);
	}

	transporter.close();
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */

const onSendEmailQuestion = exports.onSendEmailQuestion = async (email, message) => {
	const transporter = (0, _nodemailer.createTransport)({
		pool: false,
		host: 'megatrade.world',
		port: 465,
		secure: true,
		auth: {
			user: 'info@megatrade.world',
			pass: 'MegaTrade@123'
		}
	});

	await transporter.sendMail({
		from: '"Mega Trade" <info@megatrade.world>',
		to: email,
		subject: 'Reply to your enquiry',
		text: message
	});

	transporter.close();
};