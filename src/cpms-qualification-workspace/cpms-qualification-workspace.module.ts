import { forwardRef, Module } from '@nestjs/common';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { CPMSQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { CPMSQualificationMap } from 'src/maps/cpms-qualification.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([CPMSQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
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
