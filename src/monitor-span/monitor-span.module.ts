import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSpanController } from './monitor-span.controller';
import { MonitorSpanService } from './monitor-span.service';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorSpanRepository } from './monitor-span.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorSpanRepository,
      MonitorLocationRepository,
      UnitOpStatusRepository
    ])
  ],
  controllers: [
    MonitorSpanController
  ],
  providers: [
    MonitorSpanService,
    MonitorLocationMap,
    MonitorSpanMap,
    UnitOpStatusMap,
    UnitOpStatusDTO
  ],
})
export class MonitorSpanModule {}
