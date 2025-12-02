"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userBase_1 = require("./userBase");
var user1 = new userBase_1.User({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
});
var user2 = new userBase_1.User({
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date(),
});
user1.save();
user2.updateEmail('jane.newemail@example.com');
console.log(user1.toJSON());
console.log(user2.toJSON());
console.log("User prototype check:", Object.getPrototypeOf(user1) === userBase_1.User.prototype); // true
console.log("User prototype:", Object.getPrototypeOf(user1)); // muestra el prototype del constructor
