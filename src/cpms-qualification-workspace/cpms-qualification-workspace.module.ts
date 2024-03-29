import { forwardRef, Module } from '@nestjs/common';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { CPMSQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CPMSQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [CPMSQualificationWorkspaceController],
  providers: [CPMSQualificationWorkspaceService, CPMSQualificationMap],
  exports: [
    TypeOrmModule,
    CPMSQualificationWorkspaceService,
    CPMSQualificationMap,
  ],
})
export class CPMSQualificationWorkspaceModule {}
