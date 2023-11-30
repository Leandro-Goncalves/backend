import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';

export type sendEmailDTO = {
  to: string;
  subject: string;
  content: string;
};

@Processor('email-job')
export class EmailJob {
  constructor(private mailerService: MailerService) {}

  @Process()
  async handle(job: Job<sendEmailDTO>) {
    const { to, subject, content } = job.data;

    await this.mailerService.sendMail({
      to,
      subject,
      html: content,
    });
    return {};
  }
}
