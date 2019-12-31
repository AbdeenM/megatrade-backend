'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _Controller = require('./Controller');

var AdminController = _interopRequireWildcard(_Controller);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

const routes = new _express.Router();

// Account
routes.post('/admin/login', AdminController.login);
routes.post('/admin/register', AdminController.register);
routes.post('/admin/fetchAccount', AdminController.fetchAccount);
routes.post('/admin/updateAccount', AdminController.updateAccount);
routes.post('/admin/fetchStatistics', AdminController.fetchStatistics);

// Users
routes.post('/admin/editUser', AdminController.editUser);
routes.post('/admin/createUser', AdminController.createUser);
routes.post('/admin/deleteUsers', AdminController.deleteUsers);
routes.post('/admin/fetchUsersList', AdminController.fetchUsersList);
routes.post('/admin/fetchUserDashboard', AdminController.fetchUserDashboard);
routes.post('/admin/createUserDashboard', AdminController.createUserDashboard);

// Signals
routes.post('/admin/editSignal', AdminController.editSignal);
routes.post('/admin/createSignal', AdminController.createSignal);
routes.post('/admin/fetchSignals', AdminController.fetchSignals);
routes.post('/admin/deleteSignals', AdminController.deleteSignals);
routes.post('/admin/editFreeSignal', AdminController.editFreeSignal);
routes.post('/admin/createFreeSignal', AdminController.createFreeSignal);
routes.post('/admin/fetchFreeSignals', AdminController.fetchFreeSignals);
routes.post('/admin/deleteFreeSignals', AdminController.deleteFreeSignals);

// Subscriptions
routes.post('/admin/fetchSubscriptions', AdminController.fetchSubscriptions);
routes.post('/admin/createSubscriptions', AdminController.createSubscriptions);
routes.post('/admin/removeSubscriptions', AdminController.removeSubscriptions);

// Technology
routes.post('/admin/fetchLogs', AdminController.fetchLogs);
routes.post('/admin/deleteLogs', AdminController.deleteLogs);

exports.default = routes;