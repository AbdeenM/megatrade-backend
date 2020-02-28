'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultSettings = undefined;

var _Model = require('../modules/chats/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../modules/schedulars/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Schedular = require('./Schedular');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultSettings = exports.defaultSettings = async () => {
	const checkChats = await _Model2.default.findOne({ chatId: 'chat-group' });
	if (!checkChats) await _Model2.default.create({ chatId: 'chat-group' });

	const checkSchedularRemoveSponsorship = await _Model4.default.findOne({ task: 'remove-sponsorship' });
	if (!checkSchedularRemoveSponsorship) await _Model4.default.create({ task: 'remove-sponsorship' });else {
		checkSchedularRemoveSponsorship.jobs.forEach(job => {
			if (job.pending) (0, _Schedular.scheduleRemoveUserSponsorship)(job.userId, job.time, job._id);
		});
	}
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */