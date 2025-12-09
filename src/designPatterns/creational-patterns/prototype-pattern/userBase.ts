interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserInstance {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  save(): UserInstance;
  updateEmail(newEmail: string): void;
  toJSON(): object;
}

export interface UserConstructor {
  new (data: UserData): UserInstance;
  prototype: UserInstance;
}

export const User: UserConstructor = function (
  this: UserInstance,
  data: UserData
) {
  this.id = data.id;
  this.name = data.name;
  this.email = data.email;
  this.createdAt = data.createdAt;
} as unknown as UserConstructor;

User.prototype.save = function () {
  console.log(`Saving user ${this.name} to the database.`);
  return this;
};

User.prototype.updateEmail = function (newEmail: string) {
  this.email = newEmail;
};

User.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
  };
};
