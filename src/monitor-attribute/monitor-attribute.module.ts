import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeController } from './monitor-attribute.controller';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorAttributeRepository]), HttpModule],
  controllers: [MonitorAttributeController],
  providers: [
    MonitorAttributeRepository,
    MonitorAttributeService,
    MonitorAttributeMap,
  ],
  exports: [
    MonitorAttributeRepository,
    TypeOrmModule,
    MonitorAttributeService,
    MonitorAttributeMap,
  ],
})
export class MonitorAttributeModule {}
