import Chats from '../modules/chats/Model'
import Schedular from '../modules/schedulars/Model'
import { scheduleRemoveUserSponsorship } from './Schedular'

export const defaultSettings = async () => {
    const checkChats = await Chats.findOne({ chatId: 'chat-group' })
    if (!checkChats)
        await Chats.create({ chatId: 'chat-group' })

    const checkSchedularRemoveSponsorship = await Schedular.findOne({ task: 'remove-sponsorship' })
    if (!checkSchedularRemoveSponsorship)
        await Schedular.create({ task: 'remove-sponsorship' })
    else {
        checkSchedularRemoveSponsorship.jobs.forEach(job => {
            if (job.pending)
                scheduleRemoveUserSponsorship(job.userId, job.time, job._id)
        })
    }
}