import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorFormulaWorkspaceRepository]),
    TypeOrmModule.forFeature([UsedIdentifierRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorFormulaWorkspaceController],
  providers: [MonitorFormulaWorkspaceService, MonitorFormulaMap],
  exports: [TypeOrmModule, MonitorFormulaWorkspaceService, MonitorFormulaMap],
})
export class MonitorFormulaWorkspaceModule {}
