import { User } from './userBase';

/**
 * Creates a new instance of the `User` class with the specified properties.
 *
 * @remarks
 * This instance represents a user with a unique `id`, `name`, `email`, and the date of creation.
 *
 * @example
 * ```typescript
 * const user1 = new User({
 *   id: 1,
 *   name: 'John Doe',
 *   email: 'john.doe@example.com',
 *   createdAt: new Date(),
 * });
 * ```
 *
 * @see User
 */


const user1 = new User({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date(),
});
const user2 = new User({
  id: 2,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  createdAt: new Date(),
});

user1.save();
user2.updateEmail('jane.newemail@example.com');

console.log(user1.toJSON());
console.log(user2.toJSON());

console.log("User prototype check:", Object.getPrototypeOf(user1) === User.prototype); // true
/*
Esto confirma:
✔️ user1 hereda todos los métodos definidos en User.prototype
✔️ User está siendo usado correctamente como constructor
✔️ El vínculo del prototipo está establecido:
user1  →  User.prototype  →  Object.prototype
*/


console.log("User prototype:", Object.getPrototypeOf(user1)); // muestra el prototype del constructor
/*Los métodos NO viven dentro del objeto user1
Sino que están compartidos por todos los objetos creados con new User().
Cada nueva instancia tendrá solo sus propiedades propias:
id, name, email, createdAt

Y todas compartirán los métodos:
save()
updateEmail()
toJSON()
*/
