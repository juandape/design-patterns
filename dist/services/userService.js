"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.createUser = function (_a) {
        var name = _a.name, email = _a.email;
        return "User ".concat(name, " with email ").concat(email, " created successfully.");
    };
    return UserService;
}());
exports.UserService = UserService;
