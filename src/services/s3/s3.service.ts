import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';

interface CreateParams {
  Key: string;
  Body: Buffer;
}

const PATH = './imgs';

@Injectable()
export class S3Service {
  checkIfFileOrDirectoryExists(path: string) {
    return fs.existsSync(path);
  }

  async create(paramns: CreateParams) {
    if (!this.checkIfFileOrDirectoryExists(PATH)) {
      fs.mkdirSync(PATH);
    }

    const writeFile = promisify(fs.writeFile);

    return await writeFile(`${PATH}/${paramns.Key}`, paramns.Body, 'utf8');
  }

  async delete(key: string) {
    const unlink = promisify(fs.unlink);

    return await unlink(`${PATH}/${key}`);
  }
}
