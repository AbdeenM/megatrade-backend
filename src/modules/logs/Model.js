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
