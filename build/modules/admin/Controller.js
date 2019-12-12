'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createFreeSignal = exports.editFreeSignal = exports.deleteFreeSignals = exports.createSignal = exports.editSignal = exports.deleteSignals = exports.fetchSignals = exports.fetchFreeSignals = exports.createUser = exports.editUser = exports.deleteUsers = exports.fetchUsersList = exports.removeSubscriptions = exports.createSubscriptions = exports.createUserDashboard = exports.fetchSubscriptions = exports.fetchUserDashboard = exports.updateAccount = exports.fetchAccount = exports.login = exports.register = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bcrypt = require('bcrypt');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../users/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../signals/Model');

var _Model6 = _interopRequireDefault(_Model5);

var _Constants = require('../../config/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Model7 = require('../freeSignals/Model');

var _Model8 = _interopRequireDefault(_Model7);

var _Model9 = require('../subscriptions/Model');

var _Model10 = _interopRequireDefault(_Model9);

var _Model11 = require('../userDashboard/Model');

var _Model12 = _interopRequireDefault(_Model11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const register = exports.register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const newPassword = await (0, _bcrypt.hash)(password, 9);

	try {
		const admin = await _Model2.default.findOne({ email });
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
		const admin = await _Model2.default.findOne({ email });
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

		if (email !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { email });

		if (number !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { number });

		if (country !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { country });

		if (lastName !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { lastName });

		if (firstName !== undefined) await _Model2.default.findByIdAndUpdate(adminId, { firstName });

		if (avatar !== undefined) {
			if (avatar.base64) {
				let profilePic = avatar.image;
				const imageName = '/' + new Date().getTime().toString() + '.png';
				const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
				const imagePath = `uploads/profile_pictures/${adminId}`;

				if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', error => console.log(error));

				profilePic = _Constants2.default.SERVER_URL + imagePath + imageName;

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

		const userDashboard = await _Model12.default.findOne({});
		if (userDashboard) return res.json({
			error: false,
			data: userDashboard
		});

		return res.json({
			error: false,
			data: await _Model12.default.create({})
		});
	} catch (error) {
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

		const subscriptions = await _Model10.default.find({});

		return res.json({
			error: false,
			data: subscriptions
		});
	} catch (error) {
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

		const userDashboard = await _Model12.default.findOne({});
		if (userDashboard) {
			await _Model12.default.findByIdAndUpdate(userDashboard._id, {
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

		await _Model12.default.create({});

		return res.json({
			error: false,
			message: 'The new user dashboard data has been updated successfully'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while creating the user dashboard data, please refresh the page'
		});
	}
};

const createSubscriptions = exports.createSubscriptions = async (req, res) => {
	const { adminId, title, validity, price, image, description } = req.body;

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
			const imagePath = `uploads/subscriptions`;

			if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

			_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', error => console.log(error));

			newImage = _Constants2.default.SERVER_URL + imagePath + imageName;
		}

		await _Model10.default.create({ image: newImage, price, title, validity, description });

		return res.json({
			error: false,
			message: 'A new subscription membership has been created successfully'
		});
	} catch (error) {
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

		await _Model10.default.findByIdAndDelete(subscriptionId);

		return res.json({
			error: false,
			message: 'The subscription membership has been deleted successfully'
		});
	} catch (error) {
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

		return res.json({
			error: false,
			data: await _Model4.default.find({})
		});
	} catch (error) {
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

			await _Model4.default.findByIdAndDelete(user);
		}

		return res.json({
			error: false,
			message: 'Selected user(s) have been successfully deleted'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while deleting the user(s) profile(s), please refresh the page'
		});
	}
};

const editUser = exports.editUser = async (req, res) => {
	const { adminId, city, email, avatar, number, status, userId, country, password, lastName, membership, firstName, notifications } = req.body;

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
			const imagePath = `uploads/profile_pictures/${userId}`;

			if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

			_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', error => {
				if (error) return res.json({
					error: true,
					message: 'Error uploading the profile picture to the server, please try again'
				});
			});

			newAvatar = _Constants2.default.SERVER_URL + imagePath + imageName;
		}

		let newPassword;
		if (password !== undefined) {
			if (password.length > 0) {
				newPassword = await (0, _bcrypt.hash)(password, 9);
			}
		}

		await _Model4.default.findByIdAndUpdate(userId, { city, email, password: newPassword, avatar: newAvatar, number, status, country, membership, lastName, firstName, notifications });

		return res.json({
			error: false,
			message: 'Selected user has been successfully editted'
		});
	} catch (error) {
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
				const imagePath = 'uploads/admin_users';

				if (!_fs2.default.existsSync(imagePath)) _fs2.default.mkdirSync(imagePath);

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', error => {
					if (error) return res.json({
						error: true,
						message: 'Error uploading the profile picture to the server, please try again'
					});
				});

				newAvatar = _Constants2.default.SERVER_URL + imagePath + imageName;
			}
		}

		const newPassword = await (0, _bcrypt.hash)(password, 9);

		await _Model4.default.create({ city, email, password: newPassword, avatar: newAvatar, number, country, membership, lastName, firstName, notifications });

		return res.json({
			error: false,
			message: 'A new user has successfully been created'
		});
	} catch (error) {
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

		return res.json({
			error: false,
			data: await _Model8.default.find({})
		});
	} catch (error) {
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

		return res.json({
			error: false,
			data: await _Model6.default.find({})
		});
	} catch (error) {
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

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each];

			await _Model6.default.findByIdAndDelete(signal);
		}

		return res.json({
			error: false,
			message: 'Selected signal(s) have been successfully deleted'
		});
	} catch (error) {
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

		await _Model6.default.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice });

		return res.json({
			error: false,
			message: 'Selected signal have been successfully edited'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while editing the signal, please refresh the page'
		});
	}
};

const createSignal = exports.createSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model6.default.create({ signalId, name, status, stopLoss, entryPrice });

		return res.json({
			error: false,
			message: 'Signal have been successfully created'
		});
	} catch (error) {
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

		for (let each = 0; each < signals.length; each++) {
			const signal = signals[each];

			await _Model8.default.findByIdAndDelete(signal);
		}

		return res.json({
			error: false,
			message: 'Selected free signal(s) have been successfully deleted'
		});
	} catch (error) {
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

		await _Model8.default.findByIdAndUpdate(signalId, { signalId, name, status, stopLoss, entryPrice });

		return res.json({
			error: false,
			message: 'Selected free signal have been successfully edited'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while editing the free signal, please refresh the page'
		});
	}
};

const createFreeSignal = exports.createFreeSignal = async (req, res) => {
	const { adminId, signalId, name, status, stopLoss, entryPrice } = req.body;

	try {
		const admin = await _Model2.default.findById(adminId);
		if (!admin) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model8.default.create({ signalId, name, status, stopLoss, entryPrice });

		return res.json({
			error: false,
			message: 'Free signal have been successfully created'
		});
	} catch (error) {
		return res.json({
			error: true,
			message: 'Something went wrong while creating the free signal, please refresh the page'
		});
	}
};