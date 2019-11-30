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
routes.post('/users/fetchAccount', UserController.fetchAccount)
routes.post('/users/updateAccount', UserController.updateAccount)

export default routes