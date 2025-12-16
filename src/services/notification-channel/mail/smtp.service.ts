import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { ExternalApiFilterException } from 'src/common/exception-filters/external-api-exception.filter';

@Injectable()
export class SmtpService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const mailConfig = this.configService.get('mailer');

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: true,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });
  }

  async send(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('mail.from'),
        to,
        subject,
        html
      });
      console.log('log', info);

      return info;
    } catch (e) {
      console.log('log', e);
      throw new ExternalApiFilterException(e.message || ErrorMessages.MAIL_SEND_FAIL);
    }
  }
}
