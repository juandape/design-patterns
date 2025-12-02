"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
var EmailService = /** @class */ (function () {
    function EmailService() {
    }
    EmailService.prototype.sendEmail = function (_a) {
        var email = _a.email, message = _a.message;
        return "Email sent to ".concat(email, " with message: ").concat(message);
    };
    return EmailService;
}());
exports.EmailService = EmailService;
