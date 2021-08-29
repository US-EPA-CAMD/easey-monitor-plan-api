import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanController } from './monitor-span.controller';
import { MonitorSpanService } from './monitor-span.service';
import { MonitorSpanRepository } from './monitor-span.repository';
import { MonitorSpanMap } from '../maps/monitor-span.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSpanRepository])],
  controllers: [MonitorSpanController],
  providers: [MonitorSpanService, MonitorSpanMap],
  exports: [TypeOrmModule, MonitorSpanService, MonitorSpanMap],
})
export class MonitorSpanModule {}
