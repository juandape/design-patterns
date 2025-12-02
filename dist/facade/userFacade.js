"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFacade = void 0;
var emailService_1 = require("../services/emailService");
var loggerService_1 = require("../services/loggerService");
var userService_1 = require("../services/userService");
var UserFacade = /** @class */ (function () {
    function UserFacade() {
        this.userService = new userService_1.UserService();
        this.emailService = new emailService_1.EmailService();
        this.loggerService = new loggerService_1.LoggerService();
    }
    UserFacade.prototype.registerUser = function (user, email) {
        var userCreationMessage = this.userService.createUser(user);
        var emailMessage = this.emailService.sendEmail(email);
        var logMessage = this.loggerService.logMessage({
            message: 'User registered successfully',
        });
        return "".concat(userCreationMessage, "\n").concat(emailMessage, "\n").concat(logMessage);
    };
    return UserFacade;
}());
exports.UserFacade = UserFacade;
