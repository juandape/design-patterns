"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoratorPattern = void 0;
var notifcationService_1 = require("./classes/notifcationService");
var LoggionDecorator_1 = require("./decorators/LoggionDecorator");
var SmsDecorator_1 = require("./decorators/SmsDecorator");
var decoratorPattern = function () {
    var notifier = new notifcationService_1.NotificationService();
    // notifier = new EmailDecorator(notifier);
    notifier = new SmsDecorator_1.SmsDecorator(notifier);
    notifier = new LoggionDecorator_1.LoggingDecorator(notifier);
    var result = notifier.send('Hello, Decorator Pattern!');
    console.log(result);
    return result;
};
exports.decoratorPattern = decoratorPattern;
(0, exports.decoratorPattern)();
