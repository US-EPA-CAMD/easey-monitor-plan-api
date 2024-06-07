import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultController } from './monitor-default.controller';
import { MonitorDefaultRepository } from './monitor-default.repository';
import { MonitorDefaultService } from './monitor-default.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorDefaultRepository])],
  controllers: [MonitorDefaultController],
  providers: [
    MonitorDefaultRepository,
    MonitorDefaultService,
    MonitorDefaultMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorDefaultRepository,
    MonitorDefaultService,
    MonitorDefaultMap,
  ],
})
export class MonitorDefaultModule {}
