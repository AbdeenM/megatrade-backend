'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cancelPayPalSubscription = exports.paypalAccessTocken = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Constants = require('../config/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const paypalAccessTocken = exports.paypalAccessTocken = async () => {
	try {
		const { data } = await (0, _axios2.default)({
			method: 'POST',
			url: `${_Constants2.default.PAYPAL_URL}v1/oauth2/token`,
			params: {
				grant_type: 'client_credentials'
			},
			headers: {
				'Accept-Language': 'en_US',
				'Accept': 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			},
			auth: {
				username: _Constants2.default.PAYPAL_CLIENT_ID,
				password: _Constants2.default.PAYPAL_CLIENT_SECRET
			}
		});

		return {
			error: false,
			data
		};
	} catch (error) {
		return {
			error: true,
			message: 'Something went wrong while getting your token, please refresh the page and try again'
		};
	}
};

const cancelPayPalSubscription = exports.cancelPayPalSubscription = async (token, id) => {
	console.log('======================================================================');
	console.log('===> ', token, '===> ', id);

	try {
		const data = await (0, _axios2.default)({
			method: 'POST',
			url: `${_Constants2.default.PAYPAL_URL}v1/billing/subscriptions/${id}/cancel`,
			params: {
				reason: 'Want to get adventurous'
			},
			headers: {
				'content-type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});

		console.log('======================================================================');
		console.log(data);

		return {
			error: false
		};
	} catch (error) {
		return {
			error: true,
			message: 'Failed to cancel your paypal subscription, please refresh the page and try again'
		};
	}
};