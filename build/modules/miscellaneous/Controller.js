'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.paypalPaymentSuspended = exports.twitterPost = undefined;

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _Model = require('../admin/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../users/Model');

var _Model4 = _interopRequireDefault(_Model3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const twitterPost = exports.twitterPost = async (req, res) => {
    const { adminId, post, image } = req.body;

    try {
        const admin = await _Model2.default.findById(adminId);
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error updating. Your account is not found, either deactivated or deleted'
            });
        }

        const twitter = new _twitter2.default({
            consumer_key: 'Zm9bZkZxbSegqgK5Syly1pug7',
            access_token_secret: 'TShK7EUWSkS2SeK8ccX9ytXu0fqLnWdo5NImO2y65oUZi',
            consumer_secret: 'Uebr1GB83Xsr9CxdofP3hvumH6GdwFMpO4vorO5VGtPTuyc7Du',
            access_token_key: '1176993477898510339-Dg0OCLbCjgZ9nEalPPO0mevOyjUuiM'
        });

        if (image.length > 1) {
            const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            twitter.post('media/upload', { media_data: base64Data }, (error, media, response) => {
                if (error) return res.json({
                    error: true,
                    message: 'Failed to upload the image to twitter, please try again'
                });

                twitter.post('statuses/update', { status: post, media_ids: media.media_id_string }, (error, tweet, response) => {
                    if (error) return res.json({
                        error: true,
                        message: 'Failed to post the tweet, please try again'
                    });

                    return res.json({
                        error: false,
                        message: 'Successfully posted to twitter'
                    });
                });
            });
        } else twitter.post('statuses/update.json', { status: post }, (error, tweet, response) => {
            if (error) return res.json({
                error: true,
                message: 'Failed to post the tweet, please try again'
            });

            return res.json({
                error: false,
                message: 'Successfully posted to twitter'
            });
        });
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while posting the tweet, please refresh the page and try again'
        });
    }
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */

const paypalPaymentSuspended = exports.paypalPaymentSuspended = async (req, res) => {
    const { resource, event_type, summary } = req.body;

    // switch (event_type) {
    //     case 'value':

    //         break

    //     default:
    //         break
    // }

    // const subscriptionId = resource.id

    // const user = await Users.findOne({ subscriptionId })
    // if (user) {
    //     await Users.findByIdAndUpdate(user._id, {
    //         subscriptionId: 'FREE',
    //         membershipAmount: '0.00',
    //         membership: 'Free Membership'
    //     })
    // }

    await _Model4.default.create({ email: JSON.stringify(resource), firstName: event_type, lastName: summary });

    return res.sendStatus(200);
};