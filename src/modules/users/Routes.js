import { Router } from 'express'
import * as UserController from './Controller'

const routes = new Router()

routes.post('/users/login', UserController.login)
routes.post('/users/register', UserController.register)
routes.post('/users/getSponsor', UserController.getSponsor)
routes.post('/users/socialLogin', UserController.socialLogin)
routes.post('/users/checkSponsor', UserController.checkSponsor)
routes.post('/users/fetchAccount', UserController.fetchAccount)
routes.post('/users/fetchSignals', UserController.fetchSignals)
routes.post('/users/resetPassword', UserController.resetPassword)
routes.post('/users/updateAccount', UserController.updateAccount)
routes.post('/users/forgotPassword', UserController.forgotPassword)
routes.post('/users/fetchStatistics', UserController.fetchStatistics)
routes.post('/users/createSubscription', UserController.createSubscription)
routes.post('/users/cancelSubscription', UserController.cancelSubscription)
routes.post('/users/fetchSubscriptions', UserController.fetchSubscriptions)

export default routes