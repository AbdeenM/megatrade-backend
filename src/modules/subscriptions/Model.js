import mongoose, { Schema } from 'mongoose'

const SubscriptionsSchema = new Schema(
    {
        image: {
            type: String
        },
        price: {
            type: String
        },
        title: {
            type: String
        },
        planId: {
            String: String
        },
        validity: {
            type: String
        },
        description: {
            type: String
        }
    }
)

export default mongoose.model('subscriptions', SubscriptionsSchema)
