import { User } from 'src/users/interfaces/user.interface';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
