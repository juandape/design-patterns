"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
var NotificationService = /** @class */ (function () {
    function NotificationService() {
    }
    NotificationService.prototype.send = function (message) {
        return "Sending: ".concat(message);
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
