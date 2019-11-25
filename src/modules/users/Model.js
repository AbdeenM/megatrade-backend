/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
	{
		email: String,
		lastName: String,
		password: String,
		firstName: String
	}
)

export default mongoose.model('users', UserSchema)
