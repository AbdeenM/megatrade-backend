'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchSignals = exports.fetchSubscriptions = exports.fetchStatistics = exports.updateAccount = exports.fetchAccount = exports.socialLogin = exports.login = exports.register = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bcrypt = require('bcrypt');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../signals/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../statistics/Model');

var _Model6 = _interopRequireDefault(_Model5);

var _Constants = require('../../config/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Model7 = require('../userDashboard/Model');

var _Model8 = _interopRequireDefault(_Model7);

var _Model9 = require('../freeSignals/Model');

var _Model10 = _interopRequireDefault(_Model9);

var _Model11 = require('../subscriptions/Model');

var _Model12 = _interopRequireDefault(_Model11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const register = exports.register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const newPassword = await (0, _bcrypt.hash)(password, 9);

	try {
		const user = await _Model2.default.findOne({ email });
		if (user) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			});
		}

		const userData = await _Model2.default.create({ firstName, lastName, email, password: newPassword });

		const statistics = await _Model6.default.findOne({});

		await _Model6.default.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 });

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: userData
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while registering your account, please refresh the page and try again'
		});
	}
}; /* **************************************************************************
    * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
    * Unauthorized copying of this file, via any medium is strictly prohibited
    * Proprietary and confidential
    * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
    ************************************************************************** */

const login = exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await _Model2.default.findOne({ email });
		if (!user) {
			return res.json({
				error: true,
				message: 'The email you entered does not seem to be registered, please check if you entered it correct'
			});
		}

		await (0, _bcrypt.compare)(password, user.password, async (error, doesMatch) => {
			if (doesMatch) {
				const statistics = await _Model6.default.findOne({});

				await _Model6.default.findByIdAndUpdate(statistics._id, { totalLogins: parseInt(statistics.totalLogins) + 1 });

				return res.json({
					error: false,
					message: 'Logged in to your account successfully',
					data: user
				});
			} else return res.json({
				error: true,
				message: 'Wrong password, please try again'
			});
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		});
	}
};

const socialLogin = exports.socialLogin = async (req, res) => {
	const { email, firstName, lastName, avatar } = req.body;

	try {
		const user = await _Model2.default.findOne({ email });
		if (user) {
			return res.json({
				error: false,
				message: 'Logged in to your account successfully',
				data: user
			});
		}

		const newUser = await _Model2.default.create({ email, firstName, lastName, avatar });

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: newUser
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		});
	}
};

const fetchAccount = exports.fetchAccount = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		return res.json({
			error: false,
			data: user
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		});
	}
};

const updateAccount = exports.updateAccount = async (req, res) => {
	const { userId, city, email, avatar, number, country, lastName, password, firstName, notifications } = req.body;

	try {
		let status = 0;
		let user = await _Model2.default.findById(userId);

		if (!user) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			});
		}

		if (city !== undefined) await _Model2.default.findByIdAndUpdate(userId, { city });

		if (email !== undefined) await _Model2.default.findByIdAndUpdate(userId, { email });

		if (number !== undefined) await _Model2.default.findByIdAndUpdate(userId, { number });

		if (country !== undefined) await _Model2.default.findByIdAndUpdate(userId, { country });

		if (lastName !== undefined) await _Model2.default.findByIdAndUpdate(userId, { lastName });

		if (firstName !== undefined) await _Model2.default.findByIdAndUpdate(userId, { firstName });

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image;
				const imageName = '/' + new Date().getTime().toString() + '.png';
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
				const imagePath = `public/profile_pictures/${userId}`;

				if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', error => console.log(error));

				profilePic = _Constants2.default.SERVER_URL + imagePath + imageName;

				await _Model2.default.findByIdAndUpdate(userId, { avatar: profilePic });
			}
		}

		if (notifications !== undefined) await _Model2.default.findByIdAndUpdate(userId, { notifications });

		if (password !== undefined) {
			const newPassword = await (0, _bcrypt.hash)(password, 9);
			await _Model2.default.findByIdAndUpdate(userId, { password: newPassword });
		}

		user = await _Model2.default.findById(userId);

		if (user.notifications) status += 10;

		if (user.city.length > 0) status += 10;

		if (user.email.length > 0) status += 10;

		if (user.avatar.length > 0) status += 10;

		if (user.number.length > 0) status += 10;

		if (user.country.length > 0) status += 10;

		if (user.lastName.length > 0) status += 10;

		if (user.firstName.length > 0) status += 10;

		if (user.membership !== 'Free Membership') status += 20;

		await _Model2.default.findByIdAndUpdate(userId, { status });

		return res.json({
			error: false,
			message: 'Your account details have been updated successfully'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while updating your profile, please refresh the page and try again'
		});
	}
};

const fetchStatistics = exports.fetchStatistics = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const dashboard = await _Model8.default.findOne({});

		return res.json({
			error: false,
			data: dashboard
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting trade statistics, please refresh the page'
		});
	}
};

const fetchSubscriptions = exports.fetchSubscriptions = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const subscriptions = await _Model12.default.find({});

		return res.json({
			error: false,
			data: {
				subscriptions,
				userMembership: user.membership
			}
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const fetchSignals = exports.fetchSignals = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		let signalsData;
		if (user.membership === 'Free Membership') signalsData = await _Model10.default.find({});else signalsData = await _Model4.default.find({});

		return res.json({
			error: false,
			data: signalsData
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};