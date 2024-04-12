import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MatsMethodChecksService } from './mats-method-checks.service';
import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodWorkspaceService } from './mats-method.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsMethodWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MatsMethodWorkspaceController],
  providers: [
    MatsMethodWorkspaceRepository,
    MatsMethodWorkspaceService,
    MatsMethodMap,
    MatsMethodChecksService,
  ],
  exports: [
    TypeOrmModule,
    MatsMethodWorkspaceRepository,
    MatsMethodWorkspaceService,
    MatsMethodMap,
    MatsMethodChecksService,
  ],
})
export class MatsMethodWorkspaceModule {}
