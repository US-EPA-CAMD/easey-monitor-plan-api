import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitoringMethodController } from './monitoring-method.controller';
import { MonitoringMethodService } from './monitoring-method.service';
import { MonitorMethodRepository } from './monitoring-method.repository';

import { MonitorMethodMap } from '../maps/monitor-method.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorMethodRepository]),
  ],
  controllers: [MonitoringMethodController],
  providers: [
    MonitorMethodMap,
    MonitoringMethodService, 
  ],
})

export class MonitorMethodModule {}
