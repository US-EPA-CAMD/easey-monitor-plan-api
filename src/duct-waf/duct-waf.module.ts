import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafController } from './duct-waf.controller';
import { DuctWafRepository } from './duct-waf.repository';
import { DuctWafService } from './duct-waf.service';

@Module({
  imports: [TypeOrmModule.forFeature([DuctWafRepository])],
  controllers: [DuctWafController],
  providers: [DuctWafRepository, DuctWafService, DuctWafMap],
  exports: [TypeOrmModule, DuctWafRepository, DuctWafService, DuctWafMap],
})
export class DuctWafModule {}
