export class CreateUserDto {
  email: string;
  password: string; // Remember to hash this in AuthService when registering users
}
