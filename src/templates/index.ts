import Handlebars from 'handlebars';
import { forgotPasswordViewProps } from './forgotPassword';
import * as path from 'node:path';
import * as fs from 'node:fs';

export interface viewPropsData {
  type: string;
  data: any;
}

type generateViewProps = forgotPasswordViewProps;

export const generateView = ({ type, data }: generateViewProps) => {
  const HBSpath = path.join(__dirname, type, 'view.hbs');
  const content = fs.readFileSync(HBSpath).toString('utf-8');
  if (!content) return '';

  const template = Handlebars.compile(content);
  return template(data);
};
