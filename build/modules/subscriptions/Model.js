'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscriptionsSchema = new _mongoose.Schema({
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
});

exports.default = _mongoose2.default.model('subscriptions', SubscriptionsSchema);