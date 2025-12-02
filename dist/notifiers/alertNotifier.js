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
exports.AlertNotifier = void 0;
var notifier_1 = require("./notifier");
var AlertNotifier = /** @class */ (function (_super) {
    __extends(AlertNotifier, _super);
    function AlertNotifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlertNotifier.prototype.notify = function (message) {
        this.channel.sendNotification("Alert: ".concat(message));
    };
    return AlertNotifier;
}(notifier_1.Notifier));
exports.AlertNotifier = AlertNotifier;
