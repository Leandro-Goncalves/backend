import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class ImagesService {
  constructor(@InjectS3() private readonly s3: S3) {}

  private s3Upload = async (file: Express.Multer.File, key: string) => {
    const params = {
      Bucket: 'imgs',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.putObject(params);
  };

  private s3Remove = async (key: string) => {
    const params = {
      Bucket: 'imgs',
      Key: key,
    };

    return this.s3.deleteObject(params);
  };

  async create(imageFile: Express.Multer.File, imageId: string) {
    return this.s3Upload(imageFile, imageId);
  }

  async update(uuid: string, file: Express.Multer.File) {
    await this.s3Remove(uuid);
    await this.s3Upload(file, uuid);
  }

  async remove(uuid: string) {
    await this.s3Remove(uuid);
  }
}
