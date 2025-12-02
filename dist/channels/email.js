"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
var Email = /** @class */ (function () {
    function Email() {
    }
    Email.prototype.sendNotification = function (message) {
        console.log("Sending email notification: ".concat(message));
    };
    return Email;
}());
exports.Email = Email;
