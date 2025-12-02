"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNotificationDecorator = void 0;
var BaseNotificationDecorator = /** @class */ (function () {
    function BaseNotificationDecorator(service) {
        this.service = service;
    }
    BaseNotificationDecorator.prototype.send = function (message) {
        return this.service.send(message);
    };
    return BaseNotificationDecorator;
}());
exports.BaseNotificationDecorator = BaseNotificationDecorator;
