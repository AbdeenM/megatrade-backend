'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultSettings = undefined;

var _Model = require('../modules/chats/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../modules/users/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../modules/schedulars/Model');

var _Model6 = _interopRequireDefault(_Model5);

var _Schedular = require('./Schedular');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const defaultSettings = exports.defaultSettings = async () => {
	const checkChats = await _Model2.default.findOne({ chatId: 'chat-group' });
	if (!checkChats) await _Model2.default.create({ chatId: 'chat-group' });

	const checkSchedularRemoveSponsorship = await _Model6.default.findOne({ task: 'remove-sponsorship' });
	if (!checkSchedularRemoveSponsorship) await _Model6.default.create({ task: 'remove-sponsorship' });else {
		checkSchedularRemoveSponsorship.jobs.forEach(job => {
			if (job.pending) (0, _Schedular.scheduleRemoveUserSponsorship)(job.userId, job.time, job._id);
		});
	}

	const allUsers = await _Model4.default.find({});
	for (let index = 0; index < allUsers.length; index++) {
		const user = allUsers[index];

		await _Model4.default.findByIdAndUpdate(user._id, { usedCodes: [] });
	}
};