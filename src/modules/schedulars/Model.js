import mongoose, { Schema } from 'mongoose'

const SchedularsSchema = new Schema(
	{
		task: {
			type: String
		},
		jobs: [{
			userId: {
				type: String
			},
			time: {
				type: String
			},
			pending: {
				type: Boolean,
				default: true
			},
			note: {
				type: String
			}
		}]
	}
)

export default mongoose.model('schedulars', SchedularsSchema)