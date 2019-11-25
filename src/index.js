/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import http from 'http'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'

import UserRoutes from './modules/users/Routes'

const app = express()
const server = http.Server(app)

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/megatrade', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
mongoose.connection
    .once('open', () => console.log('Mongodb started...'))
    .on('error', (error) => console.log(error))

app.use(bodyparser.json({ limit: '4mb' }))
app.use(bodyparser.urlencoded({ extended: false }))

if (process.env.NODE_ENV !== 'production')
    app.use(morgan('dev'))

app.use('/api', [UserRoutes])
app.use('/uploads', express.static(process.cwd() + '/uploads'))

server.listen(8080, (error) => {
    if (error)
        console.log(error)
    else
        console.log('Megatrade server started at port: 8080')
})
