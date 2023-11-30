import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';
import { faker } from '@faker-js/faker';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should encrypt text', () => {
    const password = faker.internet.password();
    expect(service.hash(password)).resolves.not.toBe(password);
  });

  it('should compare text', async () => {
    const password = faker.internet.password();
    const hash = await service.hash(password);
    expect(service.compare(password, hash)).resolves.toBe(true);
  });
});
