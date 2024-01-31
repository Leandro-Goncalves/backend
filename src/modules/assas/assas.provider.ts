import { ASSAS_MODULE_OPTIONS } from './assas.constants';
import { AssasModuleOptions } from './assas.interface';

export function createAssasProvider(options: AssasModuleOptions): any[] {
  return [{ provide: ASSAS_MODULE_OPTIONS, useValue: options || {} }];
}
