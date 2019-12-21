'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cancelPayPalSubscription = exports.paypalAccessTocken = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const paypalAccessTocken = exports.paypalAccessTocken = async () => {
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.json({
                error: true,
                message: 'Error updating. Your account is not found, either deactivated or deleted'
            });
        }

        const { data } = await (0, _axios2.default)({
            method: 'POST',
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Accept-Language': 'en_US',
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: 'AUqdMKQ9m1Mg5jz05jo1DL-j8vVPrzXOH7G_LgirWrADGRRJHgq__AMqLNpWhVBnZtGhJRUuf_mSQsoB',
                password: 'EIk_28xoIGjX3erBdDliajdJfRIBdTS3QwPTf1UppzJQOberaltPiGUahMHktZlayY0Rz5CWd51Cijf8'
            }
        });

        return {
            error: false,
            data
        };
    } catch (error) {
        return {
            error: true,
            message: 'Something went wrong while getting your token, please refresh the page and try again'
        };
    }
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */

const cancelPayPalSubscription = exports.cancelPayPalSubscription = async (token, id) => {
    try {
        const data = await _axios2.default.post(`https://api.sandbox.paypal.com/v1/billing/subscriptions/${id}/cancel`, {
            reason: 'Want to get Adventurous'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            error: false,
            data
        };
    } catch (error) {
        return {
            error: true,
            message: 'Failed to cancel your paypal subscription, please refresh the page and try again'
        };
    }
};