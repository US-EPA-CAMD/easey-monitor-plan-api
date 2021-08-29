import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLoadController } from './monitor-load.controller';
import { MonitorLoadService } from './monitor-load.service';
import { MonitorLoadRepository } from './monitor-load.repository';
import { MonitorLoadMap } from '../maps/monitor-load.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLoadRepository])],
  controllers: [MonitorLoadController],
  providers: [MonitorLoadService, MonitorLoadMap],
  exports: [TypeOrmModule, MonitorLoadService, MonitorLoadMap],
})
export class MonitorLoadModule {}
