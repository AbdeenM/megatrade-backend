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
import bodyparser from 'body-parser'

import UserRoutes from './modules/users/Routes'
import AdminRoutes from './modules/admin/Routes'
import MiscellaneousRoutes from './modules/miscellaneous/Routes'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8080
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
app.use(bodyparser.json({ limit: '4mb' }))
app.use(bodyparser.urlencoded({ extended: false }))

if (process.env.NODE_ENV !== 'production')
	app.use(morgan('dev'))

app.use('/api', [AdminRoutes, UserRoutes, MiscellaneousRoutes])
app.use('/public', express.static(process.cwd() + '/public'))

server.listen(PORT, (error) => {
	if (error)
		console.log(error)
	else
		console.log(`Megatrade server started at port: ${PORT}`)
})
