import mongoose, { Schema } from 'mongoose'

const AdminSchema = new Schema(
    {
        city: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
        number: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        lastName: {
            type: String,
            default: ''
        },
        password: {
            type: String
        },
        firstName: {
            type: String,
            default: ''
        }
    }
)

export default mongoose.model('admin', AdminSchema)
