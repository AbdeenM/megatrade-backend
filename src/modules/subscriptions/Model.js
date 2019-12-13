/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const SubscriptionsSchema = new Schema(
	{
		image: {
			type: String
		},
		price: {
			type: String
		},
		title: {
			type: String
		},
		planId: {
			String: String
		},
		validity: {
			type: String
		},
		description: {
			type: String
		}
	}
)

export default mongoose.model('subscriptions', SubscriptionsSchema)
