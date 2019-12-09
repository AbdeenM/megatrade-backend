/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const FreeSignalsSchema = new Schema(
	{
		name: {
			type: String
		},
		status: {
			type: String
		},
		stopLoss: {
			type: String
		},
		createdAt: {
			type: String
		},
		entryPrice: {
			type: String
		}
	}
)

export default mongoose.model('freeSignals', FreeSignalsSchema)
