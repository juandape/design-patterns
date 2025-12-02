"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    LoggerService.prototype.logMessage = function (_a) {
        var message = _a.message;
        return "Log -> ".concat(message);
    };
    return LoggerService;
}());
exports.LoggerService = LoggerService;
