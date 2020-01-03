/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const QuestionsSchema = new Schema(
	{
		name: {
			type: String
		},
		email: {
			type: String
		},
		number: {
			type: String,
			default: '-'
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		company: {
			type: String,
			default: '-'
		},
		message: {
			type: String
		}
	}
)

export default mongoose.model('questions', QuestionsSchema)
