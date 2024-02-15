import { S3Service } from '@/services/s3/s3.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ImagesService {
  constructor(private s3Service: S3Service) {}

  private s3Upload = async (file: Express.Multer.File, key: string) => {
    const params = {
      Key: key,
      Body: file.buffer,
    };

    return this.s3Service.create(params);
  };

  private s3Remove = async (key: string) => {
    return this.s3Service.delete(key);
  };

  async download(imageId: string) {
    return this.s3Service.get(imageId);
  }

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
