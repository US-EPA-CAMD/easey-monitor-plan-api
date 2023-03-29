import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MatsMethodChecksService } from './mats-method-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsMethodWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MatsMethodWorkspaceController],
  providers: [
    MatsMethodWorkspaceService,
    MatsMethodMap,
    MatsMethodChecksService,
  ],
  exports: [
    TypeOrmModule,
    MatsMethodWorkspaceService,
    MatsMethodMap,
    MatsMethodChecksService,
  ],
})
export class MatsMethodWorkspaceModule {}
