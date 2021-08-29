import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorDefaultController } from './monitor-default.controller';
import { MonitorDefaultService } from './monitor-default.service';
import { MonitorDefaultRepository } from './monitor-default.repository';
import { MonitorDefaultMap } from '../maps/monitor-default.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorDefaultRepository])],
  controllers: [MonitorDefaultController],
  providers: [MonitorDefaultService, MonitorDefaultMap],
  exports: [TypeOrmModule, MonitorDefaultService, MonitorDefaultMap],
})
export class MonitorDefaultModule {}
