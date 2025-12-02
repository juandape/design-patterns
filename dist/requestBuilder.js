"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestPayloadBuilder_1 = require("./components/requestPayloadBuilder");
var request = new requestPayloadBuilder_1.RequestPayloadBuilder()
    .setUser('John Doe', 'john.doe@example.com')
    .setFilters({ country: 'USA', ageRange: [25, 35] })
    .setPagination(1, 10)
    .include('posts', 'comments')
    .build();
console.log(request);
