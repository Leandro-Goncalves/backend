import { Injectable } from '@nestjs/common';
import { InjectBunnyCDN } from '@intelrug/nestjs-bunnycdn';
import { BunnyCDN } from '@intelrug/bunnycdn';

interface CreateParams {
  Key: string;
  Body: Buffer;
}

@Injectable()
export class S3Service {
  constructor(@InjectBunnyCDN() private readonly bunny: BunnyCDN) {}

  async create(paramns: CreateParams) {
    return this.bunny.storage.update('cacau', paramns.Key, paramns.Body);
  }

  async delete(key: string) {
    return this.bunny.storage.delete('cacau', key);
  }
}
