import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLoadController } from './monitor-load.controller';
import { MonitorLoadService } from './monitor-load.service';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLoadRepository } from './monitor-load.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorLoadRepository,
      MonitorLocationRepository,
      UnitOpStatusRepository,
    ]),
  ],
  controllers: [MonitorLoadController],
  providers: [
    MonitorLoadService,
    MonitorLocationMap,
    MonitorLoadMap,
    UnitOpStatusMap,
    UnitOpStatusDTO,
  ],
})
export class MonitorLoadModule {}
