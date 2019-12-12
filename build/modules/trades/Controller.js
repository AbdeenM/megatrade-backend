'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchStatistics = undefined;

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../users/Model');

var _Model4 = _interopRequireDefault(_Model3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const fetchStatistics = exports.fetchStatistics = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model4.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const trades = await _Model2.default.findOne({});

		return res.json({
			error: false,
			data: trades
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting trade statistics, please refresh the page'
		});
	}
};