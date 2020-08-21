'use strict';

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _Routes = require('./modules/users/Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _Routes3 = require('./modules/admin/Routes');

var _Routes4 = _interopRequireDefault(_Routes3);

var _InitialSetup = require('./services/InitialSetup');

var _Routes5 = require('./modules/miscellaneous/Routes');

var _Routes6 = _interopRequireDefault(_Routes5);

var _GroupChat = require('./sockets/GroupChat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const server = _http2.default.createServer(app);
const io = (0, _socket2.default)(server);
const groupChat = io.of('/chat-group');

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/megatrade';

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

_mongoose2.default.set('debug', true);
_mongoose2.default.set('useCreateIndex', true);
_mongoose2.default.connection.once('open', () => console.log('Mongodb started...')).on('error', error => console.log(error));

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') app.use((0, _morgan2.default)('dev'));

app.use('/api', [_Routes4.default, _Routes2.default, _Routes6.default]);
app.use('/public', _express2.default.static(process.cwd() + '/public'));

(0, _InitialSetup.defaultSettings)();

groupChat.on('connection', socket => {
    socket.on('disconnect', () => (0, _GroupChat.onUserLeft)(groupChat, socket));
    socket.on('message', data => (0, _GroupChat.onMessage)(data, groupChat, socket));
    socket.on('userJoined', data => (0, _GroupChat.onUserJoin)(data, groupChat, socket));
    socket.on('fetchMoreChatHistory', data => (0, _GroupChat.onMoreChatHistory)(data, groupChat, socket));
});

server.listen(PORT, async error => {
    if (error) {
        await Logs.create({
            name: 'Main Application!',
            event: 'Server not listening',
            summary: 'Failed to listen at the specified port!!!',
            function: 'Index',
            description: error,
            note: 'Abort all and resolve this! maybe the server crashed, restarted and the port is already in use! kill port and restart maybe?'
        });
    } else console.log(`Mega Trade server started at port: ${PORT}`);
});