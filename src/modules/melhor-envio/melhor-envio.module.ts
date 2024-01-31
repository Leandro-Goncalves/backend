import { Module } from '@nestjs/common';
import { MelhorEnvioService } from './melhor-envio.service';
import { MelhorEnvioModuleOptions } from './melhor-envio.interface';
import { createMelhorEnvioProvider } from './melhor-envio.provider';

@Module({
  providers: [MelhorEnvioService],
  exports: [MelhorEnvioService],
})
export class MelhorEnvioModule {
  static register(options: MelhorEnvioModuleOptions) {
    return {
      module: MelhorEnvioModule,
      global: options.global,
      providers: createMelhorEnvioProvider(options),
    };
  }
}
