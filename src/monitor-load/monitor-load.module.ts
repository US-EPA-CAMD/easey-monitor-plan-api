import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadController } from './monitor-load.controller';
import { MonitorLoadRepository } from './monitor-load.repository';
import { MonitorLoadService } from './monitor-load.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLoadRepository])],
  controllers: [MonitorLoadController],
  providers: [MonitorLoadRepository, MonitorLoadService, MonitorLoadMap],
  exports: [
    TypeOrmModule,
    MonitorLoadRepository,
    MonitorLoadService,
    MonitorLoadMap,
  ],
})
export class MonitorLoadModule {}
