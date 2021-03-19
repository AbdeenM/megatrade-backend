'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SchedularsSchema = new _mongoose.Schema({
	task: {
		type: String
	},
	jobs: [{
		userId: {
			type: String
		},
		time: {
			type: String
		},
		pending: {
			type: Boolean,
			default: true
		},
		note: {
			type: String
		}
	}]
});

exports.default = _mongoose2.default.model('schedulars', SchedularsSchema);