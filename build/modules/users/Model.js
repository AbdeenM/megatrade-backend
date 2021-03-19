'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
    resetPassword: {
        token: {
            type: String
        },
        expiry: {
            type: Date
        }
    },
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
    status: {
        type: String,
        default: '30'
    },
    country: {
        type: String,
        default: ''
    },
    membership: {
        type: String,
        default: 'Free Membership'
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
    },
    membershipAmount: {
        type: String,
        default: '0.00'
    },
    subscriptionId: {
        type: String,
        default: 'FREE'
    },
    usedCodes: [{
        type: String
    }],
    membershipHistory: [{
        price: {
            type: String
        },
        package: {
            type: String
        },
        startTime: {
            type: String
        },
        nextBilling: {
            type: String
        },
        subscriptionId: {
            type: String
        }
    }],
    notifications: {
        alerts: {
            email: {
                type: Boolean,
                default: true
            },
            dashboard: {
                type: Boolean,
                default: true
            },
            phoneCalls: {
                type: Boolean,
                default: true
            },
            textMessages: {
                type: Boolean,
                default: true
            }
        },
        promotions: {
            email: {
                type: Boolean,
                default: true
            },
            dashboard: {
                type: Boolean,
                default: true
            },
            phoneCalls: {
                type: Boolean,
                default: true
            },
            textMessages: {
                type: Boolean,
                default: true
            }
        },
        partnerPromotions: {
            email: {
                type: Boolean,
                default: true
            },
            dashboard: {
                type: Boolean,
                default: true
            },
            phoneCalls: {
                type: Boolean,
                default: true
            },
            textMessages: {
                type: Boolean,
                default: true
            }
        }
    }
});

exports.default = _mongoose2.default.model('users', UserSchema);