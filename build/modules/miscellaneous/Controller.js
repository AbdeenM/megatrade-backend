'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const twitterPost = exports.twitterPost = async (req, res) => {
    const { adminId, post, image } = req.body;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            });
        }

        const data = await axios.post('https://api.twitter.com/1.1/statuses/update.json', {
            status: post,
            'oauth_version': '1.0',
            'oauth_nonce': '94XbJ9XL2GZ',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_signature': 'aSgE6QXtQCw5PHVO3NgmTmAx6ag',
            'oauth_consumer_key': 'Zm9bZkZxbSegqgK5Syly1pug7',
            'oauth_token': '1176993477898510339-Dg0OCLbCjgZ9nEalPPO0mevOyjUuiM'
        }, {
            headers: {
                'Authorization': 'OAuth'
            }
        });

        return res.json({
            error: false,
            message: data
        });
    } catch (error) {
        return res.json({
            error: true,
            message: 'Failed to post on twitter, please try again'
        });
    }
};