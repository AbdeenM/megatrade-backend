/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const StatisticsSchema = new Schema(
    {
        totalUsers: {
            type: Number,
            default: 0
        },
        totalLogins: {
            type: Number,
            default: 0
        },
        totalSignals: {
            type: Number,
            default: 0
        },
        totalFreeSignals: {
            type: Number,
            default: 0
        },
        totalPayingUsers: {
            type: Number,
            default: 0
        },
        totalSponsoredUsers: {
            type: Number,
            default: 0
        }
    }
)

export default mongoose.model('statistics', StatisticsSchema)
