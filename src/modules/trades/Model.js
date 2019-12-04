/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const TradesSchema = new Schema(
    {
        tradeBudget: {
            type: String,
            default: '$3,519'
        },
        totalUsers: {
            type: String,
            default: '793'
        },
        totalPips: {
            type: String,
            default: '9,769'
        },
        totalProfits: {
            type: String,
            default: '$23,940'
        }
    },
    {
        collection: 'trades',
        capped: {
            max: 1,
            size: 1024
        }
    }
)

export default mongoose.model('trades', TradesSchema)
