import { Injectable } from '@nestjs/common';
import {
  ContactsApiApiKeys,
  ContactsApi,
  CreateContact,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from '@getbrevo/brevo';
import { Env } from '@/config/env';

const apiInstance = new ContactsApi();
const transactionalApiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(ContactsApiApiKeys.apiKey, Env.BrevoApi);

transactionalApiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  Env.BrevoApi,
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
      link: `https://caacaustore.com/resetPassword/${resetPassword}`,
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
