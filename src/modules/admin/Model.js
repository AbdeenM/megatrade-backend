/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const AdminSchema = new Schema(
    {
        city: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
        number: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        password: {
            type: String
        },
        firstName: {
            type: String,
            default: ''
        }
    }
)

export default mongoose.model('admin', AdminSchema)
