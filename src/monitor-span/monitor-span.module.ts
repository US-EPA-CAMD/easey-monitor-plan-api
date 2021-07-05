import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanController } from './monitor-span.controller';
import { MonitorSpanService } from './monitor-span.service';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanRepository } from './monitor-span.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSpanRepository])],
  controllers: [MonitorSpanController],
  providers: [MonitorSpanService, MonitorSpanMap],
})
export class MonitorSpanModule {}
