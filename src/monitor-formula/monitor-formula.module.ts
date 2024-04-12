import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaController } from './monitor-formula.controller';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { MonitorFormulaService } from './monitor-formula.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorFormulaRepository])],
  controllers: [MonitorFormulaController],
  providers: [
    MonitorFormulaRepository,
    MonitorFormulaService,
    MonitorFormulaMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorFormulaRepository,
    MonitorFormulaService,
    MonitorFormulaMap,
  ],
})
export class MonitorFormulaModule {}
