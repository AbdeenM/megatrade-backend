import mongoose, { Schema } from 'mongoose'

const StatisticsSchema = new Schema(
    {
        totalUsers: {
            type: Number,
            default: 0
        },
        totalLogins: {
            type: Number,
            default: 0
        },
        totalSignals: {
            type: Number,
            default: 0
        },
        totalFreeSignals: {
            type: Number,
            default: 0
        },
        totalPayingUsers: {
            type: Number,
            default: 0
        },
        totalSponsoredUsers: {
            type: Number,
            default: 0
        }
    }
)

export default mongoose.model('statistics', StatisticsSchema)
