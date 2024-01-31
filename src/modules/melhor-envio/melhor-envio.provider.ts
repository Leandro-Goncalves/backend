import { MELHOR_ENVIO_MODULE_OPTIONS } from './melhor-envio.constants';
import { MelhorEnvioModuleOptions } from './melhor-envio.interface';

export function createMelhorEnvioProvider(
  options: MelhorEnvioModuleOptions,
): any[] {
  return [{ provide: MELHOR_ENVIO_MODULE_OPTIONS, useValue: options || {} }];
}
