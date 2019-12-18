/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import fs from 'fs'
import Twitter from 'twitter'

import Admin from '../admin/Model'
import Users from '../users/Model'

export const twitterPost = async (req, res) => {
    const { adminId, post, image } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error updating. Your account is not found, either deactivated or deleted'
            })
        }

        const twitter = new Twitter({
            consumer_key: 'Zm9bZkZxbSegqgK5Syly1pug7',
            access_token_secret: 'TShK7EUWSkS2SeK8ccX9ytXu0fqLnWdo5NImO2y65oUZi',
            consumer_secret: 'Uebr1GB83Xsr9CxdofP3hvumH6GdwFMpO4vorO5VGtPTuyc7Du',
            access_token_key: '1176993477898510339-Dg0OCLbCjgZ9nEalPPO0mevOyjUuiM'
        })

        if (image.length > 1) {
            const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '')

            twitter.post('media/upload', { media_data: base64Data }, (error, media, response) => {
                if (error)
                    return res.json({
                        error: true,
                        message: 'Failed to upload the image to twitter, please try again'
                    })

                twitter.post('statuses/update', { status: post, media_ids: media.media_id_string }, (error, tweet, response) => {
                    if (error)
                        return res.json({
                            error: true,
                            message: 'Failed to post the tweet, please try again'
                        })

                    return res.json({
                        error: false,
                        message: 'Successfully posted to twitter'
                    })
                })
            })
        } else
            twitter.post('statuses/update.json', { status: post }, (error, tweet, response) => {
                if (error)
                    return res.json({
                        error: true,
                        message: 'Failed to post the tweet, please try again'
                    })

                return res.json({
                    error: false,
                    message: 'Successfully posted to twitter'
                })
            })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while posting the tweet, please refresh the page and try again'
        })
    }
}

export const paypalPaymentFail = async (req, res) => {
    const { resource } = req.body

    const subscriptionId = resource.id

    const user = await Users.findOne({ subscriptionId })
    if (user) {
        await Users.findByIdAndUpdate(user._id, {
            subscriptionId: 'FREE',
            membershipAmount: '0.00',
            membership: 'Free Membership'
        })
    }

    fs.writeFile('/public/logs.txt', JSON.stringify(resource), (error) => console.log(error))

    return res.sendStatus(200)
}