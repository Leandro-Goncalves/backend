export class UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  refreshToken: string;
}

export class User extends UserWithoutPassword {
  password: string;
}

export class UserWithToken extends UserWithoutPassword {
  token: string;
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}
