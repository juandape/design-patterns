"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.token = null;
        this.expiresAt = null;
    }
    AuthService.getInstance = function () {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    };
    AuthService.prototype.setToken = function (token, expirationInSeconds) {
        this.token = token;
        this.expiresAt = Date.now() + expirationInSeconds * 1000;
    };
    AuthService.prototype.getToken = function () {
        if (this.expiresAt && Date.now() > this.expiresAt) {
            this.clearToken();
            return null;
        }
        return this.token;
    };
    AuthService.prototype.clearToken = function () {
        this.token = null;
        this.expiresAt = null;
    };
    AuthService.prototype.isTokenValid = function () {
        if (!this.token || !this.expiresAt)
            return false;
        return Date.now() < this.expiresAt;
    };
    return AuthService;
}());
exports.AuthService = AuthService;
