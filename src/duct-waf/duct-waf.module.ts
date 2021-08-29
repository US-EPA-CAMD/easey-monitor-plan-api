import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuctWafController } from './duct-waf.controller';
import { DuctWafService } from './duct-waf.service';
import { DuctWafRepository } from './duct-waf.repository';
import { DuctWafMap } from '../maps/duct-waf.map';

@Module({
  imports: [TypeOrmModule.forFeature([DuctWafRepository])],
  controllers: [DuctWafController],
  providers: [DuctWafService, DuctWafMap],
  exports: [TypeOrmModule, DuctWafService, DuctWafMap],
})
export class DuctWafModule {}
