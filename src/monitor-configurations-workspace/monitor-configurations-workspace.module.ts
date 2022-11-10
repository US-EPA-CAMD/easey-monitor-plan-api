import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository]),
    MonitorPlanWorkspaceModule,
  ],
  controllers: [MonitorConfigurationsWorkspaceController],
  providers: [MonitorConfigurationsWorkspaceService],
})
export class MonitorConfigurationsWorkspaceModule {}
