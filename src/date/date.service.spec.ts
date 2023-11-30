import { Test, TestingModule } from '@nestjs/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateService],
    }).compile();

    service = module.get<DateService>(DateService);
  });

  it('should generate a valid today date', () => {
    expect(service.today().date.toString()).toBe(new Date().toString());
  });

  it('should generate a valid tomorrow date', () => {
    expect(service.tomorrow().date.getTime()).toBeGreaterThan(
      new Date().getTime(),
    );
  });

  it('should generate a valid yesterday date', () => {
    expect(service.yesterday().date.getTime()).toBeLessThan(
      new Date().getTime(),
    );
  });

  it('isAfter should return correct result', () => {
    expect(service.tomorrow().isAfter(new Date())).toBe(true);
    expect(service.today().isAfter(service.tomorrow().date)).toBe(false);
  });

  it('isBefore should return correct result', () => {
    expect(service.today().isBefore(service.tomorrow().date)).toBe(true);
    expect(service.today().isBefore(service.yesterday().date)).toBe(false);
  });

  it('should add correct duration', () => {
    const date = service.yesterday();
    expect(date.add({ seconds: 40 }).date.getTime()).toBeGreaterThan(
      date.date.getTime(),
    );

    expect(date.add({ minutes: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ seconds: 1 }).date.getTime(),
    );

    expect(date.add({ hours: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ minutes: 1 }).date.getTime(),
    );

    expect(date.add({ days: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ hours: 1 }).date.getTime(),
    );

    expect(date.add({ weeks: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ days: 1 }).date.getTime(),
    );

    expect(date.add({ months: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ weeks: 1 }).date.getTime(),
    );

    expect(date.add({ years: 1 }).date.getTime()).toBeGreaterThan(
      date.add({ weeks: 1 }).date.getTime(),
    );
  });
});
