import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorAttributeController } from './monitor-attribute.controller';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorAttributeRepository])],
  controllers: [MonitorAttributeController],
  providers: [MonitorAttributeService, MonitorAttributeMap],
  exports: [TypeOrmModule, MonitorAttributeService, MonitorAttributeMap],
})
export class MonitorAttributeModule {}
