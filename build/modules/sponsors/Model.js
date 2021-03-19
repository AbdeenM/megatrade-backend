'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SponsorsSchema = new _mongoose.Schema({
	code: {
		type: String
	},
	duration: {
		type: String
	},
	durationPick: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

exports.default = _mongoose2.default.model('sponsors', SponsorsSchema);