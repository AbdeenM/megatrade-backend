/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const SponsorsSchema = new Schema(
	{
		code: {
			type: String
		},
		duration: {
			type: String
		},
		durationPick: {
			type: String
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
)

export default mongoose.model('sponsors', SponsorsSchema)
