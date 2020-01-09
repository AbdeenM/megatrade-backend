/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
	{
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
	}
)

export default mongoose.model('users', UserSchema)
