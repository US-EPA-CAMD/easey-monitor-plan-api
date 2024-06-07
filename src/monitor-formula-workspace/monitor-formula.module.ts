import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorFormulaChecksService } from './monitor-formula-checks.service';
import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { UsedIdentifierModule } from '../used-identifier/used-identifier.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorFormulaWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    UsedIdentifierModule,
  ],
  controllers: [MonitorFormulaWorkspaceController],
  providers: [
    MonitorFormulaChecksService,
    MonitorFormulaMap,
    MonitorFormulaWorkspaceRepository,
    MonitorFormulaWorkspaceService,
  ],
  exports: [
    MonitorFormulaChecksService,
    MonitorFormulaMap,
    MonitorFormulaWorkspaceRepository,
    MonitorFormulaWorkspaceService,
    TypeOrmModule,
  ],
})
export class MonitorFormulaWorkspaceModule {}
