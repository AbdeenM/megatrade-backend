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
}); /* **************************************************************************
     * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
     ************************************************************************** */

exports.default = _mongoose2.default.model('questions', QuestionsSchema);