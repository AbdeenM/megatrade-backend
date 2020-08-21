import mongoose, { Schema } from 'mongoose'

const QuestionsSchema = new Schema(
	{
		name: {
			type: String
		},
		isReplied: {
			type: Boolean,
			default: false
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
