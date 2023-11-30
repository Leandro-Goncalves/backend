import { viewPropsData } from 'src/templates';

export class forgotPasswordViewProps implements viewPropsData {
  type: 'forgotPassword';
  data: {
    name: string;
    link: string;
  };
}
