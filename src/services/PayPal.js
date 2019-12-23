/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import Axios from 'axios'

import Constants from '../config/Constants'

export const paypalAccessTocken = async () => {
	try {
		const { data } = await Axios({
			method: 'POST',
			url: `${Constants.PAYPAL_URL}v1/oauth2/token`,
			params: {
				grant_type: 'client_credentials'
			},
			headers: {
				'Accept-Language': 'en_US',
				'Accept': 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			},
			auth: {
				username: Constants.PAYPAL_CLIENT_ID,
				password: Constants.PAYPAL_CLIENT_SECRET
			}
		})

		return {
			error: false,
			data
		}
	} catch (error) {
		return {
			error: true,
			message: 'Something went wrong while getting your token, please refresh the page and try again'
		}
	}
}

export const cancelPayPalSubscription = async (token, id) => {
	console.log('======================================================================')
	console.log('===> ', token, '===> ', id)

	try {
		const data = await Axios({
			method: 'POST',
			url: `${Constants.PAYPAL_URL}/v1/billing/subscriptions/${id}/cancel`,
			params: {
				reason: 'Want to get adventurous'
			},
			headers: {
				'content-type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		})

		console.log('======================================================================')
		console.log(data)

		return {
			error: false
		}
	} catch (error) {
		return {
			error: true,
			message: 'Failed to cancel your paypal subscription, please refresh the page and try again'
		}
	}
}