"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS = void 0;
var SMS = /** @class */ (function () {
    function SMS() {
    }
    SMS.prototype.sendNotification = function (message) {
        console.log("Sending SMS notification: ".concat(message));
    };
    return SMS;
}());
exports.SMS = SMS;
