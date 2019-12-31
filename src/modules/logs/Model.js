/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const LogsSchema = new Schema(
    {
        name: {
            type: String
        },
        event: {
            type: String
        },
        summary: {
            type: String
        },
        function: {
            type: String
        },
        description: {
            type: String
        },
        createdAt: {
            type: String,
            default: new Date().toString()
        },
        note: {
            type: String
        }
    }
)

export default mongoose.model('logs', LogsSchema)
