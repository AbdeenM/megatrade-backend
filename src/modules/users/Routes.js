/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { Router } from 'express'
import * as UserController from './Controller'

const routes = new Router()

routes.post('/users/login', UserController.login)
routes.post('/users/register', UserController.register)
routes.post('/users/socialLogin', UserController.socialLogin)
routes.post('/users/fetchAccount', UserController.fetchAccount)
routes.post('/users/fetchSignals', UserController.fetchSignals)
routes.post('/users/updateAccount', UserController.updateAccount)
routes.post('/users/fetchStatistics', UserController.fetchStatistics)
routes.post('/users/createSubscription', UserController.createSubscription)
routes.post('/users/cancelSubscription', UserController.cancelSubscription)
routes.post('/users/fetchSubscriptions', UserController.fetchSubscriptions)

export default routes