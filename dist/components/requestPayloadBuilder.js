"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPayloadBuilder = void 0;
var RequestPayloadBuilder = /** @class */ (function () {
    function RequestPayloadBuilder() {
        this.payload = {};
    }
    RequestPayloadBuilder.prototype.build = function () {
        return __assign({}, this.payload);
    };
    RequestPayloadBuilder.prototype.setUser = function (name, email) {
        this.payload.user = { name: name, email: email };
        return this;
    };
    RequestPayloadBuilder.prototype.setFilters = function (filters) {
        this.payload.filters = filters;
        return this;
    };
    RequestPayloadBuilder.prototype.setPagination = function (page, limit) {
        this.payload.pagination = { page: page, limit: limit };
        return this;
    };
    RequestPayloadBuilder.prototype.include = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.payload.include = fields;
        return this;
    };
    return RequestPayloadBuilder;
}());
exports.RequestPayloadBuilder = RequestPayloadBuilder;
