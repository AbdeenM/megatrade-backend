'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QuestionsSchema = new _mongoose.Schema({
	name: {
		type: String
	},
	isReplied: {
		type: Boolean,
		default: false
	},
	email: {
		type: String
	},
	number: {
		type: String,
		default: '-'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	company: {
		type: String,
		default: '-'
	},
	message: {
		type: String
	}
});

exports.default = _mongoose2.default.model('questions', QuestionsSchema);