import mongoose, { Schema } from 'mongoose'

const ChatsSchema = new Schema(
    {
        chatId: {
            type: String
        },
        messages: [{
            isSystem: {
                type: Boolean,
                default: false
            },
            isAdmin: {
                type: Boolean,
                default: false
            },
            userId: {
                type: String
            },
            message: {
                type: String
            },
            fullName: {
                type: String
            },
            avatar: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }
)

export default mongoose.model('chats', ChatsSchema)