import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
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
    MonitorFormulaWorkspaceRepository,
    MonitorFormulaWorkspaceService,
    MonitorFormulaMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorFormulaWorkspaceRepository,
    MonitorFormulaWorkspaceService,
    MonitorFormulaMap,
  ],
})
export class MonitorFormulaWorkspaceModule {}
