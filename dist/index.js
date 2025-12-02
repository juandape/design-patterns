"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userFacade_1 = require("./facade/userFacade");
var facade = new userFacade_1.UserFacade();
// Assuming User and Email are interfaces or classes, create appropriate objects:
var user = { name: "juan", email: "juan@mail.com" }; // Added required 'email' property
var email = { email: "juan@mail.com", message: "Welcome to our service!" }; // Adjust property name if Email type differs
var result = facade.registerUser(user, email);
console.log("\n Registration Result:");
console.log(result);
