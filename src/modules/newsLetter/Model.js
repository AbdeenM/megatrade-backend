import mongoose, { Schema } from 'mongoose'

const NewsLetterSchema = new Schema(
	{
		email: {
			type: String
		}
	}
)

export default mongoose.model('NewsLetters', NewsLetterSchema)
