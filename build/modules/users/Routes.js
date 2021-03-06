'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _Controller = require('./Controller');

var UserController = _interopRequireWildcard(_Controller);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const routes = new _express.Router();

routes.post('/users/login', UserController.login);
routes.post('/users/register', UserController.register);
routes.post('/users/getSponsor', UserController.getSponsor);
routes.post('/users/socialLogin', UserController.socialLogin);
routes.post('/users/checkSponsor', UserController.checkSponsor);
routes.post('/users/fetchAccount', UserController.fetchAccount);
routes.post('/users/fetchSignals', UserController.fetchSignals);
routes.post('/users/resetPassword', UserController.resetPassword);
routes.post('/users/updateAccount', UserController.updateAccount);
routes.post('/users/forgotPassword', UserController.forgotPassword);
routes.post('/users/fetchStatistics', UserController.fetchStatistics);
routes.post('/users/createSubscription', UserController.createSubscription);
routes.post('/users/cancelSubscription', UserController.cancelSubscription);
routes.post('/users/fetchSubscriptions', UserController.fetchSubscriptions);

exports.default = routes;