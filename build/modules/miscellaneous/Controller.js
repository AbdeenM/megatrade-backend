'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.paypalSubscriptionSusbended = exports.paypalPaymentSuspended = exports.paypalWebhookLive = exports.paypalWebhookSandbox = exports.twitterPost = undefined;

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _Model = require('../admin/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../users/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../statistics/Model');

var _Model6 = _interopRequireDefault(_Model5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const twitterPost = exports.twitterPost = async (req, res) => {
	const { adminId, post, image } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			});
		}

		const twitter = new _twitter2.default({
			consumer_key: 'Zm9bZkZxbSegqgK5Syly1pug7',
			access_token_secret: 'TShK7EUWSkS2SeK8ccX9ytXu0fqLnWdo5NImO2y65oUZi',
			consumer_secret: 'Uebr1GB83Xsr9CxdofP3hvumH6GdwFMpO4vorO5VGtPTuyc7Du',
			access_token_key: '1176993477898510339-Dg0OCLbCjgZ9nEalPPO0mevOyjUuiM'
		});

		if (image.length > 1) {
			const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

			twitter.post('media/upload', { media_data: base64Data }, (error, media, response) => {
				if (error) return res.json({
					error: true,
					message: 'Failed to upload the image to twitter, please try again'
				});

				twitter.post('statuses/update', { status: post, media_ids: media.media_id_string }, (error, tweet, response) => {
					if (error) return res.json({
						error: true,
						message: 'Failed to post the tweet, please try again'
					});

					return res.json({
						error: false,
						message: 'Successfully posted to twitter'
					});
				});
			});
		} else twitter.post('statuses/update.json', { status: post }, (error, tweet, response) => {
			if (error) return res.json({
				error: true,
				message: 'Failed to post the tweet, please try again'
			});

			return res.json({
				error: false,
				message: 'Successfully posted to twitter'
			});
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while posting the tweet, please refresh the page and try again'
		});
	}
};

const paypalWebhookSandbox = exports.paypalWebhookSandbox = async (req, res) => {
	const { resource, event_type, summary } = req.body;

	let user;
	let subscriptionId;
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});
			}
			break;
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});

				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		default:
			break;
	}

	await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: 'Function paypalWebhookSandbox' });

	return res.sendStatus(200);
};

const paypalWebhookLive = exports.paypalWebhookLive = async (req, res) => {
	const { resource, event_type, summary } = req.body;

	let user;
	let subscriptionId;
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});

				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		default:
			break;
	}

	await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: 'Function paypalWebhookLive' });

	return res.sendStatus(200);
};

const paypalPaymentSuspended = exports.paypalPaymentSuspended = async (req, res) => {
	const { resource, event_type, summary } = req.body;

	let user;
	let subscriptionId;
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});
			}

			await _Model4.default.create({ firstName: event_type, number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});

				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		default:
			break;
	}

	await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: 'Function paypalPaymentSuspended' });

	return res.sendStatus(200);
};

const paypalSubscriptionSusbended = exports.paypalSubscriptionSusbended = async (req, res) => {
	const { resource, event_type, summary } = req.body;

	let user;
	let subscriptionId;
	switch (event_type) {
		case 'BILLING.SUBSCRIPTION.SUSPENDED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});

				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		case 'BILLING.SUBSCRIPTION.CANCELLED':
			subscriptionId = resource.id;

			user = await _Model4.default.findOne({ subscriptionId });
			if (user) {
				await _Model4.default.findByIdAndUpdate(user._id, {
					subscriptionId: 'FREE',
					membershipAmount: '0.00',
					membership: 'Free Membership'
				});

				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
			}

			await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: `Paypal says unsubscribe this id ==> ${resource.id}` });
			break;
		default:
			break;
	}

	await _Model4.default.create({ firstName: event_type, email: new Date().toString(), number: 'Function paypalSubscriptionSusbended' });

	return res.sendStatus(200);
};