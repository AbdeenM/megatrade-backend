'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.scheduleRemoveUserSponsorship = undefined;

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _Model = require('../modules/users/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../modules/schedulars/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../modules/statistics/Model');

var _Model6 = _interopRequireDefault(_Model5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const scheduleRemoveUserSponsorship = exports.scheduleRemoveUserSponsorship = async (userId, date, schedularId) => {
	_nodeSchedule2.default.scheduleJob(date, async () => {
		const user = await _Model2.default.findById(userId);
		if (user.membership === 'Sponsored Membership') {
			await _Model2.default.findByIdAndUpdate(userId, {
				subscriptionId: 'FREE',
				membershipAmount: '0.00',
				membership: 'Free Membership'
			});

			const statistics = await _Model6.default.findOne({});
			await _Model6.default.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) - 1 });

			await _Model4.default.findOneAndUpdate({ task: 'remove-sponsorship', 'jobs._id': schedularId }, { $set: { 'jobs.$.pending': false } });
		}
	});
};