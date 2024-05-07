import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanController } from './monitor-span.controller';
import { MonitorSpanRepository } from './monitor-span.repository';
import { MonitorSpanService } from './monitor-span.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSpanRepository])],
  controllers: [MonitorSpanController],
  providers: [MonitorSpanRepository, MonitorSpanService, MonitorSpanMap],
  exports: [
    TypeOrmModule,
    MonitorSpanRepository,
    MonitorSpanService,
    MonitorSpanMap,
  ],
})
export class MonitorSpanModule {}
