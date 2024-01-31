import { Injectable } from '@nestjs/common';
import {
  ContactsApiApiKeys,
  ContactsApi,
  CreateContact,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from '@getbrevo/brevo';

const apiInstance = new ContactsApi();
const transactionalApiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  ContactsApiApiKeys.apiKey,
  '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',
);

transactionalApiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  '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',
);

interface CreateContactDTO {
  email: string;
  name: string;
}

interface SendForgotPasswordDTO {
  name: string;
  resetPassword: string;
  email: string;
}

@Injectable()
export class BrevoService {
  async createContact({ email, name }: CreateContactDTO) {
    const createContact = new CreateContact();

    createContact.email = email;
    createContact.attributes = {
      nome: name,
    };
    createContact.listIds = [2];

    await apiInstance.createContact(createContact);
  }

  async sendForgotPassword({
    name,
    resetPassword,
    email,
  }: SendForgotPasswordDTO) {
    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.templateId = 3;
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.replyTo = {
      email,
      name,
    };

    sendSmtpEmail.params = {
      name,
      link: `http://localhost:3000/resetPassword/${resetPassword}`,
    };

    transactionalApiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          'API called successfully. Returned data: ' + JSON.stringify(data),
        );
      },
      function (error) {
        console.error(error);
      },
    );
  }
}
