/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import { Router } from 'express'
import * as AdminController from './Controller'

const routes = new Router()

// Account
routes.post('/admin/login', AdminController.login)
routes.post('/admin/register', AdminController.register)
routes.post('/admin/fetchAccount', AdminController.fetchAccount)
routes.post('/admin/updateAccount', AdminController.updateAccount)
routes.post('/admin/fetchStatistics', AdminController.fetchStatistics)

// Users
routes.post('/admin/editUser', AdminController.editUser)
routes.post('/admin/createUser', AdminController.createUser)
routes.post('/admin/deleteUsers', AdminController.deleteUsers)
routes.post('/admin/fetchUsersList', AdminController.fetchUsersList)
routes.post('/admin/fetchUserDashboard', AdminController.fetchUserDashboard)
routes.post('/admin/createUserDashboard', AdminController.createUserDashboard)

// Signals
routes.post('/admin/editSignal', AdminController.editSignal)
routes.post('/admin/createSignal', AdminController.createSignal)
routes.post('/admin/fetchSignals', AdminController.fetchSignals)
routes.post('/admin/deleteSignals', AdminController.deleteSignals)
routes.post('/admin/editFreeSignal', AdminController.editFreeSignal)
routes.post('/admin/createFreeSignal', AdminController.createFreeSignal)
routes.post('/admin/fetchFreeSignals', AdminController.fetchFreeSignals)
routes.post('/admin/deleteFreeSignals', AdminController.deleteFreeSignals)

// Subscriptions
routes.post('/admin/fetchSubscriptions', AdminController.fetchSubscriptions)
routes.post('/admin/createSubscriptions', AdminController.createSubscriptions)
routes.post('/admin/removeSubscriptions', AdminController.removeSubscriptions)

// Technology
routes.post('/admin/fetchLogs', AdminController.fetchLogs)
routes.post('/admin/deleteLogs', AdminController.deleteLogs)

export default routes