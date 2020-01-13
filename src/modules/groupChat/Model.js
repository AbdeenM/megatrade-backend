/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const GroupChatSchema = new Schema(
    {
        message: {
            type: String
        },
        userName: {
            type: String
        },
        avatar: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export default mongoose.model('groupChat', GroupChatSchema)