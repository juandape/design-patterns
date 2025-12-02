"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.User = function (data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt;
};
exports.User.prototype.save = function () {
    console.log("Saving user ".concat(this.name, " to the database."));
    return this;
};
exports.User.prototype.updateEmail = function (newEmail) {
    this.email = newEmail;
};
exports.User.prototype.toJSON = function () {
    return {
        id: this.id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
    };
};
