'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _Routes = require('./modules/users/Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _Routes3 = require('./modules/admin/Routes');

var _Routes4 = _interopRequireDefault(_Routes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)(); /* **************************************************************************
                                       * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
                                       * Unauthorized copying of this file, via any medium is strictly prohibited
                                       * Proprietary and confidential
                                       * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
                                       ************************************************************************** */

const server = _https2.default.createServer({
	key: _fs2.default.readFileSync('server.key'),
	cert: _fs2.default.readFileSync('server.cert')
}, app);

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect('mongodb://localhost/megatrade', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

_mongoose2.default.set('debug', true);
_mongoose2.default.set('useCreateIndex', true);
_mongoose2.default.connection.once('open', () => console.log('Mongodb started...')).on('error', error => console.log(error));

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json({ limit: '4mb' }));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') app.use((0, _morgan2.default)('dev'));

app.use('/api', [_Routes4.default, _Routes2.default]);
app.use('/uploads', _express2.default.static(process.cwd() + '/uploads'));

server.listen(8080, error => {
	if (error) console.log(error);else console.log('Megatrade server started at port: 8080');
});