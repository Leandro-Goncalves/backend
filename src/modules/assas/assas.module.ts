import { Module } from '@nestjs/common';
import { AssasService } from './assas.service';
import { AssasModuleOptions } from './assas.interface';
import { createAssasProvider } from './assas.provider';

@Module({
  providers: [AssasService],
  exports: [AssasService],
})
export class AssasModule {
  static register(options: AssasModuleOptions) {
    return {
      module: AssasModule,
      global: options.global,
      providers: createAssasProvider(options),
    };
  }
}
