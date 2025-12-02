"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryBuilder_1 = require("./components/queryBuilder");
var query = new queryBuilder_1.QueryBuilder()
    .searchTerm('example')
    .where('role', 'admin')
    .sort('name')
    .order('asc')
    .paginate(1, 10)
    .build();
console.log(query);
