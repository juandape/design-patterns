"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
var QueryBuilder = /** @class */ (function () {
    function QueryBuilder() {
        this.params = {};
    }
    QueryBuilder.prototype.searchTerm = function (term) {
        this.params.search = term;
        return this;
    };
    QueryBuilder.prototype.where = function (key, value) {
        this.params[key] = String(value);
        return this;
    };
    QueryBuilder.prototype.sort = function (field) {
        this.params.sort = field;
        return this;
    };
    QueryBuilder.prototype.order = function (direction) {
        this.params.order = direction;
        return this;
    };
    QueryBuilder.prototype.paginate = function (page, limit) {
        this.params.page = page;
        this.params.limit = limit;
        return this;
    };
    QueryBuilder.prototype.build = function () {
        var searchParams = new URLSearchParams();
        Object.entries(this.params).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            searchParams.append(key, String(value));
        });
        return "".concat(searchParams.toString());
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;
