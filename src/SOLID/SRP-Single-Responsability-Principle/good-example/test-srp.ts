import { createUser } from './UserService';

const userData = [
  {
    email: 'juan@example.com',
    password: 'MiPassword123',
    name: 'Juan Pérez',
  },
  {
    email: 'juanexample.com',
    password: 'MiPassword123',
    name: 'Juan Pérez',
  },
  {
    email: 'juan@example.com',
    password: '123',
    name: 'Juan Pérez',
  },
];

try {
  console.log(createUser(userData[0]));
} catch (error) {
  console.log(`Failed to create user: ${error}`);
}

try {
  console.log(createUser(userData[1]));
} catch (error) {
  console.log(`Failed to create user: ${error}`);
}
try {
  console.log(createUser(userData[2]));
} catch (error) {
  console.log(`Failed to create user: ${error}`);
}
