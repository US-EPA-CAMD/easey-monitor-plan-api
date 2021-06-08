import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaController } from './monitor-formula.controller';
import { MonitorFormulaService } from './monitor-formula.service';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorFormulaRepository,
      MonitorLocationRepository,
      UnitOpStatusRepository,
    ]),
  ],
  controllers: [MonitorFormulaController],
  providers: [
    MonitorFormulaService,
    MonitorLocationMap,
    MonitorFormulaMap,
    UnitOpStatusMap,
    UnitOpStatusDTO,
  ],
})
export class MonitorFormulaModule {}
