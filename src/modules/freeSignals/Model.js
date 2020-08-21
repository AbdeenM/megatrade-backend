import mongoose, { Schema } from 'mongoose'

const FreeSignalsSchema = new Schema(
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

export default mongoose.model('freeSignals', FreeSignalsSchema)
