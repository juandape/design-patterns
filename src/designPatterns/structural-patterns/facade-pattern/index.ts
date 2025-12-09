import { UserFacade } from "./facade/userFacade";
import { Email, User } from "./types/user.type";

const facade = new UserFacade();

// Assuming User and Email are interfaces or classes, create appropriate objects:
const user: User = { name: "juan", email: "juan@mail.com" }; // Added required 'email' property
const email: Email = { email: "juan@mail.com", message: "Welcome to our service!" }; // Adjust property name if Email type differs

const result = facade.registerUser(user, email);

console.log("\n Registration Result:");
console.log(result);