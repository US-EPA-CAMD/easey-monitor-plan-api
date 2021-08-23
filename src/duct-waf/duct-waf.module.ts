import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuctWafRepository } from './duct-waf.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DuctWafRepository])],
  providers: [],
  controllers: [],
})
export class DuctWafModule {}
