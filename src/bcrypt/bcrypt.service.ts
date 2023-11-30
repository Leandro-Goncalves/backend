import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  saltOrRounds: number;
  constructor() {
    this.saltOrRounds = 10;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
