'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createSponsors = exports.editSponsors = exports.deleteSponsors = exports.fetchSponsors = exports.deleteQuestions = exports.replyQuestion = exports.fetchQuestions = exports.deleteLogs = exports.fetchLogs = exports.fetchStatistics = exports.createFreeSignal = exports.editFreeSignal = exports.deleteFreeSignals = exports.createSignal = exports.editSignal = exports.deleteSignals = exports.fetchSignals = exports.fetchFreeSignals = exports.messageUsers = exports.createUser = exports.editUser = exports.deleteUsers = exports.fetchUsersList = exports.removeSubscriptions = exports.createSubscriptions = exports.createUserDashboard = exports.fetchSubscriptions = exports.fetchUserDashboard = exports.updateAccount = exports.fetchAccount = exports.login = exports.register = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _bcrypt = require('bcrypt');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../logs/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../users/Model');

var _Model6 = _interopRequireDefault(_Model5);

var _Model7 = require('../signals/Model');

var _Model8 = _interopRequireDefault(_Model7);

var _Model9 = require('../sponsors/Model');

var _Model10 = _interopRequireDefault(_Model9);

var _Model11 = require('../questions/Model');

var _Model12 = _interopRequireDefault(_Model11);

var _Model13 = require('../statistics/Model');

var _Model14 = _interopRequireDefault(_Model13);

var _Constants = require('../../config/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Model15 = require('../freeSignals/Model');

var _Model16 = _interopRequireDefault(_Model15);

var _Model17 = require('../subscriptions/Model');

var _Model18 = _interopRequireDefault(_Model17);

var _Model19 = require('../userDashboard/Model');

var _Model20 = _interopRequireDefault(_Model19);

var _Email = require('../../services/Email');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const register = exports.register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const newPassword = await (0, _bcrypt.hash)(password, 9);

	try {
		const admin = await _Model2.default.findOne({ email: email.toLowerCase() });
		if (admin) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			});
		}

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: await _Model2.default.create({ firstName, lastName, email, password: newPassword })
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'register - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please try again'
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
		const admin = await _Model2.default.findOne({ email: email.toLowerCase() });
		if (!admin) {
			return res.json({
				error: true,
				message: 'The email you entered does not seem to be registered, please check if you entered it correct'
			});
		}

		await (0, _bcrypt.compare)(password, admin.password, (error, doesMatch) => {
			if (doesMatch) return res.json({
				error: false,
				message: 'Logged in to your account successfully',
				data: admin
			});else return res.json({
				error: true,
				message: 'Wrong password, please try again'
			});
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'login - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please try again'
		});
	}
};

const fetchAccount = exports.fetchAccount = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		return res.json({
			error: false,
			data: admin
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchAccount - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		});
	}
};

const updateAccount = exports.updateAccount = async (req, res) => {
	const { adminId, email, avatar, lastName, password, firstName, city, number, country } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error updating. Your account is not found, either deactivated or deleted'
			});
		}

		if (city !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { city });

		if (email !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { email: email.toLowerCase() });

		if (number !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { number });

		if (country !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { country });

		if (lastName !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { lastName });

		if (firstName !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { firstName });

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image;
				const imageName = '/' + new Date().getTime().toString() + '.png';
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
				const imagePath = `public/profile_pictures/${adminId}`;

				if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', async error => {
					if (error) {
						await _Model4.default.create({
							name: 'Updating profile admin',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'updateAccount - Admin',
							description: error.message || '',
							note: 'Maybe no space in server storage or we ran it ran out of memory?'
						});

						return res.json({
							error: true,
							message: 'Error uploading the profile picture to the server, please try again'
						});
					}
				});

				profilePic = _Constants2.default.SERVER_URL + '/' + imagePath + imageName;

				await _Model2.default.findByIdAndUpdate(adminId, { avatar: profilePic });
			}
		}

		if (password !== undefined) {
			const newPassword = await (0, _bcrypt.hash)(password, 9);
			await _Model2.default.findByIdAndUpdate(adminId, { password: newPassword });
		}

		return res.json({
			error: false,
			message: 'Your account details have been updated successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'updateAccount - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while updating your profile, please refresh the page and try again'
		});
	}
};

const fetchUserDashboard = exports.fetchUserDashboard = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const userDashboard = await _Model20.default.findOne({});
		if (userDashboard) return res.json({
			error: false,
			data: userDashboard
		});

		return res.json({
			error: false,
			data: await _Model20.default.create({})
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchUserDashboard - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const fetchSubscriptions = exports.fetchSubscriptions = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const subscriptions = await _Model18.default.find({});

		return res.json({
			error: false,
			data: subscriptions
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSubscriptions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const createUserDashboard = exports.createUserDashboard = async (req, res) => {
	const { adminId, totalPips, totalUsers, tradeBudget, totalProfits, tradeFocus, latestAlerts } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const userDashboard = await _Model20.default.findOne({});
		if (userDashboard) {
			await _Model20.default.findByIdAndUpdate(userDashboard._id, {
				totalPips,
				totalUsers,
				tradeBudget,
				totalProfits,
				tradeFocus: {
					data: tradeFocus.data,
					labels: tradeFocus.labels,
					backgroundColor: tradeFocus.backgroundColor
				},
				latestAlerts: {
					thisYear: latestAlerts.thisYear,
					lastYear: latestAlerts.lastYear
				}
			});

			return res.json({
				error: false,
				message: 'The new user dashboard data has been updated successfully'
			});
		}

		await _Model20.default.create({});

		return res.json({
			error: false,
			message: 'The new user dashboard data has been updated successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUserDashboard - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user dashboard data, please refresh the page'
		});
	}
};

const createSubscriptions = exports.createSubscriptions = async (req, res) => {
	const { adminId, title, planId, validity, price, image, description } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		let newImage;
		if (image !== undefined) {
			let subscriptionPic = image;
			const imageName = '/' + new Date().getTime().toString() + '.png';
			const base64Data = subscriptionPic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
			const imagePath = 'public/subscriptions';

			if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

			_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', async error => {
				if (error) {
					await _Model4.default.create({
						name: 'Creating suscription',
						event: 'Upload media Error',
						summary: 'Failed to upload media base64 data to mega trade servers',
						function: 'createSubscriptions - Admin',
						description: error.message || '',
						note: 'Maybe no space in server storage or we ran it ran out of memory?'
					});

					return res.json({
						error: true,
						message: 'Error uploading the profile picture to the server, please try again'
					});
				}
			});

			newImage = _Constants2.default.SERVER_URL + '/' + imagePath + imageName;
		}

		await _Model18.default.create({ image: newImage, price, title, planId, validity, description });

		return res.json({
			error: false,
			message: 'A new subscription membership has been created successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSubscriptions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the subsription membership, please refresh the page'
		});
	}
};

const removeSubscriptions = exports.removeSubscriptions = async (req, res) => {
	const { adminId, subscriptionId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model18.default.findByIdAndDelete(subscriptionId);

		return res.json({
			error: false,
			message: 'The subscription membership has been deleted successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'removeSubscriptions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while removing the subscription membership, please refresh the page'
		});
	}
};

const fetchUsersList = exports.fetchUsersList = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const userList = await _Model6.default.find({});

		return res.json({
			error: false,
			data: userList.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchUserList - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the users list, please refresh the page'
		});
	}
};

const deleteUsers = exports.deleteUsers = async (req, res) => {
	const { adminId, users } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		for (let each = 0; each < users.length; each++) {
			const user = users[each];

			await _Model6.default.findByIdAndDelete(user);
		}

		const statistics = await _Model14.default.findOne({});

		await _Model14.default.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) - users.length });

		return res.json({
			error: false,
			message: 'Selected user(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteUsers - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the user(s) profile(s), please refresh the page'
		});
	}
};

const editUser = exports.editUser = async (req, res) => {
	const { adminId, city, email, avatar, number, status, userId, country, password, lastName, membership, firstName, notifications, subscriptionId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		let newAvatar = avatar.image;
		if (avatar.isBase64) {
			let profilePic = avatar.image;
			const imageName = '/' + new Date().getTime().toString() + '.png';
			const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
			const imagePath = `public/profile_pictures/${userId}`;

			if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

			_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', async error => {
				if (error) {
					await _Model4.default.create({
						name: 'editUser User',
						event: 'Upload media Error',
						summary: 'Failed to upload media base64 data to mega trade servers',
						function: 'editUser - Admin',
						description: error.message || '',
						note: 'Maybe no space in server storage or we ran it ran out of memory?'
					});

					return res.json({
						error: true,
						message: 'Error uploading the profile picture to the server, please try again'
					});
				}
			});

			newAvatar = _Constants2.default.SERVER_URL + '/' + imagePath + imageName;
		}

		let newPassword;
		if (password !== undefined) {
			if (password.length > 0) {
				newPassword = await (0, _bcrypt.hash)(password, 9);
			}
		}

		await _Model6.default.findByIdAndUpdate(userId, { city, email: email.toLowerCase(), password: newPassword, avatar: newAvatar, number, status, country, membership, lastName, firstName, notifications, subscriptionId });

		return res.json({
			error: false,
			message: 'Selected user has been successfully editted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editUser - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while editing the user profile, please refresh the page'
		});
	}
};

const createUser = exports.createUser = async (req, res) => {
	const { adminId, city, email, password, avatar, number, country, membership, lastName, firstName, notifications } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		let newAvatar = '';
		if (avatar !== undefined) {
			if (avatar.isBase64) {
				let profilePic = avatar.image;
				const imageName = '/' + new Date().getTime().toString() + '.png';
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
				const imagePath = 'public/admin_users';

				if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', async error => {
					if (error) {
						await _Model4.default.create({
							name: 'Create User',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'createUser - Admin',
							description: error.message || '',
							note: 'Maybe no space in server storage or we ran it ran out of memory?'
						});

						return res.json({
							error: true,
							message: 'Error uploading the profile picture to the server, please try again'
						});
					}
				});

				newAvatar = _Constants2.default.SERVER_URL + '/' + imagePath + imageName;
			}
		}

		const newPassword = await (0, _bcrypt.hash)(password, 9);

		await _Model6.default.create({ city, email: email.toLowerCase(), password: newPassword, avatar: newAvatar, number, country, membership, lastName, firstName, notifications });

		const statistics = await _Model14.default.findOne({});

		await _Model14.default.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 });

		return res.json({
			error: false,
			message: 'A new user has successfully been created'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUser - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user account, please refresh the page'
		});
	}
};

const messageUsers = exports.messageUsers = async (req, res) => {
	const { adminId, emails, subject, message, attachments } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		(0, _Email.onSendEmailMessage)(emails, subject, message, attachments);

		return res.json({
			error: false,
			message: 'The emails have successfully been sent'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createUser - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the user account, please refresh the page'
		});
	}
};

const fetchFreeSignals = exports.fetchFreeSignals = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const freeSignals = await _Model16.default.find({});

		return res.json({
			error: false,
			data: freeSignals.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchFreeSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the free signals, please refresh the page'
		});
	}
};

const fetchSignals = exports.fetchSignals = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const signals = await _Model8.default.find({});

		return res.json({
			error: false,
			data: signals.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		});
	}
};

const deleteSignals = exports.deleteSignals = async (req, res) => {
	const { adminId, signals } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const statistics = await _Model14.default.findOne({});

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each];

			await _Model8.default.findByIdAndDelete(signal);
			await _Model14.default.findByIdAndUpdate(statistics._id, { totalSignals: parseInt(statistics.totalSignals) - 1 });
		}

		return res.json({
			error: false,
			message: 'Selected signal(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the signal(s), please refresh the page'
		});
	}
};

const editSignal = exports.editSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model8.default.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice });

		const date = new Date(new Date().getTime() + 5000);

		_nodeSchedule2.default.scheduleJob(date, async () => {
			let emails = [];
			const users = await _Model6.default.find({ 'notifications.alerts.email': true });

			users.forEach(user => {
				if (user.membership !== 'Free Membership') emails.push(user.email);
			});

			(0, _Email.onSendEmailAlerts)(`Alerts - Update to ${name} Signal`, { name, status, stopLoss, entryPrice }, emails);
		});

		return res.json({
			error: false,
			message: 'Selected signal have been successfully edited'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editSignal - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while editing the signal, please refresh the page'
		});
	}
};

const createSignal = exports.createSignal = async (req, res) => {
	const { adminId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model8.default.create({ name, status, stopLoss, entryPrice });

		const statistics = await _Model14.default.findOne({});

		await _Model14.default.findByIdAndUpdate(statistics._id, { totalSignals: parseInt(statistics.totalSignals) + 1 });

		const date = new Date(new Date().getTime() + 5000);

		_nodeSchedule2.default.scheduleJob(date, async () => {
			let emails = [];
			const users = await _Model6.default.find({ 'notifications.alerts.email': true });

			users.forEach(user => {
				if (user.membership !== 'Free Membership') emails.push(user.email);
			});

			(0, _Email.onSendEmailAlerts)(`Alerts - New ${name} Signal`, { name, status, stopLoss, entryPrice }, emails);
		});

		return res.json({
			error: false,
			message: 'Signal have been successfully created'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSignal - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the signal, please refresh the page'
		});
	}
};

const deleteFreeSignals = exports.deleteFreeSignals = async (req, res) => {
	const { adminId, signals } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const statistics = await _Model14.default.findOne({});

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each];

			await _Model16.default.findByIdAndDelete(signal);
			await _Model14.default.findByIdAndUpdate(statistics._id, { totalFreeSignals: parseInt(statistics.totalFreeSignals) - 1 });
		}

		return res.json({
			error: false,
			message: 'Selected free signal(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteFreeSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the free signal(s), please refresh the page'
		});
	}
};

const editFreeSignal = exports.editFreeSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model16.default.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice });

		const date = new Date(new Date().getTime() + 5000);

		_nodeSchedule2.default.scheduleJob(date, async () => {
			let emails = [];
			const users = await _Model6.default.find({ 'notifications.alerts.email': true });

			users.forEach(user => {
				if (user.membership === 'Free Membership') emails.push(user.email);
			});

			(0, _Email.onSendEmailAlerts)(`Free Alerts - Update to ${name} Signal`, { name, status, stopLoss, entryPrice }, emails);
		});

		return res.json({
			error: false,
			message: 'Selected free signal have been successfully edited'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'editFreeSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while editing the free signal, please refresh the page'
		});
	}
};

const createFreeSignal = exports.createFreeSignal = async (req, res) => {
	const { adminId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model16.default.create({ name, status, stopLoss, entryPrice });

		const statistics = await _Model14.default.findOne({});

		await _Model14.default.findByIdAndUpdate(statistics._id, { totalFreeSignals: parseInt(statistics.totalFreeSignals) + 1 });

		const date = new Date(new Date().getTime() + 5000);

		_nodeSchedule2.default.scheduleJob(date, async () => {
			let emails = [];
			const users = await _Model6.default.find({ 'notifications.alerts.email': true });

			users.forEach(user => {
				if (user.membership === 'Free Membership') emails.push(user.email);
			});

			(0, _Email.onSendEmailAlerts)(`Free Alerts - New ${name} Signal`, { name, status, stopLoss, entryPrice }, emails);
		});

		return res.json({
			error: false,
			message: 'Free signal have been successfully created'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createFreeSignal - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating the free signal, please refresh the page'
		});
	}
};

const fetchStatistics = exports.fetchStatistics = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const statistics = await _Model14.default.findOne({});
		if (statistics) return res.json({
			error: false,
			data: statistics
		});

		return res.json({
			error: false,
			data: await _Model14.default.create({})
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchStatistics - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the statistics, please refresh the page'
		});
	}
};

const fetchLogs = exports.fetchLogs = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const logs = await _Model4.default.find({});

		return res.json({
			error: false,
			data: logs.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchLogs - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		});
	}
};

const deleteLogs = exports.deleteLogs = async (req, res) => {
	const { adminId, logs } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		for (let each = 0; each < logs.length; each++) {
			const log = logs[each];

			await _Model4.default.findByIdAndDelete(log);
		}

		return res.json({
			error: false,
			message: 'Selected log(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSignals - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the signal(s), please refresh the page'
		});
	}
};

const fetchQuestions = exports.fetchQuestions = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const questions = await _Model12.default.find({});

		return res.json({
			error: false,
			data: questions.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchQuestions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		});
	}
};

const replyQuestion = exports.replyQuestion = async (req, res) => {
	const { adminId, questionId, email, message } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		(0, _Email.onSendEmailQuestion)(email, message);

		await _Model12.default.findByIdAndUpdate(questionId, { isReplied: true });

		return res.json({
			error: false,
			message: 'Your message has been emailed to the recipent successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchQuestions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the signals, please refresh the page'
		});
	}
};

const deleteQuestions = exports.deleteQuestions = async (req, res) => {
	const { adminId, questions } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		for (let each = 0; each < questions.length; each++) {
			const question = questions[each];

			await _Model12.default.findByIdAndDelete(question);
		}

		return res.json({
			error: false,
			message: 'Selected message(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		});
	}
};

const fetchSponsors = exports.fetchSponsors = async (req, res) => {
	const { adminId } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const sponsors = await _Model10.default.find({});

		return res.json({
			error: false,
			data: sponsors.reverse()
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSponsors - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		});
	}
};

const deleteSponsors = exports.deleteSponsors = async (req, res) => {
	const { adminId, sponsors } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		for (let each = 0; each < sponsors.length; each++) {
			const sponsor = sponsors[each];

			await _Model10.default.findByIdAndDelete(sponsor);
		}

		return res.json({
			error: false,
			message: 'Selected sponsorship code(s) have been successfully deleted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteSponsors - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		});
	}
};

const editSponsors = exports.editSponsors = async (req, res) => {
	const { adminId, sponsorId, code, duration, durationPick } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model10.default.findByIdAndUpdate(sponsorId, { code, duration, durationPick });

		return res.json({
			error: false,
			message: 'Selected sponsor code have been successfully editted'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		});
	}
};

const createSponsors = exports.createSponsors = async (req, res) => {
	const { adminId, code, duration, durationPick } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model10.default.create({ code, duration, durationPick });

		return res.json({
			error: false,
			message: 'Selected sponsor code has been created successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'deleteQuestions - Admin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while deleting the selected message(s), please refresh the page'
		});
	}
};