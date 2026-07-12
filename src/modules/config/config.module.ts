import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configurationLoader } from './configuration';
import { validate } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configurationLoader],
      validate,
      cache: true,
    }),
  ],
})
export class ConfigurationModule {}
