'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _simpleNodeLogger = require('simple-node-logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const logger = (0, _simpleNodeLogger.createSimpleLogger)({ logFilePath: './node-logger.txt' });

const connection = _mysql2.default.createConnection({
	host: 'localhost',
	user: 'megakqaq_mephisto',
	password: 'AbdeenWillRule9',
	database: 'megakqaq_server_db'
});

connection.connect(error => {
	if (error) logger.error(`=========================> Database Error - Databse ${error}` + error);
});

exports.default = connection;