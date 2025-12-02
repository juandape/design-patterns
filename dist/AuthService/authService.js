"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.token = null;
    }
    AuthService.getInstance = function () {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    };
    AuthService.prototype.setToken = function (token) {
        this.token = token;
    };
    AuthService.prototype.getToken = function () {
        return this.token;
    };
    AuthService.prototype.clearToken = function () {
        this.token = null;
    };
    return AuthService;
}());
exports.AuthService = AuthService;
