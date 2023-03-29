import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository]),
    MonitorPlanWorkspaceModule,
  ],
  controllers: [MonitorConfigurationsWorkspaceController],
  providers: [MonitorConfigurationsWorkspaceService, ConfigService],
})
export class MonitorConfigurationsWorkspaceModule {}
