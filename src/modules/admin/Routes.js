/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { Router } from 'express'
import * as AdminController from './Controller'

const routes = new Router()

routes.post('/admin/login', AdminController.login)
routes.post('/admin/register', AdminController.register)
routes.post('/admin/fetchAccount', AdminController.fetchAccount)
routes.post('/admin/updateAccount', AdminController.updateAccount)
routes.post('/admin/fetchSubscriptions', AdminController.fetchSubscriptions)
routes.post('/admin/createSubscriptions', AdminController.createSubscriptions)
routes.post('/admin/removeSubscriptions', AdminController.removeSubscriptions)

export default routes