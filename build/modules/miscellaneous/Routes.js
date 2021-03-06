'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _Controller = require('./Controller');

var MiscellaneousController = _interopRequireWildcard(_Controller);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const routes = new _express.Router();

routes.post('/miscellaneous/question', MiscellaneousController.question);
routes.post('/miscellaneous/newsLetter', MiscellaneousController.newsLetter);
routes.post('/miscellaneous/twitterPost', MiscellaneousController.twitterPost);
routes.post('/miscellaneous/paypalWebhookLive', MiscellaneousController.paypalWebhookLive);
routes.post('/miscellaneous/paypalWebhookSandbox', MiscellaneousController.paypalWebhookSandbox);
routes.post('/miscellaneous/paypalPaymentSuspended', MiscellaneousController.paypalPaymentSuspended);
routes.post('/miscellaneous/paypalSubscriptionSusbended', MiscellaneousController.paypalSubscriptionSusbended);

exports.default = routes;