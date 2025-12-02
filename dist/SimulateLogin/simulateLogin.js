"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateRequest = exports.simulateLogin = void 0;
var authService_1 = require("../AuthService/authService");
var simulateLogin = function () {
    var auth = authService_1.AuthService.getInstance();
    auth.setToken("my-secret-token");
};
exports.simulateLogin = simulateLogin;
var simulateRequest = function () {
    var auth = authService_1.AuthService.getInstance();
    console.log("sending request with token:", auth.getToken());
};
exports.simulateRequest = simulateRequest;
(0, exports.simulateLogin)();
(0, exports.simulateRequest)();
