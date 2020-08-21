import mongoose, { Schema } from 'mongoose'

const SponsorsSchema = new Schema(
	{
		code: {
			type: String
		},
		duration: {
			type: String
		},
		durationPick: {
			type: String
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
)

export default mongoose.model('sponsors', SponsorsSchema)
