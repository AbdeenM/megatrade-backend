'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getSponsor = exports.checkSponsor = exports.fetchSignals = exports.cancelSubscription = exports.createSubscription = exports.fetchSubscriptions = exports.fetchStatistics = exports.updateAccount = exports.fetchAccount = exports.resetPassword = exports.forgotPassword = exports.socialLogin = exports.login = exports.register = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bcrypt = require('bcrypt');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Model3 = require('../logs/Model');

var _Model4 = _interopRequireDefault(_Model3);

var _Model5 = require('../signals/Model');

var _Model6 = _interopRequireDefault(_Model5);

var _Model7 = require('../sponsors/Model');

var _Model8 = _interopRequireDefault(_Model7);

var _Model9 = require('../schedulars/Model');

var _Model10 = _interopRequireDefault(_Model9);

var _Model11 = require('../statistics/Model');

var _Model12 = _interopRequireDefault(_Model11);

var _Constants = require('../../config/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Model13 = require('../userDashboard/Model');

var _Model14 = _interopRequireDefault(_Model13);

var _Model15 = require('../freeSignals/Model');

var _Model16 = _interopRequireDefault(_Model15);

var _Model17 = require('../subscriptions/Model');

var _Model18 = _interopRequireDefault(_Model17);

var _Schedular = require('../../services/Schedular');

var _Email = require('../../services/Email');

var _PayPal = require('../../services/PayPal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const register = exports.register = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const newPassword = await (0, _bcrypt.hash)(password, 9);

	try {
		const user = await _Model2.default.findOne({ email: email.toLowerCase() });
		if (user) {
			return res.json({
				error: true,
				message: 'An account is already registered with this email, please use a different email or sign in'
			});
		}

		const userData = await _Model2.default.create({ firstName, lastName, email: email.toLowerCase(), password: newPassword });

		const statistics = await _Model12.default.findOne({});

		await _Model12.default.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 });

		(0, _Email.onSendEmailWelcome)(email, firstName);

		return res.json({
			error: false,
			message: 'A new account has been created for you successfully',
			data: userData
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'register',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while registering your account, please refresh the page and try again'
		});
	}
};

const login = exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await _Model2.default.findOne({ email: email.toLowerCase() });
		if (!user) {
			return res.json({
				error: true,
				message: 'The email you entered does not seem to be registered, please check if you entered it correct'
			});
		}

		await (0, _bcrypt.compare)(password, user.password, async (error, doesMatch) => {
			if (doesMatch) {
				const statistics = await _Model12.default.findOne({});

				await _Model12.default.findByIdAndUpdate(statistics._id, { totalLogins: parseInt(statistics.totalLogins) + 1 });

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
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'login',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		});
	}
};

const socialLogin = exports.socialLogin = async (req, res) => {
	const { email, firstName, lastName, avatar } = req.body;

	try {
		const user = await _Model2.default.findOne({ email: email.toLowerCase() });
		if (user) {
			const statistics = await _Model12.default.findOne({});

			await _Model12.default.findByIdAndUpdate(statistics._id, { totalLogins: parseInt(statistics.totalLogins) + 1 });

			return res.json({
				error: false,
				message: 'Logged in to your account successfully',
				data: user
			});
		} else {
			const newUser = await _Model2.default.create({ email, firstName, lastName, avatar });

			const statistics = await _Model12.default.findOne({});

			await _Model12.default.findByIdAndUpdate(statistics._id, { totalUsers: parseInt(statistics.totalUsers) + 1 });

			return res.json({
				error: false,
				message: 'A new account has been created for you successfully',
				data: newUser
			});
		}
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'socialLogin',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while signing you in, please refresh the page and try again'
		});
	}
};

const forgotPassword = exports.forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const checkEmail = await _Model2.default.findOne({ email });
		if (!checkEmail) {
			return res.json({
				error: true,
				message: 'There is no account registered with this email, please check the email and try again'
			});
		}

		const token = _crypto2.default.randomBytes(20).toString('hex');

		await _Model2.default.findOneAndUpdate({ email }, {
			resetPassword: {
				token,
				expiry: Date.now() + 360000
			}
		});

		(0, _Email.onSendEmailResetPassword)(email, token);

		return res.json({
			error: false,
			message: 'An email has been sent your email with instruction on reseting your password, Thank you'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'forgotPassword',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
		});
	}
};

const resetPassword = exports.resetPassword = async (req, res) => {
	const { token, password } = req.body;

	try {
		const checkToken = await _Model2.default.findOne({ 'resetPassword.token': token, 'resetPassword.expiry': { $gt: Date.now() } });
		if (!checkToken) {
			return res.json({
				error: true,
				message: 'This link is invalid or has expired, please contact us if you need further support'
			});
		}

		const newPassword = await (0, _bcrypt.hash)(password, 9);

		await _Model2.default.findByIdAndUpdate(checkToken._id, { password: newPassword });

		return res.json({
			error: false,
			message: 'Your password has been reset successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'resetPassword',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting your profile, please refresh the page'
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
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchAccount',
			description: error.message || ''
		});

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

		if (email !== undefined) await _Model2.default.findByIdAndUpdate(userId, { email: email.toLowerCase() });

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

				_fs2.default.writeFile(imagePath + imageName, base64Data, 'base64', async error => {
					if (error) {
						await _Model4.default.create({
							name: 'Updating profile',
							event: 'Upload media Error',
							summary: 'Failed to upload media base64 data to mega trade servers',
							function: 'updateAccount',
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
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'updateAccount',
			description: error.message || ''
		});

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

		const dashboard = await _Model14.default.findOne({});

		return res.json({
			error: false,
			data: dashboard
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchStatistics',
			description: error.message || ''
		});

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

		const subscriptions = await _Model18.default.find({});

		return res.json({
			error: false,
			data: {
				subscriptions,
				userMembership: user.membership,
				userSubscriptionId: user.subscriptionId
			}
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSubscriptions',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const createSubscription = exports.createSubscription = async (req, res) => {
	const { userId, planId, orderId, startTime, subscriptionId, nextBilling } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		const subscriptions = await _Model18.default.find({});

		const paidSubscription = subscriptions.filter(subscription => subscription.planId.toString() === planId)[0];

		await _Model2.default.findByIdAndUpdate(userId, {
			subscriptionId,
			membership: paidSubscription.title,
			membershipAmount: paidSubscription.price,
			$push: {
				membershipHistory: {
					$each: [{
						orderId,
						startTime,
						nextBilling,
						subscriptionId,
						price: paidSubscription.price,
						package: paidSubscription.title
					}]
				}
			}
		});

		const statistics = await _Model12.default.findOne({});

		await _Model12.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) + 1 });

		return res.json({
			error: false,
			message: 'Your memebership has been updated successfully'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'createSubscription',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while creating your subsription membership, please refresh the page'
		});
	}
};

const cancelSubscription = exports.cancelSubscription = async (req, res) => {
	const { userId } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		if (user.membership !== 'Sponsored Membership') {
			const paypalToken = await (0, _PayPal.paypalAccessTocken)();
			if (paypalToken.error) return res.json({
				error: true,
				message: paypalToken.message
			});

			const paypalCancelSubscription = await (0, _PayPal.cancelPayPalSubscription)(paypalToken.data.access_token, user.subscriptionId);
			if (paypalCancelSubscription.error) return res.json({
				error: true,
				message: paypalCancelSubscription.message
			});
		}

		await _Model2.default.findByIdAndUpdate(userId, {
			subscriptionId: 'FREE',
			membershipAmount: '0.00',
			membership: 'Free Membership'
		});

		if (user.membership === 'Sponsored Membership') {
			const statistics = await _Model12.default.findOne({});
			await _Model12.default.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) - 1 });
		} else {
			const statistics = await _Model12.default.findOne({});
			await _Model12.default.findByIdAndUpdate(statistics._id, { totalPayingUsers: parseInt(statistics.totalPayingUsers) - 1 });
		}

		return res.json({
			error: false,
			message: 'You are now on the free memebership package'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'cancelSubscription',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while cancelling your subsription membership, please refresh the page'
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

		let signalsData = [];
		if (user.membership !== 'Free Membership') {
			signalsData = await _Model6.default.find({});
			signalsData = signalsData.reverse();
		}

		// Fetch free signals mixed with premium signals
		// if (user.membership === 'Free Membership') {
		// 	const promoSignals = await Signals.find({})

		// 	signalsData = await FreeSignals.find({})
		// 	signalsData = signalsData.reverse()

		// 	signalsData.splice(2, 0, {
		// 		name: promoSignals.reverse()[0].name,
		// 		createAt: promoSignals.reverse()[0].createAt
		// 	})
		// 	signalsData.splice(3, 0, {
		// 		name: promoSignals.reverse()[1].name,
		// 		createAt: promoSignals.reverse()[1].createAt
		// 	})
		// 	signalsData.splice(7, 0, {
		// 		name: promoSignals.reverse()[2].name,
		// 		createAt: promoSignals.reverse()[2].createAt
		// 	})
		// 	signalsData.splice(9, 0, {
		// 		name: promoSignals.reverse()[3].name,
		// 		createAt: promoSignals.reverse()[3].createAt
		// 	})
		// } else {
		// 	signalsData = await Signals.find({})
		// 	signalsData = signalsData.reverse()
		// }

		return res.json({
			error: false,
			data: signalsData
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const checkSponsor = exports.checkSponsor = async (req, res) => {
	const { userId, code } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		if (user.usedCodes.includes(code)) return res.json({
			error: false,
			data: {
				code: '',
				duration: '',
				durationPick: '',
				message: 'You have used this code before'
			}
		});

		const codeDetails = await _Model8.default.findOne({ code });
		if (codeDetails) {
			return res.json({
				error: false,
				data: {
					message: '',
					code: codeDetails.code,
					duration: codeDetails.duration,
					durationPick: codeDetails.durationPick
				}
			});
		}

		return res.json({
			error: false,
			data: {
				code: '',
				duration: '',
				durationPick: '',
				message: 'The code you entered is invalid or does not exist'
			}
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'fetchSignals',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while getting the subsription memberships, please refresh the page'
		});
	}
};

const getSponsor = exports.getSponsor = async (req, res) => {
	const { userId, code, duration, durationPick } = req.body;

	try {
		const user = await _Model2.default.findById(userId);
		if (!user) {
			return res.json({
				error: true,
				message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
			});
		}

		await _Model2.default.findByIdAndUpdate(userId, {
			subscriptionId: code,
			membership: 'Sponsored Membership',
			membershipAmount: '0.00',
			$push: {
				usedCodes: code,
				membershipHistory: {
					$each: [{
						orderId: '-',
						price: '0.00',
						nextBilling: '-',
						subscriptionId: code,
						startTime: new Date(),
						package: 'Sponsored Membership'
					}]
				}
			}
		});

		const statistics = await _Model12.default.findOne({});
		await _Model12.default.findByIdAndUpdate(statistics._id, { totalSponsoredUsers: parseInt(statistics.totalSponsoredUsers) + 1 });

		let time = 0;
		switch (durationPick) {
			case 'DAY':
				time = 86400000;
				break;
			case 'WEEK':
				time = 604800000;
				break;
			case 'MONTH':
				time = 2628000000;
				break;
			default:
				time = 86400000;
				break;
		}

		let schedule;
		const multiplier = parseInt(duration);
		const totalTime = multiplier * time;
		const date = new Date(new Date().getTime() + totalTime);

		schedule = await _Model10.default.findOneAndUpdate({ task: 'remove-sponsorship' }, {
			$push: {
				jobs: {
					$each: [{
						userId,
						time: date,
						pending: true
					}]
				}
			}
		});

		schedule = await _Model10.default.findOne({ task: 'remove-sponsorship' });
		const schedularId = schedule.jobs[schedule.jobs.length - 1]._id;
		(0, _Schedular.scheduleRemoveUserSponsorship)(userId, date, schedularId);

		return res.json({
			error: false,
			message: 'You are now on the sponsored memebership package'
		});
	} catch (error) {
		await _Model4.default.create({
			name: error.name || '',
			event: 'Catch Error',
			summary: 'No idea buddy! good luck',
			function: 'getSponsor',
			description: error.message || ''
		});

		return res.json({
			error: true,
			message: 'Something went wrong while activating your sponsored membership, please refresh the page'
		});
	}
};