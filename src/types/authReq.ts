import { Roles } from 'src/routes/users/entities/user.entity';

export type AuthReq = Request & {
  user: {
    id: string;
    role: Roles[];
    establishmentUuid: string;
  };
};
