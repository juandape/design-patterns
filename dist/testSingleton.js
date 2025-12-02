"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authService_1 = require("./components/AuthService/authService");
var auth1 = authService_1.AuthService.getInstance();
var auth2 = authService_1.AuthService.getInstance();
auth1.setToken("abc123", 3);
console.log("Auth1 Token:", auth1.getToken());
console.log("Auth2 Token:", auth2.getToken());
console.log("Misma instancia? ", auth1 === auth2);
setTimeout(function () {
    console.log("Auth1 Token after expiration:", auth1.getToken());
    console.log("Auth2 Token after expiration:", auth2.getToken());
}, 4000);
