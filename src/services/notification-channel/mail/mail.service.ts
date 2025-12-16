import { Injectable } from '@nestjs/common';
import { SmtpService } from './smtp.service';

@Injectable()
export class MailService {
  constructor(private readonly smtpService: SmtpService) {}

  async send(email: string, title: string, content: string) {
    await this.smtpService.send(email, title, content);
  }
}
