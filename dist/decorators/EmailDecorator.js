"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDecorator = void 0;
var baseNotification_1 = require("../classes/baseNotification");
var EmailDecorator = /** @class */ (function (_super) {
    __extends(EmailDecorator, _super);
    function EmailDecorator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailDecorator.prototype.send = function (message) {
        var baseMessage = _super.prototype.send.call(this, message);
        return "".concat(baseMessage, " via Email");
    };
    return EmailDecorator;
}(baseNotification_1.BaseNotificationDecorator));
exports.EmailDecorator = EmailDecorator;
