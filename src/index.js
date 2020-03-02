/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *  by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import cors from 'cors'
import http from 'http'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import socketio from 'socket.io'
import bodyparser from 'body-parser'

import UserRoutes from './modules/users/Routes'
import AdminRoutes from './modules/admin/Routes'
import { defaultSettings } from './services/InitialSetup'
import MiscellaneousRoutes from './modules/miscellaneous/Routes'
import { onUserJoin, onUserLeft, onMessage, onMoreChatHistory } from './sockets/GroupChat'

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const groupChat = io.of('/chat-group')

const PORT = process.env.PORT || 8000
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/megatrade'

mongoose.Promise = global.Promise
mongoose.connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
mongoose.connection
	.once('open', () => console.log('Mongodb started...'))
	.on('error', (error) => console.log(error))

app.use(cors())
app.use(bodyparser.json({ limit: '50mb' }))
app.use(bodyparser.urlencoded({ extended: false }))

if (process.env.NODE_ENV !== 'production')
	app.use(morgan('dev'))

app.use('/api', [AdminRoutes, UserRoutes, MiscellaneousRoutes])
app.use('/public', express.static(process.cwd() + '/public'))

defaultSettings()

groupChat.on('connection', socket => {
	socket.on('disconnect', () => onUserLeft(groupChat, socket))
	socket.on('message', data => onMessage(data, groupChat, socket))
	socket.on('userJoined', data => onUserJoin(data, groupChat, socket))
	socket.on('fetchMoreChatHistory', data => onMoreChatHistory(data, groupChat, socket))
})

server.listen(PORT, async error => {
	if (error) {
		await Logs.create({
			name: 'Main Application!',
			event: 'Server not listening',
			summary: 'Failed to listen at the specified port!!!',
			function: 'Index',
			description: error,
			note: 'Abort all and resolve this! maybe the server crashed, restarted and the port is already in use! kill port and restart maybe?'
		})
	}
	else
		console.log(`Mega Trade server started at port: ${PORT}`)
})