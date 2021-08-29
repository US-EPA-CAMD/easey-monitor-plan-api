import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaController } from './monitor-formula.controller';
import { MonitorFormulaService } from './monitor-formula.service';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorFormulaRepository])],
  controllers: [MonitorFormulaController],
  providers: [MonitorFormulaService, MonitorFormulaMap],
  exports: [TypeOrmModule, MonitorFormulaService, MonitorFormulaMap],
})
export class MonitorFormulaModule {}
