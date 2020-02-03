/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const SchedularsSchema = new Schema(
	{
		task: {
			type: String
		},
		jobs: [{
			userId: {
				type: String
			},
			time: {
				type: String
			},
			pending: {
				type: Boolean,
				default: true
			},
			note: {
				type: String
			}
		}]
	}
)

export default mongoose.model('schedulars', SchedularsSchema)