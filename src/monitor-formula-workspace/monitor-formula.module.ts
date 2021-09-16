import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorFormulaWorkspaceRepository])],
  controllers: [MonitorFormulaWorkspaceController],
  providers: [MonitorFormulaWorkspaceService, MonitorFormulaMap],
  exports: [TypeOrmModule, MonitorFormulaWorkspaceService, MonitorFormulaMap],
})
export class MonitorFormulaWorkspaceModule {}