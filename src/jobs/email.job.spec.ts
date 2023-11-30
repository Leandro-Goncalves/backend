import { Test, TestingModule } from '@nestjs/testing';
import { EmailJob, sendEmailDTO } from './email.job';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import Bull from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { faker } from '@faker-js/faker';

describe('Email job', () => {
  let emailJob: EmailJob;
  let mailerService: DeepMockProxy<MailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailJob, MailerService],
    })
      .overrideProvider(MailerService)
      .useValue(mockDeep<MailerService>())
      .compile();

    emailJob = module.get<EmailJob>(EmailJob);
    mailerService = module.get(MailerService);
  });

  it('should be defined', () => {
    const job = mockDeep<Bull.Job<sendEmailDTO>>();
    const emailData: sendEmailDTO = {
      to: faker.internet.email(),
      content: faker.lorem.paragraph(),
      subject: faker.lorem.sentence(),
    };
    job.data = emailData;

    emailJob.handle(job);
    expect(mailerService.sendMail).toBeCalledWith({
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.content,
    });
  });
});
