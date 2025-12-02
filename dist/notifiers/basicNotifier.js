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
exports.BasicNotifier = void 0;
var notifier_1 = require("./notifier");
var BasicNotifier = /** @class */ (function (_super) {
    __extends(BasicNotifier, _super);
    function BasicNotifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BasicNotifier.prototype.notify = function (message) {
        this.channel.sendNotification("Basic: ".concat(message));
    };
    return BasicNotifier;
}(notifier_1.Notifier));
exports.BasicNotifier = BasicNotifier;
