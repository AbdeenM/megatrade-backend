import mongoose, { Schema } from 'mongoose'

const SignalsSchema = new Schema(
    {
        name: {
            type: String
        },
        status: {
            type: String
        },
        stopLoss: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        entryPrice: {
            type: String
        }
    }
)

export default mongoose.model('signals', SignalsSchema)
