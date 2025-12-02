"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = void 0;
var Push = /** @class */ (function () {
    function Push() {
    }
    Push.prototype.sendNotification = function (message) {
        console.log("Sending push notification: ".concat(message));
    };
    return Push;
}());
exports.Push = Push;
